package com.challenge.recruitment_system.dto.candidate;

import lombok.Data;

import java.time.LocalDate;

@Data
public class CandidateFullProfileResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String phone;
    private LocalDate birthDate;
    private String gender;
    private String nationality;
    private String address;
    private String postalCode;
    private String city;
    private String educationLevel;
    private String university;
    private String specialite;
    private String linkedinUrl;
    private String githubUrl;
    private String portfolioUrl;
    private String profileDescription;
}