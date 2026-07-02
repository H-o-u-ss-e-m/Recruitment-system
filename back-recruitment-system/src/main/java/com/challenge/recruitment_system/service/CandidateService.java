package com.challenge.recruitment_system.service;

import com.challenge.recruitment_system.dto.candidate.CandidateFullProfileResponse;
import com.challenge.recruitment_system.dto.candidate.CandidateProfileUpdateRequest;
import com.challenge.recruitment_system.dto.candidate.CandidateRegisterRequest;
import com.challenge.recruitment_system.dto.candidate.CandidateResponse;
import com.challenge.recruitment_system.models.Candidate;
import com.challenge.recruitment_system.repositories.CandidateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CandidateService {

    private final CandidateRepository candidateRepository;

    public CandidateResponse register(CandidateRegisterRequest request) {
        if (candidateRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Cet email est déjà utilisé");
        }

        Candidate candidate = new Candidate();
        candidate.setFirstName(request.getFirstName());
        candidate.setLastName(request.getLastName());
        candidate.setEmail(request.getEmail());
        candidate.setPassword(request.getPassword()); // À hasher plus tard
        candidate.setPhone(request.getPhone());
        candidate.setBirthDate(request.getBirthDate());
        candidate.setGender(request.getGender());
        candidate.setNationality(request.getNationality());
        candidate.setAddress(request.getAddress());
        candidate.setPostalCode(request.getPostalCode());
        candidate.setCity(request.getCity());
        candidate.setEducationLevel(request.getEducationLevel());
        candidate.setUniversity(request.getUniversity());
        candidate.setSpecialite(request.getSpecialite());
        candidate.setLinkedinUrl(request.getLinkedinUrl());
        candidate.setGithubUrl(request.getGithubUrl());
        candidate.setPortfolioUrl(request.getPortfolioUrl());
        candidate.setProfileDescription(request.getProfileDescription());

        Candidate saved = candidateRepository.save(candidate);

        return mapToResponse(saved);
    }

    private CandidateResponse mapToResponse(Candidate c) {
        CandidateResponse resp = new CandidateResponse();
        resp.setId(c.getId());
        resp.setFirstName(c.getFirstName());
        resp.setLastName(c.getLastName());
        resp.setEmail(c.getEmail());
        resp.setPhone(c.getPhone());
        resp.setCity(c.getCity());
        resp.setEducationLevel(c.getEducationLevel());
        resp.setUniversity(c.getUniversity());
        resp.setSpecialite(c.getSpecialite());
        resp.setPortfolioUrl(c.getPortfolioUrl());
        return resp;
    }

    public CandidateFullProfileResponse getFullProfile(Long candidateId) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidat non trouvé"));
        return mapToFullProfile(candidate);
    }

    public CandidateFullProfileResponse updateProfile(Long candidateId, CandidateProfileUpdateRequest request) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidat non trouvé"));

        candidate.setPhone(request.getPhone());
        candidate.setBirthDate(request.getBirthDate());
        candidate.setGender(request.getGender());
        candidate.setNationality(request.getNationality());
        candidate.setAddress(request.getAddress());
        candidate.setPostalCode(request.getPostalCode());
        candidate.setCity(request.getCity());
        candidate.setEducationLevel(request.getEducationLevel());
        candidate.setUniversity(request.getUniversity());
        candidate.setSpecialite(request.getSpecialite());
        candidate.setLinkedinUrl(request.getLinkedinUrl());
        candidate.setGithubUrl(request.getGithubUrl());
        candidate.setPortfolioUrl(request.getPortfolioUrl());
        candidate.setProfileDescription(request.getProfileDescription());
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            candidate.setPassword(request.getPassword());
        }

        return mapToFullProfile(candidateRepository.save(candidate));
    }

    private CandidateFullProfileResponse mapToFullProfile(Candidate c) {
        CandidateFullProfileResponse resp = new CandidateFullProfileResponse();
        resp.setId(c.getId());
        resp.setName(c.getFirstName() + " " + c.getLastName());
        resp.setEmail(c.getEmail());
        resp.setRole("CANDIDATE");
        resp.setPhone(c.getPhone());
        resp.setBirthDate(c.getBirthDate());
        resp.setGender(c.getGender());
        resp.setNationality(c.getNationality());
        resp.setAddress(c.getAddress());
        resp.setPostalCode(c.getPostalCode());
        resp.setCity(c.getCity());
        resp.setEducationLevel(c.getEducationLevel());
        resp.setUniversity(c.getUniversity());
        resp.setSpecialite(c.getSpecialite());
        resp.setLinkedinUrl(c.getLinkedinUrl());
        resp.setGithubUrl(c.getGithubUrl());
        resp.setPortfolioUrl(c.getPortfolioUrl());
        resp.setProfileDescription(c.getProfileDescription());
        return resp;
    }
}