package com.finnova.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class CategoryReportItem {

    private Long categoryId;
    private String categoryName;
    private BigDecimal totalAmount;
    private BigDecimal percentage;
    private BigDecimal changePercent;
    private List<CategoryTrendPoint> trend;
}
