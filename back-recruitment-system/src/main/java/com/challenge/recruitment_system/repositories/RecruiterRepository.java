package com.challenge.recruitment_system.repositories;

import com.challenge.recruitment_system.models.Recruiter;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RecruiterRepository extends JpaRepository<Recruiter, Long> {
    Optional<Recruiter> findByLogin(String login);
    Optional<Recruiter> findByLoginIgnoreCase(String login);
}