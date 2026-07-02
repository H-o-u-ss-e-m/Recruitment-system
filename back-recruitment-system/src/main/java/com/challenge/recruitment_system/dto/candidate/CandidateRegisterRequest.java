package com.challenge.recruitment_system.dto.candidate;

import lombok.Data;
import java.time.LocalDate;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class CandidateRegisterRequest {
    @NotBlank(message = "Le prénom est obligatoire")
    @Size(max = 100)
    private String firstName;

    @NotBlank(message = "Le nom est obligatoire")
    @Size(max = 100)
    private String lastName;

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Format d'email invalide")
    @Size(max = 150)
    private String email;

    @NotBlank(message = "Le mot de passe est obligatoire")
    @Size(min = 6, max = 120, message = "Le mot de passe doit contenir au moins 6 caractères")
    private String password;

    @Size(max = 30)
    private String phone;
    private LocalDate birthDate;

    @Size(max = 50)
    private String gender;

    @Size(max = 100)
    private String nationality;

    @Size(max = 255)
    private String address;

    @Size(max = 20)
    private String postalCode;

    @Size(max = 100)
    private String city;

    @Size(max = 100)
    private String educationLevel;

    @Size(max = 150)
    private String university;

    @Size(max = 150)
    private String specialite;

    @Size(max = 255)
    private String linkedinUrl;

    @Size(max = 255)
    private String githubUrl;

    @Size(max = 255)
    private String portfolioUrl;

    @Size(max = 2000)
    private String profileDescription;
}