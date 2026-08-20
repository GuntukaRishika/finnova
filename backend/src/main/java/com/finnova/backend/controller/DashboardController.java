package com.finnova.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.finnova.backend.dto.CashFlowResponse;
import com.finnova.backend.dto.CategorySummaryResponse;
import com.finnova.backend.dto.MonthlySummaryResponse;
import com.finnova.backend.dto.RecentTransactionResponse;
import com.finnova.backend.dto.YearlySummaryResponse;
import com.finnova.backend.service.DashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/monthly-summary")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<MonthlySummaryResponse> getMonthlySummary(@RequestParam int year, @RequestParam int month) {
        return ResponseEntity.ok(dashboardService.getMonthlySummary(year, month));
    }

    @GetMapping("/yearly-summary")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<YearlySummaryResponse> getYearlySummary(@RequestParam int year) {
        return ResponseEntity.ok(dashboardService.getYearlySummary(year));
    }

    @GetMapping("/category-summary")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<CategorySummaryResponse> getCategorySummary(
            @RequestParam int year,
            @RequestParam int month,
            @RequestParam(defaultValue = "EXPENSE") String type) {
        return ResponseEntity.ok(dashboardService.getCategorySummary(year, month, type));
    }

    @GetMapping("/cash-flow")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<CashFlowResponse> getCashFlow(@RequestParam int year, @RequestParam int month) {
        return ResponseEntity.ok(dashboardService.getCashFlow(year, month));
    }

    @GetMapping("/recent-transactions")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<RecentTransactionResponse>> getRecentTransactions(
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(dashboardService.getRecentTransactions(limit));
    }
}
