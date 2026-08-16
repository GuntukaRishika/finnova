package com.finnova.backend.service;

import com.finnova.backend.dto.AiRecommendation;
import com.finnova.backend.dto.BudgetAnalysisItem;
import com.finnova.backend.dto.GoalAnalysisItem;
import com.finnova.backend.dto.SavingsAnalysis;
import com.finnova.backend.entity.Budget;
import com.finnova.backend.entity.Goal;
import com.finnova.backend.entity.GoalStatus;
import com.finnova.backend.repository.BudgetRepository;
import com.finnova.backend.repository.ExpenseRepository;
import com.finnova.backend.repository.GoalRepository;
import com.finnova.backend.repository.IncomeRepository;
import com.finnova.backend.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/**
 * Rule-based decision logic behind the "AI" financial advisor: computes budget, savings, and
 * goal analyses straight from the user's data and turns any flagged issues into prioritized
 * recommendations. Works entirely offline - no Gemini call required - so {@link AiService} can
 * fall back to it whenever the AI polish layer is unavailable.
 */
@Service
@RequiredArgsConstructor
public class RecommendationEngine {

    private static final BigDecimal WARNING_THRESHOLD = new BigDecimal("0.8");
    private static final BigDecimal LOW_SAVINGS_RATE = BigDecimal.valueOf(10);
    private static final BigDecimal SAVINGS_TREND_DELTA = BigDecimal.valueOf(2);
    private static final BigDecimal GOAL_BEHIND_THRESHOLD = BigDecimal.valueOf(10);

    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;
    private final BudgetRepository budgetRepository;
    private final GoalRepository goalRepository;

    @Transactional(readOnly = true)
    public List<BudgetAnalysisItem> analyzeBudgets() {
        Long userId = currentUserId();
        YearMonth current = YearMonth.now();
        List<Budget> budgets = budgetRepository.findByUserIdAndYearAndMonth(
                userId, current.getYear(), current.getMonthValue());

        return budgets.stream().map(budget -> {
            BigDecimal spent = expenseRepository.sumAmountByUserIdAndCategoryIdAndExpenseDateBetween(
                    userId, budget.getCategory().getId(), current.atDay(1), current.atEndOfMonth());
            BigDecimal remaining = budget.getAmount().subtract(spent);
            int percentUsed = percent(spent, budget.getAmount());

            String status;
            if (spent.compareTo(budget.getAmount()) > 0) {
                status = "EXCEEDED";
            } else if (spent.compareTo(budget.getAmount().multiply(WARNING_THRESHOLD)) >= 0) {
                status = "WARNING";
            } else {
                status = "OK";
            }

            return new BudgetAnalysisItem(budget.getCategory().getId(), budget.getCategory().getName(),
                    budget.getAmount(), spent, remaining, percentUsed, status);
        }).toList();
    }

    @Transactional(readOnly = true)
    public SavingsAnalysis analyzeSavings() {
        Long userId = currentUserId();
        YearMonth current = YearMonth.now();
        YearMonth previous = current.minusMonths(1);

        BigDecimal income = sumIncome(userId, current);
        BigDecimal expense = sumExpense(userId, current);
        BigDecimal net = income.subtract(expense);
        BigDecimal rate = savingsRate(income, net);

        BigDecimal previousIncome = sumIncome(userId, previous);
        BigDecimal previousNet = previousIncome.subtract(sumExpense(userId, previous));
        BigDecimal previousRate = savingsRate(previousIncome, previousNet);

        String trend;
        if (rate == null || previousRate == null) {
            trend = "UNKNOWN";
        } else {
            BigDecimal delta = rate.subtract(previousRate);
            if (delta.compareTo(SAVINGS_TREND_DELTA) > 0) {
                trend = "IMPROVING";
            } else if (delta.compareTo(SAVINGS_TREND_DELTA.negate()) < 0) {
                trend = "DECLINING";
            } else {
                trend = "STABLE";
            }
        }

        String status;
        if (rate == null) {
            status = "UNKNOWN";
        } else if (rate.compareTo(BigDecimal.ZERO) < 0) {
            status = "NEGATIVE";
        } else if (rate.compareTo(LOW_SAVINGS_RATE) < 0) {
            status = "LOW";
        } else {
            status = "HEALTHY";
        }

        return new SavingsAnalysis(income, expense, net, rate, previousRate, trend, status);
    }

