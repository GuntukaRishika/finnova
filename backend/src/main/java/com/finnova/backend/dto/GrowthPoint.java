package com.finnova.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
public class GrowthPoint {

    private int year;
    private int month;
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal netCashFlow;
    private BigDecimal incomeGrowthPercent;
    private BigDecimal expenseGrowthPercent;
    private BigDecimal netGrowthPercent;
}
