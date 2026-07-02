package com.challenge.recruitment_system.dto.auth;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class LoginRequest {
    @JsonAlias({"loginOrEmail", "email"})
    @NotBlank(message = "L'identifiant est obligatoire")
    @Size(max = 120, message = "L'identifiant est trop long")
    private String login;

    @NotBlank(message = "Le mot de passe est obligatoire")
    @Size(max = 120, message = "Le mot de passe est trop long")
    private String password;
}