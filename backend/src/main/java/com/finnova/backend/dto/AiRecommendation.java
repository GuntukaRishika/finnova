package com.finnova.backend.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AiRecommendation {

    private String title;
    private String summary;
    private String priority; // HIGH, MEDIUM, LOW
    private String category; // BUDGET, SAVINGS, GOAL, GENERAL

    public AiRecommendation(String title, String summary) {
        this(title, summary, "MEDIUM", "GENERAL");
    }

    public AiRecommendation(String title, String summary, String priority, String category) {
        this.title = title;
        this.summary = summary;
        this.priority = priority;
        this.category = category;
    }
}
