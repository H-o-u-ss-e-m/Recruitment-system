import React, { useState, useEffect } from "react";
import { ToastProvider, useToast } from "./components/Toast";
import { HomeSection } from "./components/HomeSection";
import { OffersList } from "./components/OffersList";
import { OfferDetails } from "./components/OfferDetails";
import { AuthPages } from "./components/AuthPages";
import { MyApplications } from "./components/MyApplications";
import { RecruiterDashboard } from "./components/RecruiterDashboard";
import { AuthResponse, JobOfferResponse } from "./types";
import { apiFetch } from "./lib/api";
import { Briefcase, User, LogOut, LayoutDashboard, Menu, X, ArrowUpRight, ShieldCheck, Mail, Phone, MapPin } from "lucide-react";

export function MainAppContent() {
  const { showToast } = useToast();
  const [currentUser, setCurrentUser] = useState<AuthResponse | null>(null);
  const [currentView, setCurrentView] = useState<
    "home" | "offers" | "offer-detail" | "login" | "register" | "forgot-password" | "candidate-portal" | "recruiter-portal"
  >("home");
  
  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Selected job for detail view
  const [selectedOffer, setSelectedOffer] = useState<JobOfferResponse | null>(null);

  const privateViews = new Set<[typeof currentView][number]>(["candidate-portal", "recruiter-portal"]);

  // Job offers state
  const [offers, setOffers] = useState<JobOfferResponse[]>([]);
  const [loadingOffers, setLoadingOffers] = useState(false);

  // Fetch job offers on view change to ensure up-to-date listings
  useEffect(() => {
    setLoadingOffers(true);
    apiFetch("/api/job-offers/open")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load offers");
        return res.json();
      })
      .then((data) => {
        setOffers(data);
      })
      .catch((err) => {
        console.error("Error loading offers:", err);
      })
      .finally(() => {
        setLoadingOffers(false);
      });
  }, [currentView]);

  // Synchronize authentication on mount
  useEffect(() => {
    if (sessionStorage.getItem("rif-authenticated") !== "true") {
      return;
    }

    apiFetch("/api/auth/me")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("No active session");
      })
      .then((user: AuthResponse) => {
        setCurrentUser(user);
        if (user.role === "RECRUITER") {
          setCurrentView("recruiter-portal");
        }
      })
      .catch(() => {
        sessionStorage.removeItem("rif-authenticated");
      });
  }, []);

  const canAccessView = (view: typeof currentView) => {
    if (view === "candidate-portal") {
      return currentUser?.role === "CANDIDATE";
    }

    if (view === "recruiter-portal") {
      return currentUser?.role === "RECRUITER";
    }

    return true;
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
      sessionStorage.removeItem("rif-authenticated");
      setCurrentUser(null);
      setCurrentView("home");
      showToast("Vous avez été déconnecté avec succès.", "info");
    } catch (err) {
      showToast("Erreur lors de la déconnexion.", "error");
    }
  };

  // Nav helper
  const navigateTo = (view: typeof currentView) => {
    if (privateViews.has(view) && !canAccessView(view)) {
      showToast("Accès refusé. Veuillez vous connecter avec le bon compte.", "warning");
      setCurrentView("login");
      return;
    }

    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Select job offer handler
  const handleSelectOffer = (idOrOffer: number | JobOfferResponse) => {
    if (typeof idOrOffer === "number") {
      const found = offers.find((o) => o.id === idOrOffer);
      if (found) {
        setSelectedOffer(found);
        setCurrentView("offer-detail");
      }
    } else {
      setSelectedOffer(idOrOffer);
      setCurrentView("offer-detail");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800" id="main-app-scaffolding">
      
      {/* PROFESSIONAL NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateTo("home")}>
            <div className="h-11 w-11 rounded-xl bg-white border border-slate-200 shadow-sm shrink-0 overflow-hidden">
              <img src="/logo-rif.jpg" alt="GroupRIF" className="h-full w-full object-contain" />
            </div>
            <div>
              <span className="text-brand-blue-900 font-extrabold text-lg tracking-tight font-display block">RIF</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block -mt-1">Recrutement</span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          {currentUser?.role !== "RECRUITER" && (
            <nav className="hidden md:flex items-center gap-7 text-xs font-bold uppercase tracking-wider text-slate-500">
              <button
                onClick={() => navigateTo("home")}
                className={`hover:text-brand-blue-800 transition-colors cursor-pointer ${currentView === "home" ? "text-brand-blue-800 border-b-2 border-brand-blue-800 pb-1" : ""}`}
              >
                Accueil
              </button>
              <button
                onClick={() => navigateTo("offers")}
                className={`hover:text-brand-blue-800 transition-colors cursor-pointer ${currentView === "offers" || currentView === "offer-detail" ? "text-brand-blue-800 border-b-2 border-brand-blue-800 pb-1" : ""}`}
              >
                Offres d'emploi
              </button>
            </nav>
          )}

          {/* Desktop Authentication & Action buttons */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                {currentUser.role === "CANDIDATE" ? (
                  <button
                    onClick={() => navigateTo("candidate-portal")}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${currentView === "candidate-portal" ? "bg-brand-blue-800 text-white" : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"}`}
                  >
                    <User className="h-4 w-4" />
                    Mon Espace
                  </button>
                ) : (
                  <button
                    onClick={() => navigateTo("recruiter-portal")}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${currentView === "recruiter-portal" ? "bg-brand-blue-800 text-white" : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"}`}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Espace RH
                  </button>
                )}
                
                <button
                  onClick={handleLogout}
                  className="px-3.5 py-2.5 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-all cursor-pointer text-xs font-bold"
                  title="Déconnexion"
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateTo("login")}
                  className="px-4 py-2.5 text-slate-600 hover:text-brand-blue-800 font-bold text-xs cursor-pointer"
                >
                  Connexion
                </button>
                <button
                  onClick={() => navigateTo("register")}
                  className="px-4 py-2.5 bg-brand-blue-700 hover:bg-brand-blue-800 text-white font-bold rounded-xl text-xs shadow-sm transition-all cursor-pointer"
                >
                  Créer un compte
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-6 space-y-4 shadow-lg animate-slide-down">
            {currentUser?.role !== "RECRUITER" && (
              <div className="flex flex-col gap-3 font-semibold text-sm">
                <button
                  onClick={() => navigateTo("home")}
                  className={`text-left py-2 ${currentView === "home" ? "text-brand-blue-800 font-bold" : "text-slate-500"}`}
                >
                  Accueil
                </button>
                <button
                  onClick={() => navigateTo("offers")}
                  className={`text-left py-2 ${currentView === "offers" ? "text-brand-blue-800 font-bold" : "text-slate-500"}`}
                >
                  Offres d'emploi
                </button>
              </div>
            )}

            <hr className="border-slate-100" />

            <div className="flex flex-col gap-2">
              {currentUser ? (
                <>
                  {currentUser.role === "CANDIDATE" ? (
                    <button
                      onClick={() => navigateTo("candidate-portal")}
                      className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
                    >
                      <User className="h-4 w-4" /> Mon Espace Candidat
                    </button>
                  ) : (
                    <button
                      onClick={() => navigateTo("recruiter-portal")}
                      className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
                    >
                      <LayoutDashboard className="h-4 w-4" /> Espace RH Recruteur
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="h-4 w-4" /> Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigateTo("login")}
                    className="w-full py-2.5 text-center text-slate-700 font-bold text-xs rounded-xl border border-slate-200"
                  >
                    Connexion
                  </button>
                  <button
                    onClick={() => navigateTo("register")}
                    className="w-full py-2.5 bg-brand-blue-700 text-white font-bold text-xs rounded-xl text-center"
                  >
                    Créer un compte
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* RENDER DYNAMIC CONTENT BASED ON PATH VIEW STATE */}
      <main className="flex-grow">
        {(() => {
          switch (currentView) {
            case "home":
              return (
                <HomeSection
                  onDiscoverOffers={() => navigateTo("offers")}
                  onGoToAuth={() => navigateTo("register")}
                />
              );
            case "offers":
              return (
                <OffersList
                  offers={offers}
                  onSelectOffer={handleSelectOffer}
                  isLoading={loadingOffers}
                />
              );
            case "offer-detail":
              return selectedOffer ? (
                <OfferDetails
                  offer={selectedOffer}
                  currentUser={currentUser}
                  onBack={() => navigateTo("offers")}
                  onGoToAuth={(view) => navigateTo(view)}
                  onApplicationSuccess={() => navigateTo("candidate-portal")}
                />
              ) : (
                <div className="py-24 text-center">Aucune offre sélectionnée.</div>
              );
            case "login":
            case "register":
            case "forgot-password":
              return (
                <AuthPages
                  view={currentView === "forgot-password" ? "forgot" : (currentView === "login" || currentView === "register" ? currentView : "login")}
                  setView={(view) => {
                    if (view === "forgot") setCurrentView("forgot-password");
                    else setCurrentView(view);
                  }}
                  onAuthSuccess={(user) => {
                    sessionStorage.setItem("rif-authenticated", "true");
                    setCurrentUser(user);
                    if (user.role === "RECRUITER") {
                      setCurrentView("recruiter-portal");
                    } else if (selectedOffer) {
                      setCurrentView("offer-detail");
                    } else {
                      setCurrentView("offers");
                    }
                  }}
                />
              );
            case "candidate-portal":
              return currentUser ? (
                <MyApplications
                  currentUser={currentUser}
                  onSelectOffer={() => navigateTo("offers")}
                />
              ) : null;
            case "recruiter-portal":
              return currentUser ? (
                <RecruiterDashboard
                  currentUser={currentUser}
                  onLogout={handleLogout}
                />
              ) : null;
            default:
              return <div className="py-24 text-center text-slate-400">Page non trouvée.</div>;
          }
        })()}
      </main>

      {/* FOOTER SECTION */}
      {currentView !== "recruiter-portal" && (
        <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-12 text-xs font-semibold">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 text-left">
            <div className="md:col-span-4 space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-white border border-slate-700 overflow-hidden">
                  <img src="/logo-rif.jpg" alt="GroupRIF" className="h-full w-full object-contain" />
                </div>
                  <span className="text-white font-bold text-sm tracking-tight font-display">GroupRIF</span>
              </div>
              <p className="text-slate-400 leading-relaxed font-light font-sans">
                  Conseil et étude des systèmes informatiques, conception, développement et formation pour des solutions sur mesure.
              </p>
            </div>

            <div className="md:col-span-4 space-y-4">
              <h4 className="text-white font-bold uppercase tracking-wider text-[10px]">Siège Social & Contact</h4>
              <ul className="space-y-2.5 font-light text-slate-400">
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-brand-gold-400 shrink-0" />
                    <span>2 B Rue Alfred Nobel, 77420 Champs-Sur-Marne, France</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-brand-gold-400 shrink-0" />
                    <span>contact@grouperif.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-brand-gold-400 shrink-0" />
                    <span>+33 6 51 94 88 73</span>
                </li>
              </ul>
            </div>

            <div className="md:col-span-4 space-y-4">
              <h4 className="text-white font-bold uppercase tracking-wider text-[10px]">Liens utiles</h4>
              <ul className="space-y-2.5 font-semibold text-slate-400">
                <li>
                  <a href="https://www.grouperif.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                      Accueil <ArrowUpRight className="h-3.5 w-3.5 text-brand-gold-400" />
                    </a>
                  </li>
                  <li>
                    <a href="https://www.grouperif.com/penny-grow-about-us/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                      Qui sommes nous <ArrowUpRight className="h-3.5 w-3.5 text-brand-gold-400" />
                    </a>
                  </li>
                  <li>
                    <a href="https://www.grouperif.com/penny-grow-services/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                      Services <ArrowUpRight className="h-3.5 w-3.5 text-brand-gold-400" />
                    </a>
                  </li>
                  <li>
                    <a href="https://www.grouperif.com/penny-grow-service-details/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                      Formations <ArrowUpRight className="h-3.5 w-3.5 text-brand-gold-400" />
                    </a>
                  </li>
                  <li>
                    <a href="https://www.grouperif.com/penny-grow-contact/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                      Contact <ArrowUpRight className="h-3.5 w-3.5 text-brand-gold-400" />
                  </a>
                </li>
                <li>
                  <button onClick={() => navigateTo("offers")} className="hover:text-white transition-colors cursor-pointer">
                      Consulter les offres
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo("login")} className="hover:text-white transition-colors cursor-pointer">
                      Espace RH
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800 mt-10 pt-6 text-center text-slate-500 font-light flex flex-col sm:flex-row sm:justify-between items-center gap-4">
            <p>© {new Date().getFullYear()} GroupRIF. Tous droits réservés.</p>
            <div className="flex gap-4">
              <span className="hover:text-slate-400 transition-colors">Mentions Légales</span>
              <span className="hover:text-slate-400 transition-colors">Politique de Confidentialité RGPD</span>
            </div>
          </div>
        </footer>
      )}

    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MainAppContent />
    </ToastProvider>
  );
}
