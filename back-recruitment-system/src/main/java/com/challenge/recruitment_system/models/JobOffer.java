package com.challenge.recruitment_system.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_offers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobOffer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titrePoste;

    @Column(columnDefinition = "TEXT")
    private String descriptionPoste;

    @Column(columnDefinition = "TEXT")
    private String competencesRequises;

    private LocalDate datePublication;
    private LocalDate dateLimite;

    @Enumerated(EnumType.STRING)
    private JobStatus status = JobStatus.OPEN;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private Recruiter recruiter;

    public enum JobStatus {
        OPEN, CLOSED
    }

    @PrePersist
    protected void onCreate() {
        if (datePublication == null) {
            datePublication = LocalDate.now();
        }
    }
}