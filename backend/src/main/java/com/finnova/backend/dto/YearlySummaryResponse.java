package com.finnova.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class YearlySummaryResponse {

    private int year;
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal netCashFlow;
    private List<MonthlyPoint> months;
}
