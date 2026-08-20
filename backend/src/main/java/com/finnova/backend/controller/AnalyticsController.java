package com.finnova.backend.controller;

import com.finnova.backend.dto.CategoryReportResponse;
import com.finnova.backend.dto.GrowthPoint;
import com.finnova.backend.dto.PeriodComparisonResponse;
import com.finnova.backend.dto.PortfolioAnalysisResponse;
import com.finnova.backend.dto.PredictionResponse;
import com.finnova.backend.dto.SpendingHeatmapResponse;
import com.finnova.backend.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/monthly-growth")
    public ResponseEntity<List<GrowthPoint>> getMonthlyGrowth(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month,
            @RequestParam(defaultValue = "6") int months) {
        LocalDate anchor = LocalDate.now();
        int resolvedYear = year != null ? year : anchor.getYear();
        int resolvedMonth = month != null ? month : anchor.getMonthValue();
        return ResponseEntity.ok(analyticsService.getMonthlyGrowth(resolvedYear, resolvedMonth, months));
    }

    @GetMapping("/predictions")
    public ResponseEntity<PredictionResponse> getPredictions(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month,
            @RequestParam(defaultValue = "6") int historyMonths,
            @RequestParam(defaultValue = "3") int forecastMonths) {
        LocalDate anchor = LocalDate.now();
        int resolvedYear = year != null ? year : anchor.getYear();
        int resolvedMonth = month != null ? month : anchor.getMonthValue();
        return ResponseEntity.ok(analyticsService.getPredictions(resolvedYear, resolvedMonth, historyMonths, forecastMonths));
    }

    @GetMapping("/category-report")
    public ResponseEntity<CategoryReportResponse> getCategoryReport(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month,
            @RequestParam(defaultValue = "6") int months,
            @RequestParam(defaultValue = "EXPENSE") String type) {
        LocalDate anchor = LocalDate.now();
        int resolvedYear = year != null ? year : anchor.getYear();
        int resolvedMonth = month != null ? month : anchor.getMonthValue();
        return ResponseEntity.ok(analyticsService.getCategoryReport(resolvedYear, resolvedMonth, months, type));
    }

    @GetMapping("/portfolio-analysis")
    public ResponseEntity<PortfolioAnalysisResponse> getPortfolioAnalysis() {
        return ResponseEntity.ok(analyticsService.getPortfolioAnalysis());
    }

    @GetMapping("/spending-heatmap")
    public ResponseEntity<SpendingHeatmapResponse> getSpendingHeatmap(
            @RequestParam int year, @RequestParam int month) {
        return ResponseEntity.ok(analyticsService.getSpendingHeatmap(year, month));
    }

    @GetMapping("/comparison")
    public ResponseEntity<PeriodComparisonResponse> getComparison(
            @RequestParam int yearA, @RequestParam int monthA,
            @RequestParam int yearB, @RequestParam int monthB) {
        return ResponseEntity.ok(analyticsService.getComparison(yearA, monthA, yearB, monthB));
    }
}
