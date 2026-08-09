package com.finnova.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
public class PortfolioAllocationResponse {

    private String type;
    private BigDecimal currentValue;
    private int percent;
    private long count;
}
