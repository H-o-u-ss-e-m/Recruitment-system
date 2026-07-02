package com.challenge.recruitment_system.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;

    @ManyToOne
    @JoinColumn(name = "job_offer_id", nullable = false)
    private JobOffer jobOffer;

    // Stockage du CV
    @Column(name = "cv", nullable = false)
    private String cvUrl;           // ex: "/uploads/cvs/candidate_45_2025.pdf"

    private String cvFilename;

    @Column(columnDefinition = "TEXT")
    private String lettreMotivation;

    private Double expectedSalary;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status = ApplicationStatus.EN_ATTENTE;

    private LocalDateTime datePostulation;
    private LocalDateTime lastUpdated;

    @PrePersist
    protected void onCreate() {
        this.datePostulation = LocalDateTime.now();
        this.lastUpdated = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.lastUpdated = LocalDateTime.now();
    }

    public enum ApplicationStatus {
        EN_ATTENTE,
        EN_COURS,
        ACCEPTE,
        REFUSE
    }
}