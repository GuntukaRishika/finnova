package com.finnova.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class AiAdviceResponse {

    private List<AiRecommendation> recommendations;
}
