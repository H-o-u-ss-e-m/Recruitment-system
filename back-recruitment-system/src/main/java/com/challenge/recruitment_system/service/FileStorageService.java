package com.challenge.recruitment_system.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;

@Service
public class FileStorageService {

    private final Path root = Paths.get("uploads/cvs");

    public String saveFile(MultipartFile file, String email) {
        try {
            if (!Files.exists(root)) {
                Files.createDirectories(root);
            }

            String filename = email.replace("@", "_") + "_" + System.currentTimeMillis() + ".pdf";
            Files.copy(file.getInputStream(), this.root.resolve(filename), StandardCopyOption.REPLACE_EXISTING);

            return filename;
        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de la sauvegarde du fichier : " + e.getMessage());
        }
    }
}