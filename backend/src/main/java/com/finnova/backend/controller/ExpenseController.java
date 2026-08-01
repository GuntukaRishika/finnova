package com.finnova.backend.controller;

import com.finnova.backend.dto.ExpenseRequest;
import com.finnova.backend.dto.ExpenseResponse;
import com.finnova.backend.dto.MonthlyExpenseResponse;
import com.finnova.backend.service.ExpenseService;
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
@RequestMapping("/api/expense")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<ExpenseResponse> addExpense(@Valid @RequestBody ExpenseRequest request) {
        return ResponseEntity.ok(expenseService.addExpense(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseResponse> updateExpense(@PathVariable Long id,
                                                           @Valid @RequestBody ExpenseRequest request) {
        return ResponseEntity.ok(expenseService.updateExpense(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExpenseResponse> getExpense(@PathVariable Long id) {
        return ResponseEntity.ok(expenseService.getExpense(id));
    }

    @GetMapping
    public ResponseEntity<Page<ExpenseResponse>> getAll(@PageableDefault(size = 20, sort = "expenseDate") Pageable pageable) {
        return ResponseEntity.ok(expenseService.getAll(pageable));
    }

    @GetMapping("/monthly")
    public ResponseEntity<MonthlyExpenseResponse> getMonthlyExpense(@RequestParam int year, @RequestParam int month) {
        return ResponseEntity.ok(expenseService.getMonthlyExpense(year, month));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ExpenseResponse>> search(@RequestParam String keyword,
                                                          @PageableDefault(size = 20, sort = "expenseDate") Pageable pageable) {
        return ResponseEntity.ok(expenseService.search(keyword, pageable));
    }

    @GetMapping("/filter")
    public ResponseEntity<Page<ExpenseResponse>> filter(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minAmount,
            @RequestParam(required = false) BigDecimal maxAmount,
            @PageableDefault(size = 20, sort = "expenseDate") Pageable pageable) {
        return ResponseEntity.ok(expenseService.filter(startDate, endDate, categoryId, minAmount, maxAmount, pageable));
    }
}
