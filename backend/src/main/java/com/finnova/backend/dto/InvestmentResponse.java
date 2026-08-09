package com.finnova.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class InvestmentResponse {

    private Long id;
    private String type;
    private String assetName;
    private BigDecimal amountInvested;
    private BigDecimal currentValue;
    private BigDecimal profitLoss;
    private int profitLossPercent;
    private int allocationPercent;
    private LocalDate purchaseDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
