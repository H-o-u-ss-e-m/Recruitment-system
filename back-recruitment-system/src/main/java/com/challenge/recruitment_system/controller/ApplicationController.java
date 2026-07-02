package com.challenge.recruitment_system.controller;

import com.challenge.recruitment_system.dto.application.*;
import com.challenge.recruitment_system.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
public class ApplicationController {

    private final ApplicationService applicationService;

    // Candidat : Soumettre une candidature avec CV
    @PostMapping
    public ResponseEntity<ApplicationResponse> submitApplication(
            @Valid @ModelAttribute ApplicationSubmitRequest request,
            @RequestHeader("user-id") Long candidateId) {

        ApplicationResponse response = applicationService.submitApplication(request, candidateId);
        return ResponseEntity.ok(response);
    }

    // Candidat : Voir mes candidatures
    @GetMapping("/my")
    public ResponseEntity<List<ApplicationResponse>> getMyApplications(
            @RequestHeader("user-id") Long candidateId) {

        return ResponseEntity.ok(applicationService.getMyApplications(candidateId));
    }

    // Recruteur : Voir candidatures par offre
    @GetMapping("/offer/{jobOfferId}")
    public ResponseEntity<List<ApplicationResponse>> getApplicationsByOffer(
            @PathVariable Long jobOfferId) {

        return ResponseEntity.ok(applicationService.getApplicationsByOffer(jobOfferId));
    }

    // Recruteur : Changer le statut + notification email
    @PutMapping("/{id}/status")
    public ResponseEntity<ApplicationResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateDTO dto) {

        ApplicationResponse response = applicationService.updateStatus(id, dto);
        return ResponseEntity.ok(response);
    }

    // RH : Voir ABSOLUMENT TOUTES les candidatures (sans filtre)
    @GetMapping("/all")
    public ResponseEntity<List<ApplicationResponse>> getAllApplications() {
        return ResponseEntity.ok(applicationService.getAllApplications());
    }
}