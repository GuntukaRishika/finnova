package com.finnova.backend.controller;

import com.finnova.backend.dto.IncomeRequest;
import com.finnova.backend.dto.IncomeResponse;
import com.finnova.backend.dto.MonthlyIncomeResponse;
import com.finnova.backend.service.IncomeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/income")
@RequiredArgsConstructor
public class IncomeController {

    private final IncomeService incomeService;

    @PostMapping
    public ResponseEntity<IncomeResponse> addIncome(@Valid @RequestBody IncomeRequest request) {
        return ResponseEntity.ok(incomeService.addIncome(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<IncomeResponse> updateIncome(@PathVariable Long id,
                                                        @Valid @RequestBody IncomeRequest request) {
        return ResponseEntity.ok(incomeService.updateIncome(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIncome(@PathVariable Long id) {
        incomeService.deleteIncome(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncomeResponse> getIncome(@PathVariable Long id) {
        return ResponseEntity.ok(incomeService.getIncome(id));
    }

    @GetMapping
    public ResponseEntity<Page<IncomeResponse>> getAll(@PageableDefault(size = 20, sort = "incomeDate") Pageable pageable) {
        return ResponseEntity.ok(incomeService.getAll(pageable));
    }

    @GetMapping("/monthly")
    public ResponseEntity<MonthlyIncomeResponse> getMonthlyIncome(@RequestParam int year, @RequestParam int month) {
        return ResponseEntity.ok(incomeService.getMonthlyIncome(year, month));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<IncomeResponse>> search(@RequestParam String keyword,
                                                        @PageableDefault(size = 20, sort = "incomeDate") Pageable pageable) {
        return ResponseEntity.ok(incomeService.search(keyword, pageable));
    }

    @GetMapping("/filter")
    public ResponseEntity<Page<IncomeResponse>> filter(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minAmount,
            @RequestParam(required = false) BigDecimal maxAmount,
            @PageableDefault(size = 20, sort = "incomeDate") Pageable pageable) {
        return ResponseEntity.ok(incomeService.filter(startDate, endDate, categoryId, minAmount, maxAmount, pageable));
    }
}
