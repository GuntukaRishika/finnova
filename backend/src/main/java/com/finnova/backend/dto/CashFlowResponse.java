package com.finnova.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
public class CashFlowResponse {

    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal netCashFlow;
    private BigDecimal savingsRate;
    private BigDecimal averageDailyIncome;
    private BigDecimal averageDailyExpense;
    private String topExpenseCategory;
    private BigDecimal topExpenseCategoryAmount;
}
