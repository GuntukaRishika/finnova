package com.finnova.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.finnova.backend.exception.AiProcessingException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Thin wrapper around the Gemini generateContent REST API. Keeps prompt construction and
 * response parsing in one place so callers only deal with plain strings.
 */
@Component
public class GeminiClient {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final String apiKey;
    private final String model;

    public GeminiClient(@Value("${app.gemini.api-key}") String apiKey,
                         @Value("${app.gemini.model}") String model,
                         @Value("${app.gemini.api-url}") String apiUrl,
                         ObjectMapper objectMapper) {
        this.apiKey = apiKey;
        this.model = model;
        this.objectMapper = objectMapper;
        this.restClient = RestClient.builder().baseUrl(apiUrl).build();
    }

    /** Free-form conversational reply, optionally grounded by a system instruction. */
    public String generateText(String systemInstruction, String userMessage) {
        return generate(systemInstruction, userMessage, false);
    }

    /** Reply constrained to a JSON document, for prompts asking Gemini to fill a schema. */
    public String generateJson(String systemInstruction, String userMessage) {
        return generate(systemInstruction, userMessage, true);
    }

    private String generate(String systemInstruction, String userMessage, boolean jsonMode) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new AiProcessingException(
                    "Gemini API key is not configured. Set the GEMINI_API_KEY environment variable.");
        }

        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("temperature", 0.4);
        if (jsonMode) {
            generationConfig.put("responseMimeType", "application/json");
        }

        Map<String, Object> body = new HashMap<>();
        body.put("contents", List.of(Map.of("role", "user", "parts", List.of(Map.of("text", userMessage)))));
        body.put("generationConfig", generationConfig);
        if (systemInstruction != null && !systemInstruction.isBlank()) {
            body.put("systemInstruction", Map.of("parts", List.of(Map.of("text", systemInstruction))));
        }

        String rawResponse;
        try {
            rawResponse = restClient.post()
                    .uri(uriBuilder -> uriBuilder.path("/{model}:generateContent").queryParam("key", apiKey).build(model))
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(String.class);
        } catch (RestClientException ex) {
            throw new AiProcessingException("Could not reach the Gemini API: " + ex.getMessage(), ex);
        }

        return extractText(rawResponse);
    }

    private String extractText(String rawResponse) {
        try {
            JsonNode root = objectMapper.readTree(rawResponse);
            JsonNode textNode = root.path("candidates").path(0).path("content").path("parts").path(0).path("text");
            if (textNode.isMissingNode() || textNode.asText().isBlank()) {
                throw new AiProcessingException("Gemini returned an empty response.");
            }
            return textNode.asText();
        } catch (AiProcessingException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new AiProcessingException("Failed to parse Gemini's response.", ex);
        }
    }
}
