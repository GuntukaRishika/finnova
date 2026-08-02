package com.finnova.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class CategorySummaryResponse {

    private String type;
    private int year;
    private int month;
    private BigDecimal totalAmount;
    private List<CategoryAmount> categories;
}
