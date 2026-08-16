package com.finnova.backend.exception;

import com.finnova.backend.dto.MessageResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler({IllegalArgumentException.class, IllegalStateException.class})
    public ResponseEntity<MessageResponse> handleIllegalArgument(RuntimeException ex) {
        return ResponseEntity.badRequest().body(new MessageResponse(ex.getMessage()));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<MessageResponse> handleBadCredentials(BadCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponse("Invalid username or password"));
    }

    @ExceptionHandler(TokenRefreshException.class)
    public ResponseEntity<MessageResponse> handleTokenRefresh(TokenRefreshException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new MessageResponse(ex.getMessage()));
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<MessageResponse> handleResourceNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse(ex.getMessage()));
    }

    @ExceptionHandler(OcrProcessingException.class)
    public ResponseEntity<MessageResponse> handleOcrProcessing(OcrProcessingException ex) {
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(new MessageResponse(ex.getMessage()));
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<MessageResponse> handleMaxUploadSize(MaxUploadSizeExceededException ex) {
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                .body(new MessageResponse("Uploaded file exceeds the maximum allowed size"));
    }

    @ExceptionHandler(AiProcessingException.class)
    public ResponseEntity<MessageResponse> handleAiProcessing(AiProcessingException ex) {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(new MessageResponse(ex.getMessage()));
    }
}
