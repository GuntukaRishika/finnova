package com.finnova.backend.service;

import com.finnova.backend.dto.IncomeRequest;
import com.finnova.backend.dto.IncomeResponse;
import com.finnova.backend.dto.MonthlyIncomeResponse;
import com.finnova.backend.entity.Category;
import com.finnova.backend.entity.Income;
import com.finnova.backend.exception.ResourceNotFoundException;
import com.finnova.backend.repository.IncomeRepository;
import com.finnova.backend.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IncomeService {

    private final IncomeRepository incomeRepository;
    private final CategoryService categoryService;

    @Transactional
    public IncomeResponse addIncome(IncomeRequest request) {
        Category category = categoryService.getEntityById(request.getCategoryId());

        Income income = new Income();
        income.setUser(currentUserRef());
        income.setCategory(category);
        income.setAmount(request.getAmount());
        income.setIncomeDate(request.getIncomeDate());
        income.setDescription(request.getDescription());

        return toResponse(incomeRepository.save(income));
    }

    @Transactional
    public IncomeResponse updateIncome(Long id, IncomeRequest request) {
        Income income = getOwnedIncome(id);
        Category category = categoryService.getEntityById(request.getCategoryId());

        income.setCategory(category);
        income.setAmount(request.getAmount());
        income.setIncomeDate(request.getIncomeDate());
        income.setDescription(request.getDescription());

        return toResponse(incomeRepository.save(income));
    }

    @Transactional
    public void deleteIncome(Long id) {
        Income income = getOwnedIncome(id);
        incomeRepository.delete(income);
    }

    @Transactional(readOnly = true)
    public IncomeResponse getIncome(Long id) {
        return toResponse(getOwnedIncome(id));
    }

    @Transactional(readOnly = true)
    public Page<IncomeResponse> getAll(Pageable pageable) {
        return incomeRepository.findAll(byUser(currentUserId()), pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public MonthlyIncomeResponse getMonthlyIncome(int year, int month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate start = yearMonth.atDay(1);
        LocalDate end = yearMonth.atEndOfMonth();
        Long userId = currentUserId();

        List<Income> entries = incomeRepository.findByUserIdAndIncomeDateBetween(
                userId, start, end, org.springframework.data.domain.Pageable.unpaged()).getContent();
        BigDecimal total = incomeRepository.sumAmountByUserIdAndIncomeDateBetween(userId, start, end);

        List<IncomeResponse> responses = entries.stream().map(this::toResponse).toList();
        return new MonthlyIncomeResponse(year, month, total, responses);
    }

    @Transactional(readOnly = true)
    public Page<IncomeResponse> search(String keyword, Pageable pageable) {
        return incomeRepository.search(currentUserId(), keyword, pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<IncomeResponse> filter(LocalDate startDate, LocalDate endDate, Long categoryId,
                                        BigDecimal minAmount, BigDecimal maxAmount, Pageable pageable) {
        Specification<Income> spec = byUser(currentUserId());

        if (startDate != null) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("incomeDate"), startDate));
        }
        if (endDate != null) {
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("incomeDate"), endDate));
        }
        if (categoryId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("category").get("id"), categoryId));
        }
        if (minAmount != null) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("amount"), minAmount));
        }
        if (maxAmount != null) {
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("amount"), maxAmount));
        }

        return incomeRepository.findAll(spec, pageable).map(this::toResponse);
    }

    private Specification<Income> byUser(Long userId) {
        return (root, query, cb) -> cb.equal(root.get("user").get("id"), userId);
    }

    private Income getOwnedIncome(Long id) {
        return incomeRepository.findByIdAndUserId(id, currentUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Income not found with id: " + id));
    }

    private Long currentUserId() {
        UserDetailsImpl principal = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return principal.getId();
    }

    private com.finnova.backend.entity.User currentUserRef() {
        com.finnova.backend.entity.User user = new com.finnova.backend.entity.User();
        user.setId(currentUserId());
        return user;
    }

    private IncomeResponse toResponse(Income income) {
        return new IncomeResponse(
                income.getId(),
                income.getCategory().getId(),
                income.getCategory().getName(),
                income.getAmount(),
                income.getIncomeDate(),
                income.getDescription(),
                income.getCreatedAt(),
                income.getUpdatedAt());
    }
}
