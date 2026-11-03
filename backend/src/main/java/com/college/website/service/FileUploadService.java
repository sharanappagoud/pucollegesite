package com.college.website.service;

import com.college.website.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class FileUploadService {

    @Value("${app.upload.dir:./uploads}")
    private String uploadDir;

    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(".jpg", ".jpeg", ".png", ".webp", ".pdf", ".docx");

    public String storeFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Failed to upload empty file");
        }

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "file");
        String extension = "";
        int dotIdx = originalFilename.lastIndexOf(".");
        if (dotIdx >= 0) {
            extension = originalFilename.substring(dotIdx).toLowerCase();
        }

        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new BadRequestException("File type not allowed. Permitted types: " + ALLOWED_EXTENSIONS);
        }

        // Limit size 10MB
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new BadRequestException("File size exceeds 10MB limit");
        }

        try {
            Path targetLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
            if (!Files.exists(targetLocation)) {
                Files.createDirectories(targetLocation);
            }

            String newFilename = UUID.randomUUID().toString() + extension;
            Path destination = targetLocation.resolve(newFilename);
            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

            return "/uploads/" + newFilename;
        } catch (IOException ex) {
            throw new BadRequestException("Could not store file: " + ex.getMessage());
        }
    }
}
