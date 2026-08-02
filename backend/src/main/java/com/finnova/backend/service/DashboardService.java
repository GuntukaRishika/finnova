package com.finnova.backend.service;

import com.finnova.backend.dto.CashFlowResponse;
import com.finnova.backend.dto.CategoryAmount;
import com.finnova.backend.dto.CategorySummaryResponse;
import com.finnova.backend.dto.MonthlyPoint;
import com.finnova.backend.dto.MonthlySummaryResponse;
import com.finnova.backend.dto.YearlySummaryResponse;
import com.finnova.backend.repository.ExpenseRepository;
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
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private static final int SCALE = 2;

    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;

    @Transactional(readOnly = true)
    public MonthlySummaryResponse getMonthlySummary(int year, int month) {
        Long userId = currentUserId();
        YearMonth current = YearMonth.of(year, month);
        YearMonth previous = current.minusMonths(1);

        BigDecimal totalIncome = incomeSum(userId, current);
        BigDecimal totalExpense = expenseSum(userId, current);
        BigDecimal netCashFlow = totalIncome.subtract(totalExpense);

        BigDecimal prevIncome = incomeSum(userId, previous);
        BigDecimal prevExpense = expenseSum(userId, previous);
        BigDecimal prevNetCashFlow = prevIncome.subtract(prevExpense);

        return new MonthlySummaryResponse(
                year, month,
                totalIncome, totalExpense, netCashFlow,
                percentChange(prevIncome, totalIncome),
                percentChange(prevExpense, totalExpense),
                percentChange(prevNetCashFlow, netCashFlow));
    }

    @Transactional(readOnly = true)
    public YearlySummaryResponse getYearlySummary(int year) {
        Long userId = currentUserId();
        List<MonthlyPoint> months = new ArrayList<>();
        BigDecimal totalIncome = BigDecimal.ZERO;
        BigDecimal totalExpense = BigDecimal.ZERO;

        for (int month = 1; month <= 12; month++) {
            YearMonth yearMonth = YearMonth.of(year, month);
            BigDecimal income = incomeSum(userId, yearMonth);
            BigDecimal expense = expenseSum(userId, yearMonth);

            months.add(new MonthlyPoint(month, income, expense, income.subtract(expense)));
            totalIncome = totalIncome.add(income);
            totalExpense = totalExpense.add(expense);
        }

        return new YearlySummaryResponse(year, totalIncome, totalExpense, totalIncome.subtract(totalExpense), months);
    }

    @Transactional(readOnly = true)
    public CategorySummaryResponse getCategorySummary(int year, int month, String type) {
        Long userId = currentUserId();
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate start = yearMonth.atDay(1);
        LocalDate end = yearMonth.atEndOfMonth();
        boolean isIncome = "INCOME".equalsIgnoreCase(type);

        List<Object[]> rows = isIncome
                ? incomeRepository.sumAmountGroupByCategory(userId, start, end)
                : expenseRepository.sumAmountGroupByCategory(userId, start, end);

        BigDecimal total = rows.stream()
                .map(row -> (BigDecimal) row[2])
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<CategoryAmount> categories = rows.stream()
                .map(row -> new CategoryAmount(
                        (Long) row[0],
                        (String) row[1],
                        (BigDecimal) row[2],
                        percentageOf((BigDecimal) row[2], total)))
                .toList();

        return new CategorySummaryResponse(isIncome ? "INCOME" : "EXPENSE", year, month, total, categories);
    }

    @Transactional(readOnly = true)
    public CashFlowResponse getCashFlow(int year, int month) {
        Long userId = currentUserId();
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate start = yearMonth.atDay(1);
        LocalDate end = yearMonth.atEndOfMonth();
        int daysInMonth = yearMonth.lengthOfMonth();

        BigDecimal totalIncome = incomeRepository.sumAmountByUserIdAndIncomeDateBetween(userId, start, end);
        BigDecimal totalExpense = expenseRepository.sumAmountByUserIdAndExpenseDateBetween(userId, start, end);
        BigDecimal netCashFlow = totalIncome.subtract(totalExpense);

        List<Object[]> topCategories = expenseRepository.sumAmountGroupByCategory(userId, start, end);
        String topExpenseCategory = topCategories.isEmpty() ? null : (String) topCategories.get(0)[1];
        BigDecimal topExpenseCategoryAmount = topCategories.isEmpty() ? BigDecimal.ZERO : (BigDecimal) topCategories.get(0)[2];

        return new CashFlowResponse(
                start, end,
                totalIncome, totalExpense, netCashFlow,
                percentageOf(netCashFlow, totalIncome),
                divide(totalIncome, daysInMonth),
                divide(totalExpense, daysInMonth),
                topExpenseCategory,
                topExpenseCategoryAmount);
    }

    private BigDecimal incomeSum(Long userId, YearMonth yearMonth) {
        return incomeRepository.sumAmountByUserIdAndIncomeDateBetween(
                userId, yearMonth.atDay(1), yearMonth.atEndOfMonth());
    }

    private BigDecimal expenseSum(Long userId, YearMonth yearMonth) {
        return expenseRepository.sumAmountByUserIdAndExpenseDateBetween(
                userId, yearMonth.atDay(1), yearMonth.atEndOfMonth());
    }

    private BigDecimal percentChange(BigDecimal previous, BigDecimal current) {
        if (previous == null || previous.compareTo(BigDecimal.ZERO) == 0) {
            return null;
        }
        return current.subtract(previous)
                .divide(previous.abs(), SCALE, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .setScale(SCALE, RoundingMode.HALF_UP);
    }

    private BigDecimal percentageOf(BigDecimal part, BigDecimal whole) {
        if (whole == null || whole.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return part.divide(whole, SCALE + 2, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .setScale(SCALE, RoundingMode.HALF_UP);
    }

    private BigDecimal divide(BigDecimal amount, int divisor) {
        return amount.divide(BigDecimal.valueOf(divisor), SCALE, RoundingMode.HALF_UP);
    }

    private Long currentUserId() {
        UserDetailsImpl principal = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return principal.getId();
    }
}
