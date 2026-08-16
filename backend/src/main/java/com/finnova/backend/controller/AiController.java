package com.finnova.backend.controller;

import com.finnova.backend.dto.AiAdviceResponse;
import com.finnova.backend.dto.AiAnalysisResponse;
import com.finnova.backend.dto.AiChatRequest;
import com.finnova.backend.dto.AiChatResponse;
import com.finnova.backend.dto.FinancialAnalysisResponse;
import com.finnova.backend.service.AiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    @PostMapping("/chat")
    public ResponseEntity<AiChatResponse> chat(@Valid @RequestBody AiChatRequest request) {
        return ResponseEntity.ok(new AiChatResponse(aiService.chat(request.getMessage())));
    }

    @PostMapping("/assistant")
    public ResponseEntity<AiChatResponse> assistant(@Valid @RequestBody AiChatRequest request) {
        return ResponseEntity.ok(new AiChatResponse(aiService.chat(request.getMessage())));
    }

    @PostMapping("/analyze")
    public ResponseEntity<AiAnalysisResponse> analyze() {
        return ResponseEntity.ok(new AiAnalysisResponse(aiService.analyzeExpenses()));
    }

    @GetMapping("/advice")
    public ResponseEntity<AiAdviceResponse> advice() {
        return ResponseEntity.ok(new AiAdviceResponse(aiService.getAdvice()));
    }

    @GetMapping("/financial-analysis")
    public ResponseEntity<FinancialAnalysisResponse> financialAnalysis() {
        return ResponseEntity.ok(aiService.getFinancialAnalysis());
    }
}
