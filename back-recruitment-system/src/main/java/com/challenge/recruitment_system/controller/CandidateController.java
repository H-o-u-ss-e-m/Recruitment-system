package com.challenge.recruitment_system.controller;

import com.challenge.recruitment_system.dto.candidate.CandidateFullProfileResponse;
import com.challenge.recruitment_system.dto.candidate.CandidateProfileUpdateRequest;
import com.challenge.recruitment_system.dto.candidate.CandidateRegisterRequest;
import com.challenge.recruitment_system.dto.candidate.CandidateResponse;
import com.challenge.recruitment_system.service.CandidateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/candidates")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
public class CandidateController {

    private final CandidateService candidateService;

    @PostMapping("/register")
    public ResponseEntity<CandidateResponse> register(@Valid @RequestBody CandidateRegisterRequest request) {
        CandidateResponse response = candidateService.register(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/full-profile")
    public ResponseEntity<CandidateFullProfileResponse> getFullProfile(@PathVariable Long id) {
        return ResponseEntity.ok(candidateService.getFullProfile(id));
    }

    @PutMapping("/{id}/profile")
    public ResponseEntity<CandidateFullProfileResponse> updateProfile(
            @PathVariable Long id,
            @Valid @RequestBody CandidateProfileUpdateRequest request) {
        return ResponseEntity.ok(candidateService.updateProfile(id, request));
    }
}