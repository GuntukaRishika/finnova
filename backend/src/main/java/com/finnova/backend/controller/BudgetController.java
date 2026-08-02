package com.finnova.backend.controller;

import com.finnova.backend.dto.BudgetRequest;
import com.finnova.backend.dto.BudgetResponse;
import com.finnova.backend.service.BudgetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budget")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;

    @PostMapping
    public ResponseEntity<BudgetResponse> create(@Valid @RequestBody BudgetRequest request) {
        return ResponseEntity.ok(budgetService.createBudget(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BudgetResponse> update(@PathVariable Long id, @Valid @RequestBody BudgetRequest request) {
        return ResponseEntity.ok(budgetService.updateBudget(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        budgetService.deleteBudget(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<BudgetResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(budgetService.getBudget(id));
    }

    @GetMapping
    public ResponseEntity<List<BudgetResponse>> getAll(@RequestParam int year, @RequestParam int month) {
        return ResponseEntity.ok(budgetService.getAll(year, month));
    }
}
