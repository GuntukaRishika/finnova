package com.finnova.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AiChatRequest {

    @NotBlank
    private String message;
}
