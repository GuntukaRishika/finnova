package com.finnova.backend.service;

import com.finnova.backend.dto.ExpenseRequest;
import com.finnova.backend.dto.ExpenseResponse;
import com.finnova.backend.dto.MonthlyExpenseResponse;
import com.finnova.backend.entity.Category;
import com.finnova.backend.entity.Expense;
import com.finnova.backend.exception.ResourceNotFoundException;
import com.finnova.backend.repository.ExpenseRepository;
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
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final CategoryService categoryService;
    private final BudgetService budgetService;

    @Transactional
    public ExpenseResponse addExpense(ExpenseRequest request) {
        Category category = categoryService.getEntityById(request.getCategoryId());
        Long userId = currentUserId();

        Expense expense = new Expense();
        expense.setUser(currentUserRef());
        expense.setCategory(category);
        expense.setAmount(request.getAmount());
        expense.setExpenseDate(request.getExpenseDate());
        expense.setDescription(request.getDescription());

        Expense saved = expenseRepository.save(expense);
        budgetService.evaluateBudgetForExpense(userId, category.getId(),
                saved.getExpenseDate().getYear(), saved.getExpenseDate().getMonthValue());
        return toResponse(saved);
    }

    @Transactional
    public ExpenseResponse updateExpense(Long id, ExpenseRequest request) {
        Expense expense = getOwnedExpense(id);
        Category category = categoryService.getEntityById(request.getCategoryId());
        Long userId = currentUserId();

        Long oldCategoryId = expense.getCategory().getId();
        LocalDate oldDate = expense.getExpenseDate();

        expense.setCategory(category);
        expense.setAmount(request.getAmount());
        expense.setExpenseDate(request.getExpenseDate());
        expense.setDescription(request.getDescription());

        Expense saved = expenseRepository.save(expense);

        budgetService.evaluateBudgetForExpense(userId, oldCategoryId, oldDate.getYear(), oldDate.getMonthValue());
        budgetService.evaluateBudgetForExpense(userId, category.getId(),
                saved.getExpenseDate().getYear(), saved.getExpenseDate().getMonthValue());
        return toResponse(saved);
    }

    @Transactional
    public void deleteExpense(Long id) {
        Expense expense = getOwnedExpense(id);
        Long userId = currentUserId();
        Long categoryId = expense.getCategory().getId();
        LocalDate expenseDate = expense.getExpenseDate();

        expenseRepository.delete(expense);
        budgetService.evaluateBudgetForExpense(userId, categoryId, expenseDate.getYear(), expenseDate.getMonthValue());
    }

    @Transactional(readOnly = true)
    public ExpenseResponse getExpense(Long id) {
        return toResponse(getOwnedExpense(id));
    }

    @Transactional(readOnly = true)
    public Page<ExpenseResponse> getAll(Pageable pageable) {
        return expenseRepository.findAll(byUser(currentUserId()), pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public MonthlyExpenseResponse getMonthlyExpense(int year, int month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate start = yearMonth.atDay(1);
        LocalDate end = yearMonth.atEndOfMonth();
        Long userId = currentUserId();

        List<Expense> entries = expenseRepository.findByUserIdAndExpenseDateBetween(
                userId, start, end, org.springframework.data.domain.Pageable.unpaged()).getContent();
        BigDecimal total = expenseRepository.sumAmountByUserIdAndExpenseDateBetween(userId, start, end);

        List<ExpenseResponse> responses = entries.stream().map(this::toResponse).toList();
        return new MonthlyExpenseResponse(year, month, total, responses);
    }

    @Transactional(readOnly = true)
    public Page<ExpenseResponse> search(String keyword, Pageable pageable) {
        return expenseRepository.search(currentUserId(), keyword, pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<ExpenseResponse> filter(LocalDate startDate, LocalDate endDate, Long categoryId,
                                         BigDecimal minAmount, BigDecimal maxAmount, Pageable pageable) {
        Specification<Expense> spec = byUser(currentUserId());

        if (startDate != null) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("expenseDate"), startDate));
        }
        if (endDate != null) {
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("expenseDate"), endDate));
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

        return expenseRepository.findAll(spec, pageable).map(this::toResponse);
    }

    private Specification<Expense> byUser(Long userId) {
        return (root, query, cb) -> cb.equal(root.get("user").get("id"), userId);
    }

    private Expense getOwnedExpense(Long id) {
        return expenseRepository.findByIdAndUserId(id, currentUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));
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

    private ExpenseResponse toResponse(Expense expense) {
        return new ExpenseResponse(
                expense.getId(),
                expense.getCategory().getId(),
                expense.getCategory().getName(),
                expense.getAmount(),
                expense.getExpenseDate(),
                expense.getDescription(),
                expense.getCreatedAt(),
                expense.getUpdatedAt());
    }
}
