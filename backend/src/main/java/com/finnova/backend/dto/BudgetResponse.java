package com.finnova.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class BudgetResponse {

    private Long id;
    private Long categoryId;
    private String categoryName;
    private BigDecimal amount;
    private Integer year;
    private Integer month;
    private BigDecimal spent;
    private BigDecimal remaining;
    private int percentUsed;
    private boolean exceeded;
    private boolean nearingLimit;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
