package com.challenge.recruitment_system.dto.application;

import com.challenge.recruitment_system.models.Application.ApplicationStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ApplicationResponse {
    private Long id;
    private Long candidateId;
    private String candidateFullName;
    private String candidateEmail;
    private Long jobOfferId;
    private String jobTitle;
    private String cvUrl;
    private String cvFilename;
    private String lettreMotivation;
    private Double expectedSalary;
    private ApplicationStatus status;
    private LocalDateTime datePostulation;
}