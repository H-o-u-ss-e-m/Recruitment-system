package com.challenge.recruitment_system.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "recruiters")
@Data @NoArgsConstructor @AllArgsConstructor
public class Recruiter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String login;

    private String password;
}