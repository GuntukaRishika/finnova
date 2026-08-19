package com.finnova.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class PredictionPoint {

    private int year;
    private int month;
    private BigDecimal income;
    private BigDecimal expense;
    private BigDecimal savings;
    private boolean forecast;
}