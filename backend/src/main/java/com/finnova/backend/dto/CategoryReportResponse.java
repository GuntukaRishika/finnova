package com.finnova.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class CategoryReportResponse {

    private String type;
    private int months;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal totalAmount;
    private List<CategoryReportItem> categories;
}
