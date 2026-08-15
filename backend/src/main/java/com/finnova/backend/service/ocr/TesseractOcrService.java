package com.finnova.backend.service.ocr;

import com.finnova.backend.exception.OcrProcessingException;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import net.sourceforge.tess4j.util.LoadLibs;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.io.File;

/**
 * Default OCR provider - runs fully offline via the native Tesseract engine (through tess4j).
 * tess4j bundles a native Tesseract binary and English trained data, so this works out of
 * the box; point app.ocr.tesseract.datapath at a different "tessdata" directory to override
 * the bundled data (e.g. for other languages) or app.ocr.tesseract.language for a non-English one.
 */
@Service
@ConditionalOnProperty(name = "app.ocr.provider", havingValue = "tesseract", matchIfMissing = true)
public class TesseractOcrService implements OcrService {

    private final Tesseract tesseract;

    public TesseractOcrService(
            @Value("${app.ocr.tesseract.datapath:}") String dataPath,
            @Value("${app.ocr.tesseract.language:eng}") String language) {
        this.tesseract = new Tesseract();
        tesseract.setDatapath((dataPath != null && !dataPath.isBlank())
                ? dataPath
                : LoadLibs.extractTessResources("tessdata").getPath());
        tesseract.setLanguage(language);
    }

    @Override
    public String extractText(File imageFile) {
        try {
            return tesseract.doOCR(imageFile);
        } catch (TesseractException e) {
            throw new OcrProcessingException("Tesseract OCR failed to process the image", e);
        }
    }

    @Override
    public String providerName() {
        return "tesseract";
    }
}
