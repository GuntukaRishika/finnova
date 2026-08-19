package com.finnova.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AiChatResponse {

    private String reply;
    private String decision;
    private String decisionReason;

    public AiChatResponse(String reply) {
        this(reply, "NONE", null);
    }

}
