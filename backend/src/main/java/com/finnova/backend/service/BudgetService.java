package com.finnova.backend.service;

import com.finnova.backend.dto.BudgetRequest;
import com.finnova.backend.dto.BudgetResponse;
import com.finnova.backend.entity.Budget;
import com.finnova.backend.entity.Category;
import com.finnova.backend.entity.User;
import com.finnova.backend.exception.ResourceNotFoundException;
import com.finnova.backend.repository.BudgetRepository;
import com.finnova.backend.repository.ExpenseRepository;
import com.finnova.backend.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private static final BigDecimal WARNING_THRESHOLD = new BigDecimal("0.8");

    private final BudgetRepository budgetRepository;
    private final CategoryService categoryService;
    private final ExpenseRepository expenseRepository;
    private final NotificationService notificationService;

    @Transactional
    public BudgetResponse createBudget(BudgetRequest request) {
        Long userId = currentUserId();
        if (budgetRepository.existsByUserIdAndCategoryIdAndYearAndMonth(
                userId, request.getCategoryId(), request.getYear(), request.getMonth())) {
            throw new IllegalArgumentException("A budget already exists for this category and period");
        }
        Category category = categoryService.getEntityById(request.getCategoryId());

        Budget budget = new Budget();
        budget.setUser(currentUserRef());
        budget.setCategory(category);
        budget.setAmount(request.getAmount());
        budget.setYear(request.getYear());
        budget.setMonth(request.getMonth());

        Budget saved = budgetRepository.save(budget);
        BigDecimal spent = calculateSpent(saved);
        evaluateThresholds(saved, spent);
        return toResponse(saved, spent);
    }

    @Transactional
    public BudgetResponse updateBudget(Long id, BudgetRequest request) {
        Budget budget = getOwnedBudget(id);
        Category category = categoryService.getEntityById(request.getCategoryId());

        boolean periodOrCategoryChanged = !budget.getCategory().getId().equals(request.getCategoryId())
                || !budget.getYear().equals(request.getYear())
                || !budget.getMonth().equals(request.getMonth());

        if (periodOrCategoryChanged && budgetRepository.existsByUserIdAndCategoryIdAndYearAndMonth(
                currentUserId(), request.getCategoryId(), request.getYear(), request.getMonth())) {
            throw new IllegalArgumentException("A budget already exists for this category and period");
        }

        budget.setCategory(category);
        budget.setAmount(request.getAmount());
        budget.setYear(request.getYear());
        budget.setMonth(request.getMonth());
        if (periodOrCategoryChanged) {
            budget.setWarningNotified(false);
            budget.setExceededNotified(false);
        }

        Budget saved = budgetRepository.save(budget);
        BigDecimal spent = calculateSpent(saved);
        evaluateThresholds(saved, spent);
        return toResponse(saved, spent);
    }

    @Transactional
    public void deleteBudget(Long id) {
        budgetRepository.delete(getOwnedBudget(id));
    }

    @Transactional(readOnly = true)
    public BudgetResponse getBudget(Long id) {
        Budget budget = getOwnedBudget(id);
        return toResponse(budget, calculateSpent(budget));
    }

    @Transactional(readOnly = true)
    public List<BudgetResponse> getAll(int year, int month) {
        return budgetRepository.findByUserIdAndYearAndMonth(currentUserId(), year, month).stream()
                .map(budget -> toResponse(budget, calculateSpent(budget)))
                .toList();
    }

    /**
     * Recalculates the budget for the given user/category/period and fires
     * warning/exceeded notifications when a threshold is newly crossed.
     * Called after every expense add/update/delete so budgets stay in sync.
     */
    @Transactional
    public void evaluateBudgetForExpense(Long userId, Long categoryId, int year, int month) {
        budgetRepository.findByUserIdAndCategoryIdAndYearAndMonth(userId, categoryId, year, month)
                .ifPresent(budget -> evaluateThresholds(budget, calculateSpent(budget)));
    }

    private void evaluateThresholds(Budget budget, BigDecimal spent) {
        BigDecimal limit = budget.getAmount();
        boolean exceeded = spent.compareTo(limit) > 0;
        boolean nearing = !exceeded && spent.compareTo(limit.multiply(WARNING_THRESHOLD)) >= 0;

        if (exceeded) {
            if (!budget.isExceededNotified()) {
                notificationService.notifyBudgetExceeded(budget, spent);
                budget.setExceededNotified(true);
            }
        } else {
            budget.setExceededNotified(false);
            if (nearing) {
                if (!budget.isWarningNotified()) {
                    notificationService.notifyBudgetWarning(budget, spent, calculatePercent(spent, limit));
                    budget.setWarningNotified(true);
                }
            } else {
                budget.setWarningNotified(false);
            }
        }
        budgetRepository.save(budget);
    }

    private BigDecimal calculateSpent(Budget budget) {
        YearMonth yearMonth = YearMonth.of(budget.getYear(), budget.getMonth());
        return expenseRepository.sumAmountByUserIdAndCategoryIdAndExpenseDateBetween(
                budget.getUser().getId(), budget.getCategory().getId(),
                yearMonth.atDay(1), yearMonth.atEndOfMonth());
    }

    private int calculatePercent(BigDecimal spent, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            return 0;
        }
        return spent.multiply(BigDecimal.valueOf(100))
                .divide(amount, 0, RoundingMode.HALF_UP)
                .intValue();
    }

    private Budget getOwnedBudget(Long id) {
        return budgetRepository.findByIdAndUserId(id, currentUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + id));
    }

    private Long currentUserId() {
        UserDetailsImpl principal = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return principal.getId();
    }

    private User currentUserRef() {
        User user = new User();
        user.setId(currentUserId());
        return user;
    }

    private BudgetResponse toResponse(Budget budget, BigDecimal spent) {
        BigDecimal remaining = budget.getAmount().subtract(spent);
        int percentUsed = calculatePercent(spent, budget.getAmount());
        boolean exceeded = spent.compareTo(budget.getAmount()) > 0;
        boolean nearingLimit = !exceeded && spent.compareTo(budget.getAmount().multiply(WARNING_THRESHOLD)) >= 0;

        return new BudgetResponse(
                budget.getId(),
                budget.getCategory().getId(),
                budget.getCategory().getName(),
                budget.getAmount(),
                budget.getYear(),
                budget.getMonth(),
                spent,
                remaining,
                percentUsed,
                exceeded,
                nearingLimit,
                budget.getCreatedAt(),
                budget.getUpdatedAt());
    }
}
