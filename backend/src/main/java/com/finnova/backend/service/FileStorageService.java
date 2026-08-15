package com.finnova.backend.service;

import com.finnova.backend.exception.OcrProcessingException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileStorageService {

    private static final Set<String> ALLOWED_CONTENT_TYPES =
            Set.of("image/jpeg", "image/png", "image/webp", "image/bmp", "image/tiff");

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Value("${app.upload.max-size-bytes:10485760}")
    private long maxSizeBytes;

    public StoredFile storeReceiptImage(Long userId, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Uploaded file is empty");
        }
        if (file.getSize() > maxSizeBytes) {
            throw new IllegalArgumentException("File exceeds maximum allowed size of " + (maxSizeBytes / 1024 / 1024) + "MB");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException("Unsupported file type. Allowed types: " + ALLOWED_CONTENT_TYPES);
        }

        try {
            Path userDir = Paths.get(uploadDir, "receipts", String.valueOf(userId));
            Files.createDirectories(userDir);

            String extension = extractExtension(file.getOriginalFilename(), contentType);
            String storedFilename = UUID.randomUUID() + extension;
            Path destination = userDir.resolve(storedFilename).normalize();

            if (!destination.startsWith(userDir)) {
                throw new IllegalArgumentException("Invalid file name");
            }

            file.transferTo(destination);

            return new StoredFile(destination.toFile(), destination.toString(),
                    StringUtils.hasText(file.getOriginalFilename()) ? file.getOriginalFilename() : storedFilename);
        } catch (IOException e) {
            throw new OcrProcessingException("Failed to store uploaded receipt image", e);
        }
    }

    private String extractExtension(String originalFilename, String contentType) {
        if (StringUtils.hasText(originalFilename) && originalFilename.contains(".")) {
            return originalFilename.substring(originalFilename.lastIndexOf('.'));
        }
        return switch (contentType.toLowerCase()) {
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            case "image/bmp" -> ".bmp";
            case "image/tiff" -> ".tiff";
            default -> ".jpg";
        };
    }

    public record StoredFile(File file, String path, String originalFilename) {
    }
}
