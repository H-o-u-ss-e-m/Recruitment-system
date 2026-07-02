package com.challenge.recruitment_system.service;

import com.challenge.recruitment_system.dto.joboffer.JobOfferCreateRequest;
import com.challenge.recruitment_system.dto.joboffer.JobOfferResponse;
import com.challenge.recruitment_system.models.JobOffer;
import com.challenge.recruitment_system.repositories.JobOfferRepository;
import com.challenge.recruitment_system.repositories.RecruiterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobOfferService {

    private final JobOfferRepository jobOfferRepository;
    private final RecruiterRepository recruiterRepository;

    public JobOfferResponse createJobOffer(JobOfferCreateRequest request, Long recruiterId) {
        var recruiter = recruiterRepository.findById(recruiterId)
                .orElseThrow(() -> new RuntimeException("Recruteur non trouvé"));

        JobOffer jobOffer = new JobOffer();
        jobOffer.setTitrePoste(request.getTitrePoste());
        jobOffer.setDescriptionPoste(request.getDescriptionPoste());
        jobOffer.setCompetencesRequises(request.getCompetencesRequises());
        jobOffer.setDateLimite(request.getDateLimite());
        jobOffer.setStatus(JobOffer.JobStatus.OPEN);
        jobOffer.setRecruiter(recruiter);

        JobOffer saved = jobOfferRepository.save(jobOffer);
        return mapToResponse(saved);
    }

    public List<JobOfferResponse> getAllOpenOffers() {
        return jobOfferRepository.findByStatus(JobOffer.JobStatus.OPEN)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private JobOfferResponse mapToResponse(JobOffer j) {
        JobOfferResponse resp = new JobOfferResponse();
        resp.setId(j.getId());
        resp.setTitrePoste(j.getTitrePoste());
        resp.setDescriptionPoste(j.getDescriptionPoste());
        resp.setCompetencesRequises(j.getCompetencesRequises());
        resp.setDatePublication(j.getDatePublication());
        resp.setDateLimite(j.getDateLimite());
        resp.setStatus(j.getStatus());

        if (j.getRecruiter() != null) {
            resp.setRecruiterName(j.getRecruiter().getLogin()); // On utilise login car pas de fullName
        }
        return resp;
    }
}