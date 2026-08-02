package com.finnova.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class NotificationResponse {

    private Long id;
    private String type;
    private String message;
    private Long budgetId;
    private boolean read;
    private LocalDateTime createdAt;
}
