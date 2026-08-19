package com.finnova.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@AllArgsConstructor
public class PredictionResponse {

    private int historyMonths;
    private int forecastMonths;
    private List<PredictionPoint> points;
    private BigDecimal averageIncome;
    private BigDecimal averageExpense;
    private BigDecimal averageSavings;
    private String incomeTrend;
    private String expenseTrend;
    private String savingsTrend;
}