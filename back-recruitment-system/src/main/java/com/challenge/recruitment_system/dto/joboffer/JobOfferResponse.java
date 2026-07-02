package com.challenge.recruitment_system.dto.joboffer;

import com.challenge.recruitment_system.models.JobOffer.JobStatus;
import lombok.Data;
import java.time.LocalDate;

@Data
public class JobOfferResponse {
    private Long id;
    private String titrePoste;
    private String descriptionPoste;
    private String competencesRequises;
    private LocalDate datePublication;
    private LocalDate dateLimite;
    private JobStatus status;
    private String recruiterName;
}