package com.finnova.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
public class SavingsAnalysis {

    private BigDecimal income;
    private BigDecimal expenses;
    private BigDecimal netSavings;
    private BigDecimal savingsRatePercent; // null if there was no income to compute a rate from
    private BigDecimal previousSavingsRatePercent;
    private String trend; // IMPROVING, DECLINING, STABLE, UNKNOWN
    private String status; // HEALTHY, LOW, NEGATIVE, UNKNOWN
}
