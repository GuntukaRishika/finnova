package com.finnova.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
public class BudgetAnalysisItem {

    private Long categoryId;
    private String categoryName;
    private BigDecimal budgetAmount;
    private BigDecimal spent;
    private BigDecimal remaining;
    private int percentUsed;
    private String status; // OK, WARNING, EXCEEDED
}
