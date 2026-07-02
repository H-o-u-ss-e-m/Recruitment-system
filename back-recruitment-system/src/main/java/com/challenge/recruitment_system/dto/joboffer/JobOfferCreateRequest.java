package com.challenge.recruitment_system.dto.joboffer;

import lombok.Data;
import java.time.LocalDate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Data
public class JobOfferCreateRequest {
    @NotBlank(message = "Le titre du poste est obligatoire")
    @Size(max = 150)
    private String titrePoste;

    @NotBlank(message = "La description est obligatoire")
    @Size(max = 5000)
    private String descriptionPoste;

    @NotBlank(message = "Les compétences requises sont obligatoires")
    @Size(max = 2000)
    private String competencesRequises;

    @NotNull(message = "La date limite est obligatoire")
    private LocalDate dateLimite;
}