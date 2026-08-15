package com.finnova.backend.service.ocr;

import com.finnova.backend.exception.OcrProcessingException;
import com.google.cloud.vision.v1.AnnotateImageRequest;
import com.google.cloud.vision.v1.AnnotateImageResponse;
import com.google.cloud.vision.v1.BatchAnnotateImagesResponse;
import com.google.cloud.vision.v1.Feature;
import com.google.cloud.vision.v1.Image;
import com.google.cloud.vision.v1.ImageAnnotatorClient;
import com.google.protobuf.ByteString;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.File;
import java.nio.file.Files;
import java.util.List;

/**
 * Cloud OCR provider - delegates text detection to the Google Cloud Vision API.
 * Requires GOOGLE_APPLICATION_CREDENTIALS to point at a service-account JSON key
 * with Vision API access. Enable via app.ocr.provider=google-vision.
 */
@Service
@ConditionalOnProperty(name = "app.ocr.provider", havingValue = "google-vision")
public class GoogleVisionOcrService implements OcrService {

    @Override
    public String extractText(File imageFile) {
        try {
            byte[] imageBytes = Files.readAllBytes(imageFile.toPath());
            try (ImageAnnotatorClient client = ImageAnnotatorClient.create()) {
                ByteString byteString = ByteString.copyFrom(imageBytes);
                Image image = Image.newBuilder().setContent(byteString).build();
                Feature feature = Feature.newBuilder().setType(Feature.Type.TEXT_DETECTION).build();
                AnnotateImageRequest request = AnnotateImageRequest.newBuilder()
                        .addFeatures(feature)
                        .setImage(image)
                        .build();

                BatchAnnotateImagesResponse batchResponse = client.batchAnnotateImages(List.of(request));
                AnnotateImageResponse response = batchResponse.getResponses(0);

                if (response.hasError()) {
                    throw new OcrProcessingException("Google Vision OCR failed: " + response.getError().getMessage());
                }
                return response.getTextAnnotationsCount() > 0
                        ? response.getTextAnnotations(0).getDescription()
                        : "";
            }
        } catch (IOException e) {
            throw new OcrProcessingException("Google Vision OCR failed to process the image", e);
        }
    }

    @Override
    public String providerName() {
        return "google-vision";
    }
}