    @Transactional(readOnly = true)
    public List<GoalAnalysisItem> analyzeGoals() {
        Long userId = currentUserId();
        LocalDate today = LocalDate.now();
        List<Goal> goals = goalRepository.findByUserIdAndStatusOrderByCreatedAtDesc(userId, GoalStatus.ACTIVE);

        return goals.stream().map(goal -> {
            BigDecimal progress = percentOf(goal.getCurrentAmount(), goal.getTargetAmount());
            LocalDate targetDate = goal.getTargetDate();
            BigDecimal expectedProgress = null;
            BigDecimal requiredMonthly = null;
            String status;

            boolean completed = progress.compareTo(BigDecimal.valueOf(100)) >= 0;
            if (targetDate == null) {
                status = completed ? "COMPLETED" : "NO_DEADLINE";
            } else if (today.isAfter(targetDate)) {
                status = completed ? "COMPLETED" : "OVERDUE";
            } else if (completed) {
                status = "COMPLETED";
            } else {
                LocalDate start = goal.getCreatedAt().toLocalDate();
                long totalDays = Math.max(ChronoUnit.DAYS.between(start, targetDate), 1);
                long elapsedDays = Math.max(ChronoUnit.DAYS.between(start, today), 0);
                expectedProgress = BigDecimal.valueOf(Math.min(100.0, elapsedDays * 100.0 / totalDays))
                        .setScale(1, RoundingMode.HALF_UP);

                long remainingMonths = Math.max(ChronoUnit.MONTHS.between(today, targetDate), 1);
                BigDecimal remainingAmount = goal.getTargetAmount().subtract(goal.getCurrentAmount());
                requiredMonthly = remainingAmount.compareTo(BigDecimal.ZERO) > 0
                        ? remainingAmount.divide(BigDecimal.valueOf(remainingMonths), 2, RoundingMode.HALF_UP)
                        : BigDecimal.ZERO;

                if (progress.compareTo(expectedProgress.subtract(GOAL_BEHIND_THRESHOLD)) < 0) {
                    status = "BEHIND";
                } else if (progress.compareTo(expectedProgress.add(GOAL_BEHIND_THRESHOLD)) > 0) {
                    status = "AHEAD";
                } else {
                    status = "ON_TRACK";
                }
            }

            return new GoalAnalysisItem(goal.getId(), goal.getName(), goal.getTargetAmount(), goal.getCurrentAmount(),
                    progress, targetDate, expectedProgress, requiredMonthly, status);
        }).toList();
    }

