package com.finnova.backend.controller;

import com.finnova.backend.dto.CashFlowResponse;
import com.finnova.backend.dto.CategorySummaryResponse;
import com.finnova.backend.dto.MonthlySummaryResponse;
import com.finnova.backend.dto.YearlySummaryResponse;
import com.finnova.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/monthly-summary")
    public ResponseEntity<MonthlySummaryResponse> getMonthlySummary(@RequestParam int year, @RequestParam int month) {
        return ResponseEntity.ok(dashboardService.getMonthlySummary(year, month));
    }

    @GetMapping("/yearly-summary")
    public ResponseEntity<YearlySummaryResponse> getYearlySummary(@RequestParam int year) {
        return ResponseEntity.ok(dashboardService.getYearlySummary(year));
    }

    @GetMapping("/category-summary")
    public ResponseEntity<CategorySummaryResponse> getCategorySummary(
            @RequestParam int year,
            @RequestParam int month,
            @RequestParam(defaultValue = "EXPENSE") String type) {
        return ResponseEntity.ok(dashboardService.getCategorySummary(year, month, type));
    }

    @GetMapping("/cash-flow")
    public ResponseEntity<CashFlowResponse> getCashFlow(@RequestParam int year, @RequestParam int month) {
        return ResponseEntity.ok(dashboardService.getCashFlow(year, month));
    }
}
