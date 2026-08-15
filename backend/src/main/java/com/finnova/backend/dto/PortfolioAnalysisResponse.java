package com.finnova.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class PortfolioAnalysisResponse {

    private PortfolioSummaryResponse summary;
    private List<PortfolioAllocationResponse> allocation;
    private List<InvestmentPerformance> topPerformers;
    private List<InvestmentPerformance> underPerformers;
}
