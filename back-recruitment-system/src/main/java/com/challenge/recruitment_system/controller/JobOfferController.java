package com.challenge.recruitment_system.controller;

import com.challenge.recruitment_system.dto.joboffer.JobOfferCreateRequest;
import com.challenge.recruitment_system.dto.joboffer.JobOfferResponse;
import com.challenge.recruitment_system.service.JobOfferService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-offers")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
public class JobOfferController {

    private final JobOfferService jobOfferService;

    // Créer une offre (Recruteur)
    @PostMapping
    public ResponseEntity<JobOfferResponse> createJobOffer(
            @Valid @RequestBody JobOfferCreateRequest request,
            @RequestHeader("user-id") Long recruiterId) {

        JobOfferResponse response = jobOfferService.createJobOffer(request, recruiterId);
        return ResponseEntity.ok(response);
    }

    // Voir toutes les offres ouvertes (Candidat)
    @GetMapping("/open")
    public ResponseEntity<List<JobOfferResponse>> getOpenOffers() {
        return ResponseEntity.ok(jobOfferService.getAllOpenOffers());
    }
}