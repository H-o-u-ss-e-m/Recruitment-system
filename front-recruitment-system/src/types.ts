/**
 * TypeScript type definitions for the RIF Recrutement Application.
 * Matches the Spring Boot DTO and Model objects exactly.
 */

export type UserRole = "CANDIDATE" | "RECRUITER";

export interface AuthResponse {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface CandidateResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  educationLevel: string;
  university: string;
  specialite: string;
}

export interface JobOfferResponse {
  id: number;
  titrePoste: string;
  descriptionPoste: string;
  competencesRequises: string;
  datePublication: string; // "YYYY-MM-DD"
  dateLimite: string; // "YYYY-MM-DD"
  status: "OPEN" | "CLOSED";
  recruiterName: string;
}

export type ApplicationStatus = "EN_ATTENTE" | "EN_COURS" | "ACCEPTE" | "REFUSE";

export interface ApplicationResponse {
  id: number;
  candidateId: number;
  candidateFullName: string;
  candidateEmail: string;
  jobOfferId: number;
  jobTitle: string;
  cvUrl: string;
  cvFilename: string;
  lettreMotivation: string;
  expectedSalary: number;
  status: ApplicationStatus;
  datePostulation: string; // YYYY-MM-DDTHH:MM:SS
}

export interface CandidateFullProfile {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  birthDate?: string;
  gender?: string;
  nationality?: string;
  address?: string;
  postalCode?: string;
  educationLevel?: string;
  university?: string;
  specialite?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  city?: string;
  profileDescription?: string;
}
