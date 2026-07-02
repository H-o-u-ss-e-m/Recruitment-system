package com.challenge.recruitment_system.service;

import com.challenge.recruitment_system.dto.application.*;
import com.challenge.recruitment_system.models.Application;
import com.challenge.recruitment_system.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final CandidateRepository candidateRepository;
    private final JobOfferRepository jobOfferRepository;
    private final FileStorageService fileStorageService;
    private final EmailService emailService;

    public ApplicationResponse submitApplication(ApplicationSubmitRequest request, Long candidateId) {
        var candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidat non trouvé"));

        var offer = jobOfferRepository.findById(request.getJobOfferId())
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));

        // Sauvegarde PDF
        String filename = fileStorageService.saveFile(request.getCv(), candidate.getEmail());

        Application app = new Application();
        app.setCandidate(candidate);
        app.setJobOffer(offer);
        app.setLettreMotivation(request.getLettreMotivation());
        app.setExpectedSalary(request.getExpectedSalary());
        app.setCvFilename(filename);
        app.setCvUrl("/uploads/cvs/" + filename);

        Application saved = applicationRepository.save(app);

        // Email confirmation
        emailService.sendEmail(
                candidate.getEmail(),
                "GroupRIF - Candidature reçue",
                buildApplicationEmail(
                        candidate.getFirstName(),
                        offer.getTitrePoste(),
                        "reçue",
                        "Votre candidature a bien été enregistrée et sera examinée par notre équipe RH.")
        );

        return mapToResponse(saved);
    }

    public ApplicationResponse updateStatus(Long applicationId, StatusUpdateDTO dto) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Candidature non trouvée"));

        app.setStatus(dto.getStatus());
        Application saved = applicationRepository.save(app);

        emailService.sendEmail(
                app.getCandidate().getEmail(),
                "GroupRIF - Mise à jour de votre candidature",
                buildApplicationEmail(
                        app.getCandidate().getFirstName(),
                        app.getJobOffer().getTitrePoste(),
                        statusLabel(dto.getStatus()),
                        switch (dto.getStatus()) {
                            case EN_COURS -> "Votre dossier est actuellement en cours d'étude par notre équipe de recrutement.";
                            case ACCEPTE -> "Félicitations, votre candidature a été retenue. Notre équipe vous contactera prochainement.";
                            case REFUSE -> "Nous vous remercions pour votre intérêt et vous invitons à rester attentif à nos prochaines opportunités.";
                            default -> "Votre candidature reste en attente de traitement par notre équipe RH.";
                        })
        );

        return mapToResponse(saved);
    }

    public List<ApplicationResponse> getMyApplications(Long candidateId) {
        return applicationRepository.findByCandidateId(candidateId)
                .stream().map(this::mapToResponse).toList();
    }

    public List<ApplicationResponse> getApplicationsByOffer(Long jobOfferId) {
        return applicationRepository.findByJobOfferId(jobOfferId)
                .stream().map(this::mapToResponse).toList();
    }

    private ApplicationResponse mapToResponse(Application a) {
        ApplicationResponse resp = new ApplicationResponse();
        resp.setId(a.getId());
        resp.setCandidateId(a.getCandidate().getId());
        resp.setCandidateFullName(a.getCandidate().getFirstName() + " " + a.getCandidate().getLastName());
        resp.setCandidateEmail(a.getCandidate().getEmail());
        resp.setJobOfferId(a.getJobOffer().getId());
        resp.setJobTitle(a.getJobOffer().getTitrePoste());
        resp.setCvUrl(a.getCvUrl());
        resp.setCvFilename(a.getCvFilename());
        resp.setLettreMotivation(a.getLettreMotivation());
        resp.setExpectedSalary(a.getExpectedSalary());
        resp.setStatus(a.getStatus());
        resp.setDatePostulation(a.getDatePostulation());
        return resp;
    }

    public List<ApplicationResponse> getAllApplications() {
        return applicationRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

                private String statusLabel(com.challenge.recruitment_system.models.Application.ApplicationStatus status) {
                                return switch (status) {
                                                case EN_ATTENTE -> "En attente";
                                                case EN_COURS -> "En cours d'étude";
                                                case ACCEPTE -> "Acceptée";
                                                case REFUSE -> "Refusée";
                                };
                }

                private String buildApplicationEmail(String firstName, String jobTitle, String statusTitle, String message) {
                                return """
                                                                <html>
                                                                        <body style="margin:0;padding:0;background-color:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
                                                                                <div style="max-width:640px;margin:0 auto;padding:32px 16px;">
                                                                                        <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:20px;overflow:hidden;box-shadow:0 10px 30px rgba(15,23,42,0.08);">
                                                                                                <div style="background:linear-gradient(135deg,#1e3a8a,#0f172a);padding:28px 32px;color:#ffffff;">
                                                                                                        <div style="font-size:13px;letter-spacing:1px;text-transform:uppercase;color:#facc15;font-weight:700;">GroupRIF</div>
                                                                                                        <h1 style="margin:10px 0 0;font-size:26px;line-height:1.2;">Mise à jour de votre candidature</h1>
                                                                                                </div>
                                                                                                <div style="padding:32px;">
                                                                                                        <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">Bonjour %s,</p>
                                                                                                        <p style="margin:0 0 12px;font-size:15px;line-height:1.6;">Nous vous informons que votre candidature pour le poste <strong>%s</strong> est désormais <strong>%s</strong>.</p>
                                                                                                        <div style="margin:24px 0;padding:16px 18px;background:#eff6ff;border-left:4px solid #2563eb;border-radius:12px;font-size:15px;line-height:1.6;">%s</div>
                                                                                                        <p style="margin:24px 0 0;font-size:14px;line-height:1.6;color:#475569;">Cordialement,<br/>L'équipe recrutement GroupRIF</p>
                                                                                                </div>
                                                                                        </div>
                                                                                </div>
                                                                        </body>
                                                                </html>
                                                                """.formatted(firstName, jobTitle, statusTitle, message);
                }

}