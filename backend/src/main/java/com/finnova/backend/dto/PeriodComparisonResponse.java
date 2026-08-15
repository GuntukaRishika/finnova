package com.finnova.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class PeriodComparisonResponse {

    private LocalDate periodAStart;
    private LocalDate periodAEnd;
    private LocalDate periodBStart;
    private LocalDate periodBEnd;
    private BigDecimal periodAIncome;
    private BigDecimal periodAExpense;
    private BigDecimal periodANet;
    private BigDecimal periodBIncome;
    private BigDecimal periodBExpense;
    private BigDecimal periodBNet;
    private BigDecimal incomeChangePercent;
    private BigDecimal expenseChangePercent;
    private BigDecimal netChangePercent;
    private List<CategoryComparisonItem> categoryComparison;
}
