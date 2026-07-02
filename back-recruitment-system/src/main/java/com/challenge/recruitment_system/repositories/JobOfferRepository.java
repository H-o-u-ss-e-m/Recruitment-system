package com.challenge.recruitment_system.repositories;

import com.challenge.recruitment_system.models.JobOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobOfferRepository extends JpaRepository<JobOffer, Long> {
    List<JobOffer> findByStatus(JobOffer.JobStatus status);
}