package com.finnova.backend.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AdvisorHistoryItem {

    private Long id;
    private String question;
    private String answer;
    private LocalDateTime createdAt;
}