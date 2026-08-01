package com.finnova.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class MonthlyExpenseResponse {

    private int year;
    private int month;
    private BigDecimal totalAmount;
    private List<ExpenseResponse> entries;
}
