package com.finnova.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
public class CategoryComparisonItem {

    private Long categoryId;
    private String categoryName;
    private BigDecimal periodAAmount;
    private BigDecimal periodBAmount;
    private BigDecimal changePercent;
}
