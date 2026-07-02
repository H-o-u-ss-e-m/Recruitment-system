package com.challenge.recruitment_system.repositories;

import com.challenge.recruitment_system.models.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {
    Optional<Candidate> findByEmail(String email);
    Optional<Candidate> findByEmailIgnoreCaseOrFirstNameIgnoreCaseOrLastNameIgnoreCase(String email, String firstName, String lastName);
    boolean existsByEmail(String email);
}