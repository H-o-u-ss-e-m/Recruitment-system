import React, { useState, useEffect } from "react";
import { Briefcase, Calendar, CheckCircle2, Clock, XCircle, ChevronRight, Loader2, User, Key, Save, AlertTriangle, ShieldCheck, Mail, MapPin, Phone, MessageSquare, FileText, Globe } from "lucide-react";
import { useToast } from "./Toast";
import { AuthResponse, ApplicationResponse, CandidateFullProfile } from "../types";
import { apiFetch, resolveBackendUrl } from "../lib/api";

interface MyApplicationsProps {
  currentUser: AuthResponse;
  onSelectOffer: (offerId: number) => void;
}

export const MyApplications: React.FC<MyApplicationsProps> = ({ currentUser, onSelectOffer }) => {
  const { showToast } = useToast();
  const [activeSubTab, setActiveSubTab] = useState<"applications" | "profile">("applications");
  
  // Applications list
  const [apps, setApps] = useState<ApplicationResponse[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);
  
  // Selected application detail for history timeline modal/row expansion
  const [selectedApp, setSelectedApp] = useState<ApplicationResponse | null>(null);

  // Profile Form state
  const [profile, setProfile] = useState<CandidateFullProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // Edit fields
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [summary, setSummary] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const normalizePortfolio = (value?: string | null) => {
    if (!value) {
      return "";
    }

    const trimmed = value.trim();
    if (!trimmed || trimmed === "prof@prof" || trimmed.includes("@") && !trimmed.startsWith("http")) {
      return "";
    }

    return trimmed;
  };

  // Fetch applications
  const fetchMyApplications = async () => {
    setLoadingApps(true);
    try {
      const res = await apiFetch("/api/applications/my", {
        headers: { "user-id": String(currentUser.id) },
      });
      if (res.ok) {
        const data = await res.json();
        setApps(data.map((app: ApplicationResponse) => ({ ...app, cvUrl: resolveBackendUrl(app.cvUrl) })));
      } else {
        throw new Error("Unable to fetch applications");
      }
    } catch (err) {
      showToast("Impossible de charger vos candidatures.", "error");
    } finally {
      setLoadingApps(false);
    }
  };

  // Fetch full profile details
  const fetchProfileDetails = async () => {
    setLoadingProfile(true);
    try {
      const res = await apiFetch(`/api/candidates/${currentUser.id}/full-profile`);
      if (res.ok) {
        const data: CandidateFullProfile = await res.json();
        setProfile(data);
        setPhone(data.phone || "");
        setAddress(data.address || "");
        setCity(data.city || "");
        setPostalCode(data.postalCode || "");
        setLinkedin(data.linkedinUrl || "");
        setGithub(data.githubUrl || "");
        setPortfolio(normalizePortfolio(data.portfolioUrl));
        setSummary(data.profileDescription || "");
      }
    } catch (err) {
      showToast("Impossible de charger les données de votre profil.", "error");
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchMyApplications();
  }, [currentUser]);

  useEffect(() => {
    if (activeSubTab === "profile") {
      fetchProfileDetails();
    }
  }, [activeSubTab, currentUser]);

  // Handle Profile Update
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword && newPassword !== confirmPassword) {
      showToast("Les nouveaux mots de passe ne correspondent pas.", "error");
      return;
    }

    setSavingProfile(true);
    try {
      const updatePayload: any = {
        phone,
        address,
        postalCode,
        linkedinUrl: linkedin,
        githubUrl: github,
        portfolioUrl: portfolio,
        profileDescription: summary,
      };

      if (newPassword) {
        updatePayload.password = newPassword;
      }

      const res = await apiFetch(`/api/candidates/${currentUser.id}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      });

      if (!res.ok) throw new Error("Update failed");

      showToast("Profil candidat mis à jour avec succès !", "success");
      setNewPassword("");
      setConfirmPassword("");
      fetchProfileDetails();
    } catch (err) {
      showToast("Une erreur est survenue lors de la mise à jour.", "error");
    } finally {
      setSavingProfile(false);
    }
  };

  // Status visual badge details
  const getStatusBadge = (status: string) => {
    let color = "bg-amber-50 text-amber-700 border-amber-100";
    let Icon = Clock;
    let label = "En attente";

    if (status === "EN_COURS") {
      color = "bg-blue-50 text-brand-blue-700 border-brand-blue-200";
      Icon = Clock;
      label = "En cours d'étude";
    } else if (status === "ACCEPTE" || status === "ACCEPTEE") {
      color = "bg-emerald-50 text-emerald-700 border-emerald-100";
      Icon = CheckCircle2;
      label = "Acceptée";
    } else if (status === "REFUSE" || status === "REFUSEE") {
      color = "bg-rose-50 text-rose-700 border-rose-100";
      Icon = XCircle;
      label = "Refusée";
    }

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${color}`}>
        <Icon className="h-3.5 w-3.5 shrink-0" />
        {label}
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8 space-y-8 text-left" id="my-candidate-portal">
      {/* CANDIDATE GREETING HEADER */}
      <div className="bg-gradient-to-r from-brand-blue-800 to-brand-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center text-brand-gold-400 border border-white/10 shrink-0">
            <User className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold font-display">{currentUser.name}</h1>
            <p className="text-xs text-slate-300 font-light flex items-center gap-1">
              <Mail className="h-3.5 w-3.5 text-brand-gold-400" />
              {currentUser.email}
            </p>
          </div>
        </div>

        {/* SUBTABS SWITCHER */}
        <div className="bg-black/20 p-1 rounded-xl flex self-start sm:self-center">
          <button
            onClick={() => setActiveSubTab("applications")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeSubTab === "applications" ? "bg-brand-gold-400 text-brand-blue-950" : "text-slate-300 hover:text-white"}`}
          >
            Mes candidatures
          </button>
          <button
            onClick={() => setActiveSubTab("profile")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeSubTab === "profile" ? "bg-brand-gold-400 text-brand-blue-950" : "text-slate-300 hover:text-white"}`}
          >
            Mon profil
          </button>
        </div>
      </div>

      {/* PORTAL BODY */}
      {activeSubTab === "applications" ? (
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-900 font-display">Suivi de mes dossiers de recrutement</h2>

          {loadingApps ? (
            <div className="bg-white border border-slate-200 rounded-2xl py-16 flex flex-col items-center justify-center text-center">
              <Loader2 className="h-8 w-8 text-brand-blue-500 animate-spin" />
              <p className="text-xs text-slate-400 font-semibold mt-2">Chargement de votre historique...</p>
            </div>
          ) : apps.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* APPLICATIONS TABLE / CARDS GRID */}
              <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                {/* Desktop view */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-150 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                        <th className="px-6 py-4">Offre / Poste</th>
                        <th className="px-6 py-4">Date de dépôt</th>
                        <th className="px-6 py-4">Statut</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {apps.map((app) => (
                        <tr
                          key={app.id}
                          className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${selectedApp?.id === app.id ? "bg-slate-50" : ""}`}
                          onClick={() => setSelectedApp(app)}
                        >
                          <td className="px-6 py-4 font-semibold text-slate-900">
                            {app.jobTitle}
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-500 font-semibold">
                            {new Date(app.datePostulation).toLocaleDateString("fr-FR")}
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(app.status)}
                          </td>
                          <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => setSelectedApp(app)}
                              className="text-brand-blue-600 hover:text-brand-blue-800 text-xs font-bold inline-flex items-center gap-0.5 cursor-pointer"
                            >
                              Suivre <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile view cards */}
                <div className="block md:hidden divide-y divide-slate-100">
                  {apps.map((app) => (
                    <div
                      key={app.id}
                      className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer space-y-3 ${selectedApp?.id === app.id ? "bg-slate-50" : ""}`}
                      onClick={() => setSelectedApp(app)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-slate-900 text-sm leading-snug">{app.jobTitle}</h4>
                        {getStatusBadge(app.status)}
                      </div>
                      <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
                        <span>Soumis le : {new Date(app.datePostulation).toLocaleDateString("fr-FR")}</span>
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="text-brand-blue-600 font-bold"
                        >
                          Détails
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* TIMELINE PROGRESS PANEL */}
              <div className="lg:col-span-4 space-y-6">
                {selectedApp ? (
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 text-left">
                    <div className="pb-4 border-b border-slate-100 space-y-2">
                      <span className="text-[10px] font-bold text-brand-gold-600 uppercase tracking-wider">Candidature active</span>
                      <h3 className="font-bold text-slate-900 text-base leading-snug">{selectedApp.jobTitle}</h3>
                      <p className="text-xs text-slate-400">Réf: #RIF-00{selectedApp.id}</p>
                    </div>

                    {/* Timeline Tracker list */}
                    <div className="space-y-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                      
                      {/* Step 1: Soumission */}
                      <div className="flex gap-4 relative">
                        <div className="h-7 w-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0 z-10">
                          ✓
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">Dossier reçu</h4>
                          <p className="text-[10px] text-slate-400">{new Date(selectedApp.datePostulation).toLocaleDateString("fr-FR")} à {new Date(selectedApp.datePostulation).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}</p>
                          <p className="text-xs text-slate-500 mt-1">Votre candidature a été déposée avec succès. Le CV "{selectedApp.cvFilename}" est bien enregistré.</p>
                        </div>
                      </div>

                      {/* Step 2: Étude en cours */}
                      <div className="flex gap-4 relative">
                        <div className={`h-7 w-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 z-10 ${["EN_COURS", "ACCEPTE", "REFUSE"].includes(selectedApp.status) ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-400"}`}>
                          2
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">Examen par les RH</h4>
                          <p className="text-[10px] text-slate-400">
                            {["EN_COURS", "ACCEPTE", "REFUSE"].includes(selectedApp.status) ? "En cours d'évaluation" : "En attente d'ouverture"}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {["EN_COURS", "ACCEPTE", "REFUSE"].includes(selectedApp.status) 
                              ? "Votre dossier est activement étudié par notre équipe de recrutement technique RIF." 
                              : "Candidature en file d'attente d'examen."}
                          </p>
                        </div>
                      </div>

                      {/* Step 3: Décision */}
                      <div className="flex gap-4 relative">
                        <div className={`h-7 w-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 z-10 ${selectedApp.status === "ACCEPTE" ? "bg-emerald-500 text-white" : selectedApp.status === "REFUSE" ? "bg-rose-500 text-white" : "bg-slate-100 text-slate-400"}`}>
                          3
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">Entretien & Décision</h4>
                          <p className="text-xs text-slate-500 mt-1">
                            {selectedApp.status === "ACCEPTE" && (
                              <span className="text-emerald-600 font-semibold">Félicitations ! Votre profil a suscité un grand intérêt. Notre équipe RH va vous contacter par téléphone sous 24 heures pour planifier un entretien technique.</span>
                            )}
                            {selectedApp.status === "REFUSE" && (
                              <span className="text-rose-600 font-medium">Malgré la qualité de votre parcours, nous avons le regret de ne pas pouvoir donner une suite favorable à votre candidature pour ce poste précis.</span>
                            )}
                            {!["ACCEPTE", "REFUSE"].includes(selectedApp.status) && (
                              <span>La décision finale vous sera transmise par notification e-mail automatique dès validation RH.</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Integrated CV link */}
                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
                      <span className="text-slate-400">Document joint :</span>
                      <a
                        href={selectedApp.cvUrl}
                        download={selectedApp.cvFilename}
                        className="font-bold text-brand-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <FileText className="h-3.5 w-3.5" /> CV PDF
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400 space-y-2">
                    <MessageSquare className="h-8 w-8 mx-auto text-slate-300" />
                    <h4 className="text-sm font-bold text-slate-700">Aucune sélection</h4>
                    <p className="text-xs text-slate-400">Cliquez sur une candidature de la liste pour visualiser son historique détaillé et l'évolution de son statut en temps réel.</p>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl py-12 text-center max-w-lg mx-auto space-y-4">
              <Briefcase className="h-10 w-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">Aucune candidature déposée</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Vous n'avez pas encore postulé aux offres de stage et d'emploi du Groupe RIF. Découvrez toutes nos opportunités dès aujourd'hui.
              </p>
              <button
                onClick={() => onSelectOffer(0)} // Goes back to offer listing
                className="px-5 py-2 text-xs font-bold text-white bg-brand-blue-600 hover:bg-brand-blue-700 rounded-xl transition-colors cursor-pointer"
              >
                Consulter les offres d'emploi
              </button>
            </div>
          )}
        </div>
      ) : (
        /* CANDIDATE PROFILE FORM */
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm text-left">
          <div className="border-b border-slate-100 pb-4 mb-6 space-y-1">
            <h2 className="text-xl font-bold font-display text-slate-900">Éditer mes informations de profil</h2>
            <p className="text-xs text-slate-500">Mettez à jour vos coordonnées professionnelles afin que nos recruteurs disposent d'un dossier actualisé.</p>
          </div>

          {loadingProfile ? (
            <div className="py-12 flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 text-brand-blue-500 animate-spin" />
              <p className="text-xs text-slate-400 font-medium mt-1">Chargement des détails...</p>
            </div>
          ) : (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Téléphone de contact</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Adresse</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Ville</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
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

              <hr className="border-slate-100" />
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Réseaux & Portfolio</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">LinkedIn</label>
                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/..."
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">GitHub</label>
                  <input
                    type="url"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Portfolio</label>
                  <input
                    type="url"
                    value={portfolio}
                    onChange={(e) => setPortfolio(e.target.value)}
                    placeholder="https://site.com"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Résumé professionnel / Présentation</label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={3}
                  className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <hr className="border-slate-100" />
              
              {/* PASSWORD SECURITY UPDATE SECTION */}
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Key className="h-4 w-4" />
                  Sécurité du compte (Changement de mot de passe)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Nouveau mot de passe</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Confirmer le nouveau mot de passe</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-3 bg-brand-blue-700 hover:bg-brand-blue-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm cursor-pointer transition-colors"
                >
                  {savingProfile ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" /> Sauvegarder les modifications
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
