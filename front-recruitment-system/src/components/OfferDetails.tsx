import React, { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Calendar, Briefcase, DollarSign, Send, FileWarning, AlertCircle, CheckCircle2, Loader2, Upload, FileText, Plus, X, ArrowRight, ArrowLeft as ArrowLeftIcon, User } from "lucide-react";
import { useToast } from "./Toast";
import { JobOfferResponse, AuthResponse, CandidateFullProfile } from "../types";
import { apiFetch } from "../lib/api";

interface OfferDetailsProps {
  offer: JobOfferResponse;
  currentUser: AuthResponse | null;
  onBack: () => void;
  onGoToAuth: (view: "login" | "register") => void;
  onApplicationSuccess: () => void;
}

export const OfferDetails: React.FC<OfferDetailsProps> = ({
  offer,
  currentUser,
  onBack,
  onGoToAuth,
  onApplicationSuccess,
}) => {
  const { showToast } = useToast();
  const [isApplying, setIsApplying] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [candidateProfile, setCandidateProfile] = useState<CandidateFullProfile | null>(null);

  // Form step state
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Application Form States
  // Step 1: Contact & Personal Info
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("France");
  const [postalCode, setPostalCode] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [nationality, setNationality] = useState("Française");
  const [gender, setGender] = useState("Homme");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [portfolio, setPortfolio] = useState("");

  // Step 2: Education, Experience & Skills
  const [currentSituation, setCurrentSituation] = useState("Étudiant");
  const [availability, setAvailability] = useState("Immédiate");
  const [educationLevel, setEducationLevel] = useState("Master");
  const [university, setUniversity] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [gradYear, setGradYear] = useState("2026");
  const [currentCompany, setCurrentCompany] = useState("");
  const [currentPost, setCurrentPost] = useState("");
  const [yearsExp, setYearsExp] = useState(0);
  
  // Dynamic Skill tags
  const [skills, setSkills] = useState<string[]>(["Java", "Spring Boot", "React", "SQL"]);
  const [newSkill, setNewSkill] = useState("");

  // Languages list
  const [languages, setLanguages] = useState<{ lang: string; level: string }[]>([
    { lang: "Français", level: "Bilingue" },
    { lang: "Anglais", level: "Intermédiaire" },
  ]);
  const [newLang, setNewLang] = useState("");
  const [newLangLevel, setNewLangLevel] = useState("Courant");

  const [interests, setInterests] = useState("");
  const [profileSummary, setProfileSummary] = useState("");

  // Step 3: Motivation, CV File & Final Details
  const [coverLetter, setCoverLetter] = useState("");
  const [achievements, setAchievements] = useState("");
  const [certifications, setCertifications] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [expectedSalary, setExpectedSalary] = useState(42000);
  const [mobility, setMobility] = useState("Oui");
  const [drivingLicense, setDrivingLicense] = useState("Oui");
  
  // File upload state
  const [cvFile, setCvFile] = useState<File | null>(null);

  // Fetch full candidate profile once logged in to pre-fill the form
  useEffect(() => {
    if (currentUser && currentUser.role === "CANDIDATE") {
      setLoadingProfile(true);
      apiFetch(`/api/candidates/${currentUser.id}/full-profile`)
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error("Could not load candidate profile");
        })
        .then((data: CandidateFullProfile) => {
          setCandidateProfile(data);
          // Split full name if possible
          const names = data.name ? data.name.split(" ") : ["", ""];
          setFirstName(names[0] || "");
          setLastName(names.slice(1).join(" ") || "");
          setEmail(data.email || "");
          setPhone(data.phone || "");
          setAddress(data.address || "");
          setPostalCode(data.postalCode || "");
          setBirthDate(data.birthDate || "");
          setGender(data.gender || "Homme");
          setNationality(data.nationality || "Française");
          setEducationLevel(data.educationLevel || "Master");
          setUniversity(data.university || "");
          setSpeciality(data.specialite || "");
          setLinkedin(data.linkedinUrl || "");
          setGithub(data.githubUrl || "");
          setProfileSummary(data.profileDescription || "");
        })
        .catch(() => {
          // Fallback with current user session name/email
          const names = currentUser.name.split(" ");
          setFirstName(names[0] || "");
          setLastName(names.slice(1).join(" ") || "");
          setEmail(currentUser.email);
        })
        .finally(() => {
          setLoadingProfile(false);
        });
    }
  }, [currentUser]);

  // Smooth scroll to the form when starting application
  useEffect(() => {
    if (isApplying) {
      setTimeout(() => {
        const el = document.getElementById("application-form-stepper");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
    }
  }, [isApplying]);

  // Client-side validations per step
  const validateStep1 = () => {
    if (!lastName.trim()) {
      showToast("Veuillez renseigner votre nom.", "error");
      return false;
    }
    if (!firstName.trim()) {
      showToast("Veuillez renseigner votre prénom.", "error");
      return false;
    }
    if (!email.trim() || !email.includes("@")) {
      showToast("Veuillez renseigner une adresse email valide.", "error");
      return false;
    }
    return true;
  };

  // Skill Add/Remove handlers
  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  // Language Add/Remove handlers
  const handleAddLanguage = () => {
    if (newLang.trim() && !languages.some((l) => l.lang.toLowerCase() === newLang.trim().toLowerCase())) {
      setLanguages([...languages, { lang: newLang.trim(), level: newLangLevel }]);
      setNewLang("");
    }
  };

  const handleRemoveLanguage = (index: number) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  // Handle PDF file upload change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        showToast("Seuls les fichiers au format PDF sont autorisés.", "error");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast("Le fichier dépasse la taille maximale autorisée (5 Mo).", "error");
        return;
      }
      setCvFile(file);
      showToast("Fichier CV téléversé avec succès !", "success");
    }
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      showToast("Veuillez vous connecter pour postuler.", "error");
      return;
    }

    if (!cvFile) {
      showToast("Le dépôt d'un fichier CV au format PDF est obligatoire.", "error");
      return;
    }

    setSubmitting(true);
    try {
      // Build Multipart Request
      const formData = new FormData();
      formData.append("jobOfferId", String(offer.id));
      formData.append("lettreMotivation", coverLetter || `Lettre de motivation soumise par ${firstName} ${lastName}`);
      formData.append("expectedSalary", String(expectedSalary));
      formData.append("cv", cvFile);

      const response = await apiFetch("/api/applications", {
        method: "POST",
        headers: {
          "user-id": String(currentUser.id),
        },
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Échec de l'envoi de la candidature.");
      }

      showToast("Candidature soumise avec succès ! Un email de confirmation vous a été envoyé.", "success");
      onApplicationSuccess();
    } catch (err: any) {
      showToast(err.message || "Erreur de soumission.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Split skills from database offer response
  const competencesTags = offer.competencesRequises
    ? offer.competencesRequises.split(",").map((s) => s.trim())
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 text-left" id="offer-details-container">
      {/* Return back header */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        Retour à la liste des offres
      </button>

      {/* JOB CARD SUMMARY */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-blue-50 text-brand-blue-700 text-xs font-bold border border-brand-blue-100">
              <Briefcase className="h-3 w-3" />
              {offer.titrePoste.toLowerCase().includes("stage") || offer.titrePoste.toLowerCase().includes("stagiaire") ? "Stage / Alternance" : "CDI Temps Plein"}
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 leading-snug">
              {offer.titrePoste}
            </h1>
            
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {offer.recruiterName || "Groupe RIF"}
            </p>
          </div>

          {!isApplying && (
            <button
              onClick={() => {
                if (!currentUser) {
                  showToast("Veuillez d'abord vous connecter pour postuler.", "warning");
                  onGoToAuth("login");
                } else if (currentUser.role === "RECRUITER") {
                  showToast("Les recruteurs ne peuvent pas postuler aux offres.", "error");
                } else {
                  setIsApplying(true);
                }
              }}
              className="px-6 py-3 bg-brand-blue-600 hover:bg-brand-blue-700 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer shrink-0 text-sm"
            >
              Postuler à cette offre
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-b border-slate-100 py-4 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-brand-blue-500 shrink-0" />
            <div>
              <p className="text-slate-400 text-[10px] uppercase">Lieu</p>
              <p className="text-slate-700">{offer.descriptionPoste.includes("Lyon") ? "Lyon, France" : "Paris, France"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-brand-blue-500 shrink-0" />
            <div>
              <p className="text-slate-400 text-[10px] uppercase">Date de publication</p>
              <p className="text-slate-700">{new Date(offer.datePublication).toLocaleDateString("fr-FR")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 col-span-2 md:col-span-1">
            <Calendar className="h-4 w-4 text-brand-blue-500 shrink-0" />
            <div>
              <p className="text-slate-400 text-[10px] uppercase">Date limite pour postuler</p>
              <p className="text-rose-600">{new Date(offer.dateLimite).toLocaleDateString("fr-FR")}</p>
            </div>
          </div>
        </div>

        {/* DETAILS DESCRIPTION AND REQUIREMENTS */}
        <div className="space-y-6 text-slate-700">
          {/* Section 1: Description */}
          <div className="space-y-2">
            <h2 className="text-base font-extrabold text-slate-900 font-display">Description du poste</h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line font-light">
              {offer.descriptionPoste}
            </p>
          </div>

          {/* Section 2: Competences */}
          <div className="space-y-3 pt-2">
            <h2 className="text-base font-extrabold text-slate-900 font-display">Compétences & Profil recherché</h2>
            <div className="flex flex-wrap gap-2">
              {competencesTags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Secondary Apply CTA inside the details card for long descriptions */}
          {!isApplying && currentUser?.role !== "RECRUITER" && (
            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (!currentUser) {
                    showToast("Veuillez d'abord vous connecter pour postuler.", "warning");
                    onGoToAuth("login");
                  } else {
                    setIsApplying(true);
                  }
                }}
                className="px-6 py-3 bg-brand-blue-600 hover:bg-brand-blue-700 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer text-sm flex items-center gap-1.5"
              >
                Postuler à cette offre <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* REGISTRATION NOTICE IF NOT LOGGED IN */}
      {!currentUser && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3 text-left">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-amber-900">Connexion obligatoire pour postuler</h4>
              <p className="text-xs text-amber-700 leading-relaxed">
                Afin de déposer votre CV PDF et de suivre l'étude de votre dossier, vous devez disposer d'un compte candidat chez le Groupe RIF.
              </p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => onGoToAuth("login")}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-amber-200 text-amber-900 font-bold rounded-lg text-xs transition-all cursor-pointer"
            >
              Se connecter
            </button>
            <button
              onClick={() => onGoToAuth("register")}
              className="px-4 py-2 bg-brand-blue-700 hover:bg-brand-blue-800 text-white font-bold rounded-lg text-xs transition-all cursor-pointer"
            >
              Créer un compte
            </button>
          </div>
        </div>
      )}

      {/* MULTI-STEP RECRUITMENT APPLICATION FORM */}
      {currentUser && currentUser.role === "CANDIDATE" && isApplying && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-8" id="application-form-stepper">
          
          {/* STEPPER HEADER INDICATOR */}
          <div className="border-b border-slate-100 pb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold font-display text-slate-900">Formulaire de candidature</h2>
              <span className="text-xs text-slate-400 font-mono font-semibold">Étape {currentStep} sur 3</span>
            </div>

            {/* Stepper Graphic */}
            <div className="flex items-center gap-2">
              <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${currentStep >= 1 ? "bg-brand-blue-600" : "bg-slate-100"}`} />
              <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${currentStep >= 2 ? "bg-brand-blue-600" : "bg-slate-100"}`} />
              <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${currentStep >= 3 ? "bg-brand-blue-600" : "bg-slate-100"}`} />
            </div>

            {/* Stepper labels */}
            <div className="grid grid-cols-3 text-center text-[10px] font-bold text-slate-400 mt-2">
              <span className={currentStep >= 1 ? "text-brand-blue-600" : ""}>1. Profil & Contact</span>
              <span className={currentStep >= 2 ? "text-brand-blue-600" : ""}>2. Parcours & Compétences</span>
              <span className={currentStep >= 3 ? "text-brand-blue-600" : ""}>3. Motivations & CV</span>
            </div>
          </div>

          {loadingProfile ? (
            <div className="flex flex-col items-center py-12">
              <Loader2 className="h-8 w-8 text-brand-blue-500 animate-spin" />
              <p className="text-xs text-slate-400 font-medium mt-2">Chargement de votre profil candidat...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* STEP 1: CONTACT & PERSONAL INFORMATION */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Informations personnelles & Contact
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Nom</label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Prénom</label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Adresse email</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Téléphone</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2 space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Adresse postale</label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Code postal</label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Ville</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Paris"
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Pays</label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Nationalité</label>
                      <input
                        type="text"
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Date de naissance</label>
                      <input
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Genre</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      >
                        <option>Homme</option>
                        <option>Femme</option>
                        <option>Autre</option>
                      </select>
                    </div>
                  </div>

                  <hr className="border-slate-100" />
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Réseaux Professionnels</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Lien LinkedIn</label>
                      <input
                        type="url"
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                        placeholder="https://linkedin.com/in/..."
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Lien GitHub</label>
                      <input
                        type="url"
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
                        placeholder="https://github.com/..."
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Lien Portfolio / Site</label>
                      <input
                        type="url"
                        value={portfolio}
                        onChange={(e) => setPortfolio(e.target.value)}
                        placeholder="https://mon-site.com"
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: EDUCATION, EXPERIENCE & SKILLS */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Situation actuelle & Mobilité</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Situation actuelle</label>
                      <select
                        value={currentSituation}
                        onChange={(e) => setCurrentSituation(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      >
                        <option>Étudiant</option>
                        <option>Jeune diplômé</option>
                        <option>Employé</option>
                        <option>Recherche d'emploi</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Disponibilité</label>
                      <select
                        value={availability}
                        onChange={(e) => setAvailability(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      >
                        <option>Immédiate</option>
                        <option>Sous 15 jours</option>
                        <option>Sous 1 mois</option>
                        <option>Autre</option>
                      </select>
                    </div>
                  </div>

                  <hr className="border-slate-100" />
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Formation & Diplômes</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Niveau d'études</label>
                      <select
                        value={educationLevel}
                        onChange={(e) => setEducationLevel(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      >
                        <option>Licence</option>
                        <option>Master</option>
                        <option>Ingénieur</option>
                        <option>Doctorat</option>
                        <option>Autre</option>
                      </select>
                    </div>
                    <div className="col-span-2 space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Université / École</label>
                      <input
                        type="text"
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                        placeholder="Université Paris Cité"
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Année d'obtention</label>
                      <input
                        type="number"
                        value={gradYear}
                        onChange={(e) => setGradYear(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Spécialité</label>
                    <input
                      type="text"
                      value={speciality}
                      onChange={(e) => setSpeciality(e.target.value)}
                      placeholder="Génie Logiciel / Réseaux et Télécoms"
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    />
                  </div>

                  <hr className="border-slate-100" />
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Expérience professionnelle</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Dernière entreprise</label>
                      <input
                        type="text"
                        value={currentCompany}
                        onChange={(e) => setCurrentCompany(e.target.value)}
                        placeholder="Ex: Capgemini, Alten..."
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Dernier poste</label>
                      <input
                        type="text"
                        value={currentPost}
                        onChange={(e) => setCurrentPost(e.target.value)}
                        placeholder="Ex: Stagiaire Dév"
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Années d'expérience</label>
                      <input
                        type="number"
                        value={yearsExp}
                        onChange={(e) => setYearsExp(Number(e.target.value))}
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                  </div>

                  <hr className="border-slate-100" />
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Compétences & Langues</h3>

                  {/* Skills tags selection */}
                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-slate-700">Compétences techniques</label>
                    <div className="flex flex-wrap gap-1.5 p-2 border border-slate-200 bg-slate-50 rounded-xl">
                      {skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-blue-500 text-white font-semibold rounded-lg text-xs"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="text-white/80 hover:text-white shrink-0 cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Ajouter (ex: Docker, GitLab CI...)"
                        className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none flex-1"
                      />
                      <button
                        type="button"
                        onClick={handleAddSkill}
                        className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" /> Ajouter
                      </button>
                    </div>
                  </div>

                  {/* Languages section */}
                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-slate-700">Langues maîtrisées</label>
                    <div className="space-y-2">
                      {languages.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-lg text-xs">
                          <span className="font-semibold text-slate-700">{item.lang} - <span className="text-slate-500 font-normal">{item.level}</span></span>
                          <button
                            type="button"
                            onClick={() => handleRemoveLanguage(idx)}
                            className="text-slate-400 hover:text-rose-500 cursor-pointer"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newLang}
                        onChange={(e) => setNewLang(e.target.value)}
                        placeholder="Ex: Allemand, Espagnol..."
                        className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none flex-1"
                      />
                      <select
                        value={newLangLevel}
                        onChange={(e) => setNewLangLevel(e.target.value)}
                        className="px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none"
                      >
                        <option>Débutant</option>
                        <option>Intermédiaire</option>
                        <option>Courant</option>
                        <option>Bilingue</option>
                      </select>
                      <button
                        type="button"
                        onClick={handleAddLanguage}
                        className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" /> Ajouter
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Résumé professionnel / Profil (Affiche sur votre carte)</label>
                    <textarea
                      value={profileSummary}
                      onChange={(e) => setProfileSummary(e.target.value)}
                      placeholder="Présentez brièvement vos forces technologiques et vos motivations majeures..."
                      rows={3}
                      className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: MOTIVATION, CV FILE & VALIDATION */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    Téléversement du CV & Motivations
                  </h3>

                  {/* CV File Input - Mandatory */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700">Dépôt du CV (PDF uniquement, max 5 Mo) <span className="text-rose-500">*</span></label>
                    <div className="border-2 border-dashed border-slate-200 hover:border-brand-blue-500 bg-slate-50 rounded-2xl p-6 transition-colors relative flex flex-col items-center justify-center text-center">
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Upload className="h-8 w-8 text-slate-400 mb-2" />
                      <p className="text-sm font-semibold text-slate-700">Glissez-déposez ou cliquez pour téléverser</p>
                      <p className="text-xs text-slate-400 mt-1">Seuls les fichiers .pdf de taille inférieure à 5 Mo sont autorisés.</p>
                    </div>

                    {cvFile && (
                      <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                        <FileText className="h-6 w-6 text-emerald-600" />
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-xs font-bold text-emerald-950 truncate">{cvFile.name}</p>
                          <p className="text-[10px] text-emerald-600 font-mono">{(cvFile.size / (1024 * 1024)).toFixed(2)} Mo</p>
                        </div>
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2.5 py-0.5 rounded-full">Prêt</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Lettre de motivation / Pourquoi souhaitez-vous rejoindre RIF ? <span className="text-rose-500">*</span></label>
                    <textarea
                      required
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Détaillez vos motivations, pourquoi notre structure vous intéresse et comment vous pouvez contribuer..."
                      rows={4}
                      className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Prétentions salariales annuelles (K€, optionnel)</label>
                      <input
                        type="number"
                        value={expectedSalary}
                        onChange={(e) => setExpectedSalary(Number(e.target.value))}
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">Mobilité géographique</label>
                        <select
                          value={mobility}
                          onChange={(e) => setMobility(e.target.value)}
                          className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                        >
                          <option>Oui</option>
                          <option>Non</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">Permis de conduire</label>
                        <select
                          value={drivingLicense}
                          onChange={(e) => setDrivingLicense(e.target.value)}
                          className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                        >
                          <option>Oui</option>
                          <option>Non</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Réalisations importantes (optionnel)</label>
                      <textarea
                        value={achievements}
                        onChange={(e) => setAchievements(e.target.value)}
                        placeholder="Ex: Projets open-source, refontes d'architecture d'entreprise..."
                        rows={2}
                        className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Certifications obtenues (optionnel)</label>
                      <textarea
                        value={certifications}
                        onChange={(e) => setCertifications(e.target.value)}
                        placeholder="Ex: AWS Certified Cloud Practitioner, Oracle Certified Java..."
                        rows={2}
                        className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP NAVIGATION BUTTONS */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="flex items-center gap-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-all cursor-pointer"
                  >
                    <ArrowLeftIcon className="h-3.5 w-3.5" /> Précédent
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsApplying(false)}
                    className="flex items-center gap-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-all cursor-pointer"
                  >
                    Annuler
                  </button>
                )}

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (currentStep === 1 && !validateStep1()) return;
                      setCurrentStep(currentStep + 1);
                    }}
                    className="flex items-center gap-1 px-5 py-2.5 bg-brand-blue-700 hover:bg-brand-blue-800 text-white font-bold rounded-lg text-xs transition-all cursor-pointer"
                  >
                    Continuer <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Soumission en cours...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" /> Soumettre ma candidature
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
