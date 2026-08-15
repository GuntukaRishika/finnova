package com.finnova.backend.exception;

public class OcrProcessingException extends RuntimeException {

    public OcrProcessingException(String message, Throwable cause) {
        super(message, cause);
    }

    public OcrProcessingException(String message) {
        super(message);
    }
}