    /** Decision logic: turns the three analyses above into prioritized, human-readable recommendations. */
    @Transactional(readOnly = true)
    public List<AiRecommendation> generateRecommendations() {
        List<AiRecommendation> recommendations = new ArrayList<>();

        for (BudgetAnalysisItem budget : analyzeBudgets()) {
            if ("EXCEEDED".equals(budget.getStatus())) {
                recommendations.add(new AiRecommendation(
                        "Over budget on " + budget.getCategoryName(),
                        "You've spent " + budget.getSpent() + " against a " + budget.getBudgetAmount()
                                + " budget (" + budget.getPercentUsed() + "%). Consider cutting back on "
                                + budget.getCategoryName() + " for the rest of the month.",
                        "HIGH", "BUDGET"));
            } else if ("WARNING".equals(budget.getStatus())) {
                recommendations.add(new AiRecommendation(
                        budget.getCategoryName() + " budget nearly used up",
                        "You've used " + budget.getPercentUsed() + "% of your " + budget.getCategoryName()
                                + " budget with " + budget.getRemaining() + " left. Slow down spending in this category.",
                        "MEDIUM", "BUDGET"));
            }
        }

        SavingsAnalysis savings = analyzeSavings();
        if ("NEGATIVE".equals(savings.getStatus())) {
            recommendations.add(new AiRecommendation(
                    "Spending more than you earn",
                    "This month's expenses (" + savings.getExpenses() + ") exceed your income ("
                            + savings.getIncome() + "). Review discretionary spending to close the gap.",
                    "HIGH", "SAVINGS"));
        } else if ("LOW".equals(savings.getStatus())) {
            recommendations.add(new AiRecommendation(
                    "Low savings rate",
                    "You're saving " + savings.getSavingsRatePercent()
                            + "% of your income this month. Aim for at least 10-20% by trimming non-essential expenses.",
                    "MEDIUM", "SAVINGS"));
        }
        if ("DECLINING".equals(savings.getTrend())) {
            recommendations.add(new AiRecommendation(
                    "Savings rate is dropping",
                    "Your savings rate fell from " + savings.getPreviousSavingsRatePercent() + "% to "
                            + savings.getSavingsRatePercent() + "% compared to last month. Check what changed.",
                    "MEDIUM", "SAVINGS"));
        }

        for (GoalAnalysisItem goal : analyzeGoals()) {
            if ("BEHIND".equals(goal.getStatus())) {
                recommendations.add(new AiRecommendation(
                        "Behind on \"" + goal.getName() + "\"",
                        "You're at " + goal.getProgressPercent() + "% progress but should be around "
                                + goal.getExpectedProgressPercent() + "% by now. Contribute about "
                                + goal.getRequiredMonthlyContribution() + " per month to reach it by "
                                + goal.getTargetDate() + ".",
                        "HIGH", "GOAL"));
            } else if ("OVERDUE".equals(goal.getStatus())) {
                recommendations.add(new AiRecommendation(
                        "\"" + goal.getName() + "\" is overdue",
                        "The target date (" + goal.getTargetDate() + ") has passed and you're at "
                                + goal.getProgressPercent() + "% progress. Consider setting a new target date or "
                                + "increasing contributions.",
                        "HIGH", "GOAL"));
            }
        }

        return recommendations.stream()
                .sorted(Comparator.comparing(AiRecommendation::getPriority, Comparator.comparingInt(this::priorityRank)))
                .toList();
    }

    private int priorityRank(String priority) {
        return switch (priority) {
            case "HIGH" -> 0;
            case "MEDIUM" -> 1;
            default -> 2;
        };
    }

    private BigDecimal savingsRate(BigDecimal income, BigDecimal net) {
        if (income == null || income.compareTo(BigDecimal.ZERO) == 0) {
            return null;
        }
        return net.divide(income, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .setScale(1, RoundingMode.HALF_UP);
    }

    private int percent(BigDecimal spent, BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            return 0;
        }
        return spent.multiply(BigDecimal.valueOf(100)).divide(amount, 0, RoundingMode.HALF_UP).intValue();
    }

    private BigDecimal percentOf(BigDecimal part, BigDecimal whole) {
        if (whole == null || whole.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }
        return part.divide(whole, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .setScale(1, RoundingMode.HALF_UP);
    }

    private BigDecimal sumIncome(Long userId, YearMonth yearMonth) {
        return incomeRepository.sumAmountByUserIdAndIncomeDateBetween(userId, yearMonth.atDay(1), yearMonth.atEndOfMonth());
    }

    private BigDecimal sumExpense(Long userId, YearMonth yearMonth) {
        return expenseRepository.sumAmountByUserIdAndExpenseDateBetween(userId, yearMonth.atDay(1), yearMonth.atEndOfMonth());
    }

    private Long currentUserId() {
        UserDetailsImpl principal = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return principal.getId();
    }
}
