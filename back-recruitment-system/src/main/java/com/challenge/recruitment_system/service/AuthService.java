package com.challenge.recruitment_system.service;

import com.challenge.recruitment_system.dto.auth.AuthResponse;
import com.challenge.recruitment_system.dto.auth.LoginRequest;
import com.challenge.recruitment_system.models.Candidate;
import com.challenge.recruitment_system.models.Recruiter;
import com.challenge.recruitment_system.repositories.CandidateRepository;
import com.challenge.recruitment_system.repositories.RecruiterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final CandidateRepository candidateRepository;
    private final RecruiterRepository recruiterRepository;

    public AuthResponse login(LoginRequest request) {
        String login = request.getLogin() == null ? "" : request.getLogin().trim();

        // Recruteur
        var recruiterOpt = recruiterRepository.findByLoginIgnoreCase(login);
        if (recruiterOpt.isPresent()) {
            Recruiter r = recruiterOpt.get();
            if (r.getPassword().equals(request.getPassword())) {
                return new AuthResponse(r.getId(), r.getLogin(), r.getLogin(), "RECRUITER");
            }
        }

        // Candidat: login simple, compatible avec email, prénom ou nom
        var candidateOpt = candidateRepository.findByEmailIgnoreCaseOrFirstNameIgnoreCaseOrLastNameIgnoreCase(login, login, login);
        if (candidateOpt.isPresent()) {
            Candidate c = candidateOpt.get();
            if (c.getPassword().equals(request.getPassword())) {
                String fullName = c.getFirstName() + " " + c.getLastName();
                return new AuthResponse(c.getId(), fullName, c.getEmail(), "CANDIDATE");
            }
        }

        throw new RuntimeException("Identifiants incorrects");
    }
}