package com.challenge.recruitment_system.dto.application;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

@Data
public class ApplicationSubmitRequest {
    @NotNull(message = "L'offre est obligatoire")
    @Positive(message = "L'offre sélectionnée est invalide")
    private Long jobOfferId;

    @Size(max = 4000)
    private String lettreMotivation;

    @NotNull(message = "Le salaire attendu est obligatoire")
    @Positive(message = "Le salaire attendu doit être positif")
    private Double expectedSalary;

    @NotNull(message = "Le CV est obligatoire")
    private MultipartFile cv;   // Fichier PDF
}