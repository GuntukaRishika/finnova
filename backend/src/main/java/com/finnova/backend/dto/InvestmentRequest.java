package com.finnova.backend.dto;

import com.finnova.backend.entity.InvestmentType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class InvestmentRequest {

    @NotNull
    private InvestmentType type;

    @NotBlank
    @Size(max = 100)
    private String assetName;

    @NotNull
    @DecimalMin(value = "0.01", message = "Amount invested must be greater than 0")
    private BigDecimal amountInvested;

    @NotNull
    @DecimalMin(value = "0.0", message = "Current value cannot be negative")
    private BigDecimal currentValue;

    private LocalDate purchaseDate;
}
