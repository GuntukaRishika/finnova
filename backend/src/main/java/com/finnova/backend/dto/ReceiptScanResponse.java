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
public class ReceiptScanResponse {

    private Long id;
    private String status;
    private String ocrProvider;
    private String merchant;
    private BigDecimal amount;
    private BigDecimal gstAmount;
    private LocalDate billDate;
    private String rawText;
    private Long expenseId;
    private LocalDateTime createdAt;
}
