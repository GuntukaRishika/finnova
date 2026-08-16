package com.finnova.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
public class GoalAnalysisItem {

    private Long goalId;
    private String name;
    private BigDecimal targetAmount;
    private BigDecimal currentAmount;
    private BigDecimal progressPercent;
    private LocalDate targetDate;
    private BigDecimal expectedProgressPercent; // null when the goal has no target date
    private BigDecimal requiredMonthlyContribution; // null when not applicable
    private String status; // ON_TRACK, AHEAD, BEHIND, OVERDUE, COMPLETED, NO_DEADLINE
}
