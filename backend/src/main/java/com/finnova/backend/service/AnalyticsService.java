package com.finnova.backend.service;

import com.finnova.backend.dto.CategoryComparisonItem;
import com.finnova.backend.dto.CategoryReportItem;
import com.finnova.backend.dto.CategoryReportResponse;
import com.finnova.backend.dto.CategoryTrendPoint;
import com.finnova.backend.dto.DailyAmount;
import com.finnova.backend.dto.GrowthPoint;
import com.finnova.backend.dto.InvestmentPerformance;
import com.finnova.backend.dto.PeriodComparisonResponse;
import com.finnova.backend.dto.PortfolioAllocationResponse;
import com.finnova.backend.dto.PortfolioAnalysisResponse;
import com.finnova.backend.dto.PortfolioSummaryResponse;
import com.finnova.backend.dto.PredictionPoint;
import com.finnova.backend.dto.PredictionResponse;
import com.finnova.backend.dto.SpendingHeatmapResponse;
import com.finnova.backend.entity.Investment;
import com.finnova.backend.repository.ExpenseRepository;
import com.finnova.backend.repository.IncomeRepository;
import com.finnova.backend.repository.InvestmentRepository;
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
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private static final int SCALE = 2;

    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;
    private final InvestmentRepository investmentRepository;
    private final PortfolioService portfolioService;

    @Transactional(readOnly = true)
    public PredictionResponse getPredictions(int year, int month, int historyMonths, int forecastMonths) {
        Long userId = currentUserId();
        int historySize = Math.max(1, Math.min(historyMonths, 24));
        int forecastSize = Math.max(1, Math.min(forecastMonths, 12));
        YearMonth anchor = YearMonth.of(year, month);
        YearMonth start = anchor.minusMonths(historySize - 1L);
        List<PredictionPoint> points = new ArrayList<>();
        List<BigDecimal> incomes = new ArrayList<>();
        List<BigDecimal> expenses = new ArrayList<>();

        for (YearMonth cursor = start; !cursor.isAfter(anchor); cursor = cursor.plusMonths(1)) {
            BigDecimal income = incomeSum(userId, cursor);
            BigDecimal expense = expenseSum(userId, cursor);
            incomes.add(income);
            expenses.add(expense);
            points.add(new PredictionPoint(cursor.getYear(), cursor.getMonthValue(), income, expense,
                    income.subtract(expense), false));
        }

        BigDecimal averageIncome = average(incomes);
        BigDecimal averageExpense = average(expenses);
        for (int offset = 1; offset <= forecastSize; offset++) {
            YearMonth cursor = anchor.plusMonths(offset);
            BigDecimal predictedIncome = averageIncome;
            BigDecimal predictedExpense = averageExpense;
            points.add(new PredictionPoint(cursor.getYear(), cursor.getMonthValue(), predictedIncome, predictedExpense,
                    predictedIncome.subtract(predictedExpense), true));
        }

        BigDecimal averageSavings = averageIncome.subtract(averageExpense);
        return new PredictionResponse(historySize, forecastSize, points, averageIncome, averageExpense, averageSavings,
                trend(incomes), trend(expenses), trend(points.subList(0, historySize).stream().map(PredictionPoint::getSavings).toList()));
    }

    @Transactional(readOnly = true)
    public List<GrowthPoint> getMonthlyGrowth(int year, int month, int months) {
        Long userId = currentUserId();
        YearMonth end = YearMonth.of(year, month);
        YearMonth start = end.minusMonths(Math.max(months, 1) - 1L);

        List<GrowthPoint> points = new ArrayList<>();
        BigDecimal prevIncome = incomeSum(userId, start.minusMonths(1));
        BigDecimal prevExpense = expenseSum(userId, start.minusMonths(1));
        BigDecimal prevNet = prevIncome.subtract(prevExpense);

        for (YearMonth cursor = start; !cursor.isAfter(end); cursor = cursor.plusMonths(1)) {
            BigDecimal income = incomeSum(userId, cursor);
            BigDecimal expense = expenseSum(userId, cursor);
            BigDecimal net = income.subtract(expense);

            points.add(new GrowthPoint(
                    cursor.getYear(), cursor.getMonthValue(),
                    income, expense, net,
                    percentChange(prevIncome, income),
                    percentChange(prevExpense, expense),
                    percentChange(prevNet, net)));

            prevIncome = income;
            prevExpense = expense;
            prevNet = net;
        }
        return points;
    }

    @Transactional(readOnly = true)
    public CategoryReportResponse getCategoryReport(int year, int month, int months, String type) {
        Long userId = currentUserId();
        boolean isIncome = "INCOME".equalsIgnoreCase(type);
        YearMonth end = YearMonth.of(year, month);
        YearMonth start = end.minusMonths(Math.max(months, 1) - 1L);

        List<YearMonth> range = new ArrayList<>();
        for (YearMonth cursor = start; !cursor.isAfter(end); cursor = cursor.plusMonths(1)) {
            range.add(cursor);
        }

        Map<Long, String> names = new LinkedHashMap<>();
        Map<Long, BigDecimal> totals = new LinkedHashMap<>();
        List<Map<Long, BigDecimal>> monthlyAmounts = new ArrayList<>();

        for (YearMonth cursor : range) {
            LocalDate rangeStart = cursor.atDay(1);
            LocalDate rangeEnd = cursor.atEndOfMonth();
            List<Object[]> rows = isIncome
                    ? incomeRepository.sumAmountGroupByCategory(userId, rangeStart, rangeEnd)
                    : expenseRepository.sumAmountGroupByCategory(userId, rangeStart, rangeEnd);

            Map<Long, BigDecimal> monthMap = new HashMap<>();
            for (Object[] row : rows) {
                Long categoryId = (Long) row[0];
                String categoryName = (String) row[1];
                BigDecimal amount = (BigDecimal) row[2];
                names.putIfAbsent(categoryId, categoryName);
                totals.merge(categoryId, amount, BigDecimal::add);
                monthMap.put(categoryId, amount);
            }
            monthlyAmounts.add(monthMap);
        }

        BigDecimal grandTotal = totals.values().stream().reduce(BigDecimal.ZERO, BigDecimal::add);

        List<CategoryReportItem> categories = names.keySet().stream()
                .map(categoryId -> {
                    List<CategoryTrendPoint> trend = new ArrayList<>();
                    for (int i = 0; i < range.size(); i++) {
                        YearMonth ym = range.get(i);
                        BigDecimal amount = monthlyAmounts.get(i).getOrDefault(categoryId, BigDecimal.ZERO);
                        trend.add(new CategoryTrendPoint(ym.getYear(), ym.getMonthValue(), amount));
                    }
                    BigDecimal latest = trend.get(trend.size() - 1).getAmount();
                    BigDecimal previous = trend.size() > 1 ? trend.get(trend.size() - 2).getAmount() : BigDecimal.ZERO;

                    return new CategoryReportItem(
                            categoryId, names.get(categoryId), totals.get(categoryId),
                            percentageOf(totals.get(categoryId), grandTotal),
                            percentChange(previous, latest),
                            trend);
                })
                .sorted(Comparator.comparing(CategoryReportItem::getTotalAmount).reversed())
                .toList();

        return new CategoryReportResponse(isIncome ? "INCOME" : "EXPENSE", range.size(),
                start.atDay(1), end.atEndOfMonth(), grandTotal, categories);
    }

    @Transactional(readOnly = true)
    public PortfolioAnalysisResponse getPortfolioAnalysis() {
        Long userId = currentUserId();
        PortfolioSummaryResponse summary = portfolioService.getSummary();
        List<PortfolioAllocationResponse> allocation = portfolioService.getAllocation();

        List<InvestmentPerformance> performances = investmentRepository.findByUserId(userId).stream()
                .map(this::toPerformance)
                .toList();

        List<InvestmentPerformance> topPerformers = performances.stream()
                .sorted(Comparator.comparing(InvestmentPerformance::getProfitLossPercent,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(3)
                .toList();

        List<InvestmentPerformance> underPerformers = performances.stream()
                .sorted(Comparator.comparing(InvestmentPerformance::getProfitLossPercent,
                        Comparator.nullsLast(Comparator.naturalOrder())))
                .limit(3)
                .toList();

        return new PortfolioAnalysisResponse(summary, allocation, topPerformers, underPerformers);
    }

    @Transactional(readOnly = true)
    public SpendingHeatmapResponse getSpendingHeatmap(int year, int month) {
        Long userId = currentUserId();
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate start = yearMonth.atDay(1);
        LocalDate end = yearMonth.atEndOfMonth();

        Map<LocalDate, BigDecimal> byDate = new HashMap<>();
        for (Object[] row : expenseRepository.sumAmountGroupByDate(userId, start, end)) {
            byDate.put((LocalDate) row[0], (BigDecimal) row[1]);
        }

        List<DailyAmount> days = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;
        for (LocalDate date = start; !date.isAfter(end); date = date.plusDays(1)) {
            BigDecimal amount = byDate.getOrDefault(date, BigDecimal.ZERO);
            days.add(new DailyAmount(date, amount));
            total = total.add(amount);
        }

        BigDecimal average = divide(total, yearMonth.lengthOfMonth());
        return new SpendingHeatmapResponse(year, month, total, average, days);
    }

    @Transactional(readOnly = true)
    public PeriodComparisonResponse getComparison(int yearA, int monthA, int yearB, int monthB) {
        Long userId = currentUserId();
        YearMonth a = YearMonth.of(yearA, monthA);
        YearMonth b = YearMonth.of(yearB, monthB);

        BigDecimal incomeA = incomeSum(userId, a);
        BigDecimal expenseA = expenseSum(userId, a);
        BigDecimal netA = incomeA.subtract(expenseA);

        BigDecimal incomeB = incomeSum(userId, b);
        BigDecimal expenseB = expenseSum(userId, b);
        BigDecimal netB = incomeB.subtract(expenseB);

        Map<Long, String> names = new LinkedHashMap<>();
        Map<Long, BigDecimal> amountsA = new HashMap<>();
        Map<Long, BigDecimal> amountsB = new HashMap<>();

        for (Object[] row : expenseRepository.sumAmountGroupByCategory(userId, a.atDay(1), a.atEndOfMonth())) {
            names.put((Long) row[0], (String) row[1]);
            amountsA.put((Long) row[0], (BigDecimal) row[2]);
        }
        for (Object[] row : expenseRepository.sumAmountGroupByCategory(userId, b.atDay(1), b.atEndOfMonth())) {
            names.putIfAbsent((Long) row[0], (String) row[1]);
            amountsB.put((Long) row[0], (BigDecimal) row[2]);
        }

        List<CategoryComparisonItem> categoryComparison = names.entrySet().stream()
                .map(entry -> {
                    BigDecimal amountA = amountsA.getOrDefault(entry.getKey(), BigDecimal.ZERO);
                    BigDecimal amountB = amountsB.getOrDefault(entry.getKey(), BigDecimal.ZERO);
                    return new CategoryComparisonItem(entry.getKey(), entry.getValue(), amountA, amountB,
                            percentChange(amountA, amountB));
                })
                .sorted(Comparator.comparing(CategoryComparisonItem::getPeriodBAmount).reversed())
                .toList();

        return new PeriodComparisonResponse(
                a.atDay(1), a.atEndOfMonth(), b.atDay(1), b.atEndOfMonth(),
                incomeA, expenseA, netA,
                incomeB, expenseB, netB,
                percentChange(incomeA, incomeB), percentChange(expenseA, expenseB), percentChange(netA, netB),
                categoryComparison);
    }

    private InvestmentPerformance toPerformance(Investment investment) {
        BigDecimal profitLoss = investment.getCurrentValue().subtract(investment.getAmountInvested());
        return new InvestmentPerformance(
                investment.getId(), investment.getAssetName(), investment.getType().name(),
                investment.getAmountInvested(), investment.getCurrentValue(), profitLoss,
                percentChange(investment.getAmountInvested(), investment.getCurrentValue()));
    }

    private BigDecimal incomeSum(Long userId, YearMonth yearMonth) {
        return incomeRepository.sumAmountByUserIdAndIncomeDateBetween(
                userId, yearMonth.atDay(1), yearMonth.atEndOfMonth());
    }

    private BigDecimal average(List<BigDecimal> values) {
        if (values.isEmpty()) {
            return BigDecimal.ZERO;
        }
        return values.stream().reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(BigDecimal.valueOf(values.size()), SCALE, RoundingMode.HALF_UP);
    }

    private String trend(List<BigDecimal> values) {
        if (values.size() < 2) {
            return "STABLE";
        }
        BigDecimal first = values.get(0);
        BigDecimal last = values.get(values.size() - 1);
        if (last.compareTo(first) > 0) {
            return "UP";
        }
        if (last.compareTo(first) < 0) {
            return "DOWN";
        }
        return "STABLE";
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
