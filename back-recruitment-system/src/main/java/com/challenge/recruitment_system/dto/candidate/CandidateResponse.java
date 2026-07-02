package com.challenge.recruitment_system.dto.candidate;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CandidateResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String city;
    private String educationLevel;
    private String university;
    private String specialite;
    private String portfolioUrl;
}