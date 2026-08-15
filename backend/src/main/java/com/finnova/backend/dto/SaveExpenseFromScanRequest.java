package com.finnova.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class SaveExpenseFromScanRequest {

    @NotNull
    private Long categoryId;

    // Optional overrides - if omitted, the parsed OCR values from the scan are used.
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;

    private LocalDate expenseDate;

    @Size(max = 255)
    private String description;
}
