package com.finnova.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class RecentTransactionResponse {

    private final Long id;
    private final String title;
    private final String type;
    private final BigDecimal amount;
    private final LocalDate date;
}