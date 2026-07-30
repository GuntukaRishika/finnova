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
public class IncomeResponse {

    private Long id;
    private Long categoryId;
    private String categoryName;
    private BigDecimal amount;
    private LocalDate incomeDate;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
