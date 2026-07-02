package com.challenge.recruitment_system.dto.application;

import com.challenge.recruitment_system.models.Application.ApplicationStatus;
import lombok.Data;
import jakarta.validation.constraints.NotNull;

@Data
public class StatusUpdateDTO {
    @NotNull(message = "Le statut est obligatoire")
    private ApplicationStatus status;

}