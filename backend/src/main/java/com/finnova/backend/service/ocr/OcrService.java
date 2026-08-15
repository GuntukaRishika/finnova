package com.finnova.backend.service.ocr;

import java.io.File;

public interface OcrService {

    String extractText(File imageFile);

    String providerName();
}
