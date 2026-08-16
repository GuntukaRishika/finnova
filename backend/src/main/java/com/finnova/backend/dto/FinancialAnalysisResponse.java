package com.finnova.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class FinancialAnalysisResponse {

    private List<BudgetAnalysisItem> budgets;
    private SavingsAnalysis savings;
    private List<GoalAnalysisItem> goals;
}
