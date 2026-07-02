import React, { useState, useEffect, useMemo } from "react";
import { LayoutDashboard, Briefcase, Users, PlusCircle, LogOut, CheckCircle2, Clock, XCircle, ChevronRight, Search, FileText, Phone, Mail, MapPin, Building2, Calendar, DollarSign, ArrowUpDown, Trash2, Edit2, ShieldAlert, AlertTriangle, Eye, Loader2, Download } from "lucide-react";
import { useToast } from "./Toast";
import { AuthResponse, JobOfferResponse, ApplicationResponse, CandidateFullProfile } from "../types";
import { PDFViewer } from "./PDFViewer";
import { apiFetch, resolveBackendUrl } from "../lib/api";

interface RecruiterDashboardProps {
  currentUser: AuthResponse;
  onLogout: () => void;
}

type RecruiterTab = "dashboard" | "offers" | "applications" | "create-offer" | "offer-details" | "candidate-details";

export const RecruiterDashboard: React.FC<RecruiterDashboardProps> = ({ currentUser, onLogout }) => {
  const { showToast } = useToast();
  
  // Tab states
  const [activeTab, setActiveTab] = useState<RecruiterTab>("dashboard");
  
  // Data lists synchronized with local Express backend
  const [offers, setOffers] = useState<JobOfferResponse[]>([]);
  const [applications, setApplications] = useState<ApplicationResponse[]>([]);
  
  // Loaders
  const [loading, setLoading] = useState(true);

  // Selected Detail Views
  const [selectedOfferId, setSelectedOfferId] = useState<number | null>(null);
  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateFullProfile | null>(null);
  const [loadingCandidate, setLoadingCandidate] = useState(false);

  // Offer Creation Form State
  const [newTitle, setNewTitle] = useState("");
  const [newDept, setNewDept] = useState("Informatique");
  const [newDesc, setNewDesc] = useState("");
  const [newReqSkills, setNewReqSkills] = useState("");
  const [newLimitDate, setNewLimitDate] = useState("2026-08-31");
  const [submittingOffer, setSubmittingOffer] = useState(false);

  // Status Change Confirmation Modal State
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<"EN_ATTENTE" | "EN_COURS" | "ACCEPTE" | "REFUSE" | null>(null);
  const [updatingAppId, setUpdatingAppId] = useState<number | null>(null);

  // Search & Filters inside lists
  const [appSearch, setAppSearch] = useState("");
  const [appStatusFilter, setAppStatusFilter] = useState("Tous");
  
  const [offerSearch, setOfferSearch] = useState("");

  // Fetch all state data
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch offers
      const offersRes = await apiFetch("/api/job-offers/open");
      const offersData = await offersRes.json();
      setOffers(offersData);

      // 2. Fetch all applications
      const appsRes = await apiFetch("/api/applications/all");
      const appsData = await appsRes.json();
      setApplications(appsData.map((app: ApplicationResponse) => ({ ...app, cvUrl: resolveBackendUrl(app.cvUrl) })));
    } catch (err) {
      showToast("Impossible de synchroniser les données du tableau de bord.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // Handle single candidate details retrieval
  const loadCandidateDetails = async (candidateId: number, appId: number) => {
    setLoadingCandidate(true);
    setSelectedAppId(appId);
    setActiveTab("candidate-details");
    try {
      const res = await apiFetch(`/api/candidates/${candidateId}/full-profile`);
      if (res.ok) {
        const data = await res.json();
        setSelectedCandidate(data);
      } else {
        throw new Error("Could not load candidate full profile");
      }
    } catch (err) {
      showToast("Impossible de charger le dossier détaillé du candidat.", "error");
    } finally {
      setLoadingCandidate(false);
    }
  };

  // Submit Offer Handler
  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc) {
      showToast("Veuillez remplir le titre et la description du poste.", "error");
      return;
    }

    setSubmittingOffer(true);
    try {
      const res = await apiFetch("/api/job-offers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-id": String(currentUser.id),
        },
        body: JSON.stringify({
          titrePoste: newTitle,
          descriptionPoste: newDesc,
          competencesRequises: newReqSkills,
          dateLimite: newLimitDate,
        }),
      });

      if (!res.ok) throw new Error("Could not create job offer");

      showToast("Offre d'emploi publiée et indexée avec succès !", "success");
      
      // Reset form
      setNewTitle("");
      setNewDesc("");
      setNewReqSkills("");
      
      setActiveTab("offers");
      fetchData();
    } catch (err) {
      showToast("Échec de la publication de l'offre.", "error");
    } finally {
      setSubmittingOffer(false);
    }
  };

  // Trigger Status change (shows modal for confirmation!)
  const triggerStatusChange = (appId: number, status: "EN_ATTENTE" | "EN_COURS" | "ACCEPTE" | "REFUSE") => {
    setUpdatingAppId(appId);
    setPendingStatus(status);
    setShowConfirmModal(true);
  };

  // Execute actual status change
  const executeStatusChange = async () => {
    if (!updatingAppId || !pendingStatus) return;

    try {
      const res = await apiFetch(`/api/applications/${updatingAppId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: pendingStatus }),
      });

      if (!res.ok) throw new Error("Status update failed");

      showToast("Statut de candidature mis à jour ! Notification envoyée.", "success");
      
      // Update local state directly so UI responds instantly
      setApplications((prev) =>
        prev.map((app) => (app.id === updatingAppId ? { ...app, status: pendingStatus } : app))
      );

      // If we are looking at the candidate detail card, refresh the application info
      const updatedApp = applications.find((app) => app.id === updatingAppId);
      if (updatedApp) {
        updatedApp.status = pendingStatus;
      }
    } catch (err) {
      showToast("Impossible de changer le statut.", "error");
    } finally {
      setShowConfirmModal(false);
      setUpdatingAppId(null);
      setPendingStatus(null);
    }
  };

  // Memoized stats calculation for widgets
  const stats = useMemo(() => {
    const totalOffers = offers.length;
    const totalApps = applications.length;
    
    // Extract unique candidate count
    const uniqueCandidates = new Set(applications.map((a) => a.candidateId)).size;

    const enAttente = applications.filter((a) => a.status === "EN_ATTENTE").length;
    const enCours = applications.filter((a) => a.status === "EN_COURS").length;
    const acceptees = applications.filter((a) => a.status === "ACCEPTE" || (a.status as string) === "ACCEPTEE").length;
    const refusees = applications.filter((a) => a.status === "REFUSE" || (a.status as string) === "REFUSEE").length;

    return {
      totalOffers,
      totalApps,
      uniqueCandidates,
      enAttente,
      enCours,
      acceptees,
      refusees,
    };
  }, [offers, applications]);

  // Filter application listings
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        app.candidateFullName.toLowerCase().includes(appSearch.toLowerCase()) ||
        app.jobTitle.toLowerCase().includes(appSearch.toLowerCase()) ||
        app.candidateEmail.toLowerCase().includes(appSearch.toLowerCase());

      const matchesStatus =
  appStatusFilter === "Tous" ||
  app.status === appStatusFilter ||
  (appStatusFilter === "ACCEPTE" && (app.status as string) === "ACCEPTEE") ||
  (appStatusFilter === "REFUSE" && (app.status as string) === "REFUSEE");

      return matchesSearch && matchesStatus;
    });
  }, [applications, appSearch, appStatusFilter]);

  // Get matching applications for single offer details
  const singleOfferApplications = useMemo(() => {
    if (!selectedOfferId) return [];
    return applications.filter((app) => app.jobOfferId === selectedOfferId);
  }, [applications, selectedOfferId]);

  const selectedOffer = useMemo(() => {
    if (!selectedOfferId) return null;
    return offers.find((o) => o.id === selectedOfferId) || null;
  }, [offers, selectedOfferId]);

  // Render Status Badge
  const getStatusBadge = (status: string) => {
    let style = "bg-amber-50 text-amber-700 border-amber-200";
    let text = "À l'étude";

    if (status === "EN_COURS") {
      style = "bg-blue-50 text-brand-blue-700 border-brand-blue-200";
      text = "En cours";
    } else if (status === "ACCEPTE" || status === "ACCEPTEE") {
      style = "bg-emerald-50 text-emerald-700 border-emerald-200";
      text = "Acceptée";
    } else if (status === "REFUSE" || status === "REFUSEE") {
      style = "bg-rose-50 text-rose-700 border-rose-200";
      text = "Refusée";
    }

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${style}`}>
        {text}
      </span>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[85vh] bg-slate-50 rounded-3xl overflow-hidden border border-slate-200 shadow-lg mx-4 lg:mx-8 my-6 text-left" id="recruiter-portal-dashboard">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full lg:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
        {/* Recruiter Badge */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/40 space-y-1.5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-brand-gold-400 text-brand-blue-950 flex items-center justify-center font-extrabold font-display">
              RH
            </div>
            <div>
              <p className="text-sm font-bold text-white font-display truncate max-w-[140px]">{currentUser.name}</p>
              <p className="text-[10px] text-brand-gold-400 font-bold uppercase tracking-wider">Recruteur</p>
            </div>
          </div>
        </div>

        {/* Sidebar Nav items */}
        <nav className="flex-1 p-4 space-y-1.5 text-sm font-semibold">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${activeTab === "dashboard" ? "bg-brand-blue-700 text-white shadow-md shadow-brand-blue-800/10" : "hover:bg-slate-800 hover:text-slate-200"}`}
          >
            <LayoutDashboard className="h-4 w-4 shrink-0" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab("offers")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${activeTab === "offers" || activeTab === "offer-details" ? "bg-brand-blue-700 text-white shadow-md shadow-brand-blue-800/10" : "hover:bg-slate-800 hover:text-slate-200"}`}
          >
            <Briefcase className="h-4 w-4 shrink-0" />
            <span>Gestion des offres</span>
          </button>

          <button
            onClick={() => setActiveTab("applications")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${activeTab === "applications" || activeTab === "candidate-details" ? "bg-brand-blue-700 text-white shadow-md shadow-brand-blue-800/10" : "hover:bg-slate-800 hover:text-slate-200"}`}
          >
            <Users className="h-4 w-4 shrink-0" />
            <span>Candidatures</span>
            {stats.enAttente > 0 && (
              <span className="ml-auto bg-brand-gold-500 text-brand-blue-950 text-[10px] px-1.5 py-0.5 rounded-full font-extrabold animate-pulse">
                {stats.enAttente}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("create-offer")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${activeTab === "create-offer" ? "bg-brand-blue-700 text-white shadow-md shadow-brand-blue-800/10" : "hover:bg-slate-800 hover:text-slate-200"}`}
          >
            <PlusCircle className="h-4 w-4 shrink-0" />
            <span>Créer une offre</span>
          </button>
        </nav>

        {/* Sidebar Logout button */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-rose-500/5 transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* WORKSPACE AREA */}
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto max-h-[85vh]">
        
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center text-center">
            <Loader2 className="h-8 w-8 text-brand-blue-500 animate-spin" />
            <p className="text-xs text-slate-400 font-semibold mt-2">Mise à jour des statistiques...</p>
          </div>
        ) : (
          <>
            {/* VIEW 1: MAIN DASHBOARD */}
            {activeTab === "dashboard" && (
              <div className="space-y-8 animate-fade-in">
                {/* Greeting banner */}
                <div className="space-y-1">
                  <h1 className="text-2xl font-extrabold font-display text-slate-900">Vue d'ensemble</h1>
                  <p className="text-xs text-slate-500">Statistiques de recrutement et répartition des dossiers de stage/emploi.</p>
                </div>

                {/* Grid of Widgets */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Offres Ouvertes</p>
                    <p className="text-3xl font-extrabold font-display text-slate-900">{stats.totalOffers}</p>
                    <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">Actives chez Groupe RIF</p>
                  </div>
                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Candidats uniques</p>
                    <p className="text-3xl font-extrabold font-display text-slate-900">{stats.uniqueCandidates}</p>
                    <p className="text-[10px] text-slate-500 font-semibold">Comptes candidats inscrits</p>
                  </div>
                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Candidatures reçues</p>
                    <p className="text-3xl font-extrabold font-display text-slate-900">{stats.totalApps}</p>
                    <p className="text-[10px] text-indigo-600 font-semibold flex items-center gap-1">Dossiers déposés au total</p>
                  </div>
                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Candidatures en attente</p>
                    <p className="text-3xl font-extrabold font-display text-amber-600">{stats.enAttente}</p>
                    <p className="text-[10px] text-amber-600 font-semibold flex items-center gap-1">À étudier d'urgence</p>
                  </div>
                </div>

                {/* Charts and distributions */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4">
                  
                  {/* Status Breakdown distribution Widget */}
                  <div className="md:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                    <h3 className="font-bold text-slate-900 text-sm font-display">Statut de traitement des candidatures</h3>
                    
                    <div className="space-y-4 pt-2">
                      {/* Attente progress */}
                      <div className="space-y-1.5 text-xs font-semibold text-slate-600">
                        <div className="flex justify-between">
                          <span>À étudier (En attente)</span>
                          <span className="font-bold text-amber-600">{stats.enAttente} / {stats.totalApps}</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${stats.totalApps ? (stats.enAttente / stats.totalApps) * 100 : 0}%` }}
                            className="h-full bg-amber-500 transition-all duration-300"
                          />
                        </div>
                      </div>

                      {/* En cours progress */}
                      <div className="space-y-1.5 text-xs font-semibold text-slate-600">
                        <div className="flex justify-between">
                          <span>En cours d'étude</span>
                          <span className="font-bold text-blue-600">{stats.enCours} / {stats.totalApps}</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${stats.totalApps ? (stats.enCours / stats.totalApps) * 100 : 0}%` }}
                            className="h-full bg-blue-500 transition-all duration-300"
                          />
                        </div>
                      </div>

                      {/* Acceptées progress */}
                      <div className="space-y-1.5 text-xs font-semibold text-slate-600">
                        <div className="flex justify-between text-emerald-800">
                          <span>Dossiers acceptés</span>
                          <span className="font-bold">{stats.acceptees} / {stats.totalApps}</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${stats.totalApps ? (stats.acceptees / stats.totalApps) * 100 : 0}%` }}
                            className="h-full bg-emerald-500 transition-all duration-300"
                          />
                        </div>
                      </div>

                      {/* Refusées progress */}
                      <div className="space-y-1.5 text-xs font-semibold text-slate-600">
                        <div className="flex justify-between text-rose-800">
                          <span>Dossiers refusés</span>
                          <span className="font-bold">{stats.refusees} / {stats.totalApps}</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${stats.totalApps ? (stats.refusees / stats.totalApps) * 100 : 0}%` }}
                            className="h-full bg-rose-500 transition-all duration-300"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Activity feed / Recruiter Reminders */}
                  <div className="md:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                    <h3 className="font-bold text-slate-900 text-sm font-display">Notes et Rappels RH</h3>
                    <div className="space-y-3.5 text-xs text-slate-600 pt-2 leading-relaxed font-light">
                      <div className="p-3 bg-blue-50/50 border border-blue-150 rounded-xl flex gap-2">
                        <Clock className="h-4 w-4 text-brand-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-slate-800">Mise à jour des statuts</p>
                          <p className="text-[11px] text-slate-500">Chaque changement déclenche l'envoi d'un mail au candidat (automatisé par le backend Spring).</p>
                        </div>
                      </div>
                      <div className="p-3 bg-amber-50/50 border border-amber-150 rounded-xl flex gap-2">
                        <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-slate-800">Dépôts de CV obligatoires</p>
                          <p className="text-[11px] text-slate-500">Vérifiez l'extension et visualisez-les directement via l'outil d'aperçu intégré dans la fiche candidat.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* VIEW 2: GESTION DES OFFRES LIST */}
            {activeTab === "offers" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1">
                    <h1 className="text-2xl font-extrabold font-display text-slate-900">Gestion des offres</h1>
                    <p className="text-xs text-slate-500">Consultez et gérez les fiches de poste ouvertes ou fermées.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("create-offer")}
                    className="px-4 py-2 bg-brand-blue-700 hover:bg-brand-blue-800 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    <PlusCircle className="h-4 w-4" /> Publier une offre
                  </button>
                </div>

                {/* Offer list content */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-150 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                        <th className="px-6 py-4">Titre de l'offre</th>
                        <th className="px-6 py-4">Date limite</th>
                        <th className="px-6 py-4">Statut</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {offers.map((offer) => (
                        <tr key={offer.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-bold text-slate-900">{offer.titrePoste}</p>
                              <p className="text-[10px] text-slate-400 font-semibold">{offer.recruiterName}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                            {new Date(offer.dateLimite).toLocaleDateString("fr-FR")}
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase">
                              Active
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedOfferId(offer.id);
                                setActiveTab("offer-details");
                              }}
                              className="text-brand-blue-600 hover:text-brand-blue-800 text-xs font-bold inline-flex items-center gap-0.5 cursor-pointer"
                            >
                              Gérer l'offre <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* VIEW 3: SINGLE OFFER DETAILS + ASSOCIATED CANDIDATES */}
            {activeTab === "offer-details" && selectedOffer && (
              <div className="space-y-8">
                <button
                  onClick={() => setActiveTab("offers")}
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  ← Retour à la gestion des offres
                </button>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <span className="text-[10px] font-extrabold text-brand-gold-600 uppercase tracking-wider">Fiche de poste référencée</span>
                  <h2 className="text-xl font-extrabold font-display text-slate-900">{selectedOffer.titrePoste}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs text-slate-500 border-t border-slate-100 pt-4 font-semibold">
                    <div>
                      <p className="text-slate-400 text-[10px] uppercase">Service émetteur</p>
                      <p>{selectedOffer.recruiterName}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px] uppercase">Date de parution</p>
                      <p>{new Date(selectedOffer.datePublication).toLocaleDateString("fr-FR")}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px] uppercase">Candidatures liées</p>
                      <p className="text-brand-blue-600 font-bold">{singleOfferApplications.length} dossiers déposés</p>
                    </div>
                  </div>
                </div>

                {/* Associated candidate applications */}
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm font-display">Candidats ayant postulé à cette offre</h3>
                  
                  {singleOfferApplications.length > 0 ? (
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-150 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                            <th className="px-6 py-4">Nom du candidat</th>
                            <th className="px-6 py-4">Date de dépôt</th>
                            <th className="px-6 py-4">Statut actuel</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                          {singleOfferApplications.map((app) => (
                            <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                              <td className="px-6 py-4">
                                <div>
                                  <p className="font-bold text-slate-900">{app.candidateFullName}</p>
                                  <p className="text-xs text-slate-400 font-medium">{app.candidateEmail}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-xs text-slate-500 font-semibold">
                                {new Date(app.datePostulation).toLocaleDateString("fr-FR")}
                              </td>
                              <td className="px-6 py-4">
                                {getStatusBadge(app.status)}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button
                                  onClick={() => loadCandidateDetails(app.candidateId, app.id)}
                                  className="text-brand-blue-600 hover:text-brand-blue-800 text-xs font-bold inline-flex items-center gap-0.5 cursor-pointer"
                                >
                                  Consulter la fiche <ChevronRight className="h-3.5 w-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="bg-white border border-dashed border-slate-200 rounded-2xl py-12 text-center text-slate-400">
                      <p className="text-sm font-semibold">Aucun candidat n'a encore postulé à cette offre.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* VIEW 4: GENERAL CANDIDATURES (ALL APPLICATIONS) */}
            {activeTab === "applications" && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h1 className="text-2xl font-extrabold font-display text-slate-900">Suivi des candidatures</h1>
                  <p className="text-xs text-slate-500">Examinez l'intégralité des dossiers candidats de la plateforme RIF.</p>
                </div>

                {/* Filters Row */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={appSearch}
                      onChange={(e) => setAppSearch(e.target.value)}
                      placeholder="Filtrer par nom de candidat, poste..."
                      className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto self-start sm:self-center">
                    <span className="text-xs text-slate-400 font-semibold shrink-0">Filtrer statut:</span>
                    <select
                      value={appStatusFilter}
                      onChange={(e) => setAppStatusFilter(e.target.value)}
                      className="py-1.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs outline-none"
                    >
                      <option value="Tous">Tous</option>
                      <option value="EN_ATTENTE">En attente (À l'étude)</option>
                      <option value="EN_COURS">En cours d'examen</option>
                      <option value="ACCEPTE">Acceptée</option>
                      <option value="REFUSE">Refusée</option>
                    </select>
                  </div>
                </div>

                {/* Table of all apps */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-150 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                        <th className="px-6 py-4">Candidat</th>
                        <th className="px-6 py-4">Offre visée</th>
                        <th className="px-6 py-4">Date de dépôt</th>
                        <th className="px-6 py-4">Statut</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {filteredApps.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-bold text-slate-900">{app.candidateFullName}</p>
                              <p className="text-xs text-slate-400 font-semibold">{app.candidateEmail}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-semibold text-slate-700">
                            {app.jobTitle}
                          </td>
                          <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                            {new Date(app.datePostulation).toLocaleDateString("fr-FR")}
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(app.status)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => loadCandidateDetails(app.candidateId, app.id)}
                              className="text-brand-blue-600 hover:text-brand-blue-800 text-xs font-bold inline-flex items-center gap-0.5 cursor-pointer"
                            >
                              Examiner <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* VIEW 5: CREATE AN OFFER */}
            {activeTab === "create-offer" && (
              <div className="max-w-2xl bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4 mb-2 space-y-1">
                  <h1 className="text-xl font-extrabold font-display text-slate-900">Publier une nouvelle offre</h1>
                  <p className="text-xs text-slate-500">Remplissez le formulaire ci-dessous pour rendre l'offre immédiatement accessible aux candidats.</p>
                </div>

                <form onSubmit={handleCreateOffer} className="space-y-5 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Intitulé du poste <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Ex: Développeur Cloud GCP / Java Specialist"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Division / Département</label>
                      <select
                        value={newDept}
                        onChange={(e) => setNewDept(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      >
                        <option>Informatique</option>
                        <option>Ressources Humaines</option>
                        <option>Finance</option>
                        <option>Marketing</option>
                        <option>Industrie</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Date limite des candidatures</label>
                      <input
                        type="date"
                        value={newLimitDate}
                        onChange={(e) => setNewLimitDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Compétences clés requises (séparées par une virgule) <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={newReqSkills}
                      onChange={(e) => setNewReqSkills(e.target.value)}
                      placeholder="Java 17, Spring Boot, React, Docker, CI/CD"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Description complète du poste & Missions <span className="text-rose-500">*</span></label>
                    <textarea
                      required
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="Détaillez le rôle de la future recrue, les responsabilités au sein de l'équipe et les missions quotidiennes chez RIF..."
                      rows={6}
                      className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingOffer}
                      className="px-6 py-3 bg-brand-blue-700 hover:bg-brand-blue-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                    >
                      {submittingOffer ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Publication...
                        </>
                      ) : (
                        "Publier l'offre"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* VIEW 6: DETAILED CANDIDATE PROFILE SHEET + CV VIEWER + STATUS CONTROLS */}
            {activeTab === "candidate-details" && selectedCandidate && selectedAppId && (
              <div className="space-y-8">
                <button
                  onClick={() => setActiveTab("applications")}
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  ← Retour à la liste globale
                </button>

                {/* Status controllers directly linked to specific application */}
                {(() => {
                  const currentApp = applications.find((a) => a.id === selectedAppId);
                  if (!currentApp) return null;

                  return (
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Traitement de la candidature</span>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900">{currentApp.jobTitle}</h3>
                          {getStatusBadge(currentApp.status)}
                        </div>
                      </div>

                      {/* Status changing actions */}
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => triggerStatusChange(currentApp.id, "EN_COURS")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${currentApp.status === "EN_COURS" ? "bg-blue-600 text-white border-blue-600" : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"}`}
                        >
                          Mettre En cours
                        </button>
                        <button
                          onClick={() => triggerStatusChange(currentApp.id, "ACCEPTE")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${currentApp.status === "ACCEPTE" ? "bg-emerald-600 text-white border-emerald-600" : "bg-white hover:bg-slate-50 text-emerald-700 border-slate-200"}`}
                        >
                          Accepter
                        </button>
                        <button
                          onClick={() => triggerStatusChange(currentApp.id, "REFUSE")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${currentApp.status === "REFUSE" ? "bg-rose-600 text-white border-rose-600" : "bg-white hover:bg-slate-50 text-rose-700 border-slate-200"}`}
                        >
                          Refuser
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* Candidate detailed sheets columns */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Form Info Sheet */}
                  <div className="lg:col-span-6 space-y-6">
                    
                    {/* Sheet 1: Personal Details */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                      <h3 className="font-bold text-slate-900 text-sm font-display border-b border-slate-100 pb-2">Informations personnelles</h3>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <p className="text-slate-400">Nom complet</p>
                          <p className="font-semibold text-slate-800">{selectedCandidate.name}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Date de naissance</p>
                          <p className="font-semibold text-slate-800">{selectedCandidate.birthDate ? new Date(selectedCandidate.birthDate).toLocaleDateString("fr-FR") : "Non spécifiée"}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Email</p>
                          <p className="font-semibold text-slate-800 select-all">{selectedCandidate.email}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Téléphone</p>
                          <p className="font-semibold text-slate-800 select-all">{selectedCandidate.phone || "Non spécifié"}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-slate-400">Adresse</p>
                          <p className="font-semibold text-slate-800">{selectedCandidate.address ? `${selectedCandidate.address}, ${selectedCandidate.postalCode || ""} ${selectedCandidate.city || ""}` : "Non spécifiée"}</p>
                        </div>
                        {selectedCandidate.linkedinUrl && (
                          <div className="col-span-2 pt-1">
                            <p className="text-slate-400">Profils Sociaux</p>
                            <div className="flex gap-4 mt-1">
                              <a href={selectedCandidate.linkedinUrl} target="_blank" rel="noreferrer" className="text-brand-blue-600 font-bold hover:underline">LinkedIn</a>
                              {selectedCandidate.githubUrl && <a href={selectedCandidate.githubUrl} target="_blank" rel="noreferrer" className="text-brand-blue-600 font-bold hover:underline">GitHub</a>}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Sheet 2: Education & Speciality */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                      <h3 className="font-bold text-slate-900 text-sm font-display border-b border-slate-100 pb-2">Parcours & Compétences</h3>
                      <div className="space-y-3.5 text-xs">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-slate-400">Niveau d'études</p>
                            <p className="font-semibold text-slate-800">{selectedCandidate.educationLevel || "Non spécifié"}</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Université / École</p>
                            <p className="font-semibold text-slate-800">{selectedCandidate.university || "Non spécifiée"}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-slate-400">Spécialité</p>
                          <p className="font-semibold text-slate-800">{selectedCandidate.specialite || "Non spécifiée"}</p>
                        </div>
                        {selectedCandidate.profileDescription && (
                          <div>
                            <p className="text-slate-400 mb-1">Résumé de carrière</p>
                            <p className="text-slate-600 leading-relaxed font-light bg-slate-50 p-2.5 rounded-lg">{selectedCandidate.profileDescription}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Sheet 3: Cover Letter motivations */}
                    {(() => {
                      const currentApp = applications.find((a) => a.id === selectedAppId);
                      if (!currentApp || !currentApp.lettreMotivation) return null;

                      return (
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                          <h3 className="font-bold text-slate-900 text-sm font-display border-b border-slate-100 pb-2">Lettre de motivation</h3>
                          <p className="text-xs text-slate-600 leading-relaxed font-light bg-slate-50 p-3 rounded-lg whitespace-pre-line">
                            {currentApp.lettreMotivation}
                          </p>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Right Column: PDF Viewer */}
                  <div className="lg:col-span-6 space-y-6">
                    {(() => {
                      const currentApp = applications.find((a) => a.id === selectedAppId);
                      if (!currentApp) return null;

                      return (
                        <div className="space-y-2 text-left">
                          <h3 className="font-display text-sm font-bold text-slate-900">Visualiseur CV PDF Intégré</h3>
                          <PDFViewer cvUrl={currentApp.cvUrl} fileName={currentApp.cvFilename} />
                        </div>
                      );
                    })()}
                  </div>

                </div>
              </div>
            )}

          </>
        )}
      </main>

      {/* CONFIRMATION SAFETY MODAL (Une confirmation doit être demandée avant toute modification de statut) */}
      {showConfirmModal && pendingStatus && updatingAppId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 text-left">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-900 font-display">Confirmer le changement de statut ?</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Êtes-vous sûr de vouloir passer cette candidature au statut : 
                  <span className="font-bold text-slate-900 block mt-1 uppercase">
                    {pendingStatus === "EN_COURS" && "En cours d'examen"}
                    {pendingStatus === "ACCEPTE" && "Acceptée (Planification d'entretien)"}
                    {pendingStatus === "REFUSE" && "Refusée (Fermer le dossier)"}
                  </span>
                </p>
                <p className="text-[10px] text-slate-400 italic pt-1">
                  Note : Cette action déclenchera automatiquement l'envoi d'un email de notification personnalisé au candidat.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 text-xs font-bold">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setUpdatingAppId(null);
                  setPendingStatus(null);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={executeStatusChange}
                className="px-4 py-2 bg-brand-blue-700 hover:bg-brand-blue-800 text-white rounded-lg cursor-pointer"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
