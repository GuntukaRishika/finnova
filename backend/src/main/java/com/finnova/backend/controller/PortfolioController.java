package com.finnova.backend.controller;

import com.finnova.backend.dto.PortfolioAllocationResponse;
import com.finnova.backend.dto.PortfolioSummaryResponse;
import com.finnova.backend.service.PortfolioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/portfolio")
@RequiredArgsConstructor
public class PortfolioController {

    private final PortfolioService portfolioService;

    @GetMapping("/summary")
    public ResponseEntity<PortfolioSummaryResponse> getSummary() {
        return ResponseEntity.ok(portfolioService.getSummary());
    }

    @GetMapping("/allocation")
    public ResponseEntity<List<PortfolioAllocationResponse>> getAllocation() {
        return ResponseEntity.ok(portfolioService.getAllocation());
    }
}
