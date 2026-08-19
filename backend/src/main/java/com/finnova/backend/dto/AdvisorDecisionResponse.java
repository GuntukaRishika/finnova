package com.finnova.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AdvisorDecisionResponse {

    private String decision;
    private String reason;
}