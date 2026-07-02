import React, { useState } from "react";
import { Mail, Lock, User as UserIcon, Phone, Calendar, Globe, MapPin, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "./Toast";
import { AuthResponse } from "../types";
import { apiFetch } from "../lib/api";

interface AuthPagesProps {
  view: "login" | "register" | "forgot";
  setView: (view: "login" | "register" | "forgot") => void;
  onAuthSuccess: (authData: AuthResponse) => void;
}

export const AuthPages: React.FC<AuthPagesProps> = ({ view, setView, onAuthSuccess }) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Login form state
  const [login, setLogin] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regBirthDate, setRegBirthDate] = useState("");
  const [regGender, setRegGender] = useState("Homme");
  const [regNationality, setRegNationality] = useState("Française");
  const [regAddress, setRegAddress] = useState("");
  const [regPostalCode, setRegPostalCode] = useState("");
  const [regEducation, setRegEducation] = useState("Master");
  const [regUniversity, setRegUniversity] = useState("");
  const [regSpeciality, setRegSpeciality] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Forgot Password state
  const [forgotEmail, setForgotEmail] = useState("");

  // Handle Login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiFetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login,
          password: loginPassword,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Identifiants invalides.");
      }

      const authData: AuthResponse = await response.json();
      showToast(`Ravi de vous revoir, ${authData.name} !`, "success");
      onAuthSuccess(authData);
    } catch (err: any) {
      showToast(err.message || "Échec de la connexion.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Quick helper to fill credentials (super convenient for user/tester review)
  const quickFill = (role: "CANDIDATE" | "RECRUITER") => {
    if (role === "CANDIDATE") {
      setLogin("Ahmed");
      setLoginPassword("123456");
    } else {
      setLogin("rhadmin");
      setLoginPassword("rhadmin");
    }
    showToast(`Identifiants de test ${role} insérés !`, "info");
  };

  const quickFillHoussem = () => {
    setLogin("Houssem");
    setLoginPassword("password");
    showToast("Identifiants de test Houssem insérés !", "info");
  };

  // Handle Register submission
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!regFirstName || !regLastName || !regEmail || !regPassword || !regConfirmPassword) {
      showToast("Veuillez remplir les champs obligatoires.", "error");
      return;
    }

    if (regPassword !== regConfirmPassword) {
      showToast("Les mots de passe ne correspondent pas.", "error");
      return;
    }

    if (!acceptTerms) {
      showToast("Vous devez accepter les conditions générales.", "warning");
      return;
    }

    setLoading(true);
    try {
      // 1. Register candidate
      const regResponse = await apiFetch("/api/candidates/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: regFirstName,
          lastName: regLastName,
          email: regEmail,
          password: regPassword,
          phone: regPhone,
          birthDate: regBirthDate || undefined,
          gender: regGender,
          nationality: regNationality,
          address: regAddress,
          postalCode: regPostalCode,
          educationLevel: regEducation,
          university: regUniversity,
          specialite: regSpeciality,
        }),
      });

      if (!regResponse.ok) {
        const errData = await regResponse.json();
        throw new Error(errData.message || "Échec de l'enregistrement.");
      }

      showToast("Compte créé avec succès ! Connexion en cours...", "success");

      // 2. Automatically log in after registration
      const loginResponse = await apiFetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login: regEmail,
          password: regPassword,
        }),
      });

      if (!loginResponse.ok) {
        throw new Error("Compte créé mais la connexion automatique a échoué.");
      }

      const authData: AuthResponse = await loginResponse.json();
      onAuthSuccess(authData);
    } catch (err: any) {
      showToast(err.message || "Une erreur est survenue lors de l'inscription.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password simulation
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      showToast("Veuillez saisir votre adresse email.", "error");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast("Si cet email existe, un lien de réinitialisation vous a été envoyé.", "success");
      setView("login");
    }, 1200);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12" id="auth-container">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-xl space-y-6">
        
        {/* VIEW 1: LOGIN */}
        {view === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-6 text-left">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-extrabold font-display text-slate-900">Espace Connexion</h2>
              <p className="text-sm text-slate-500">Accédez à vos candidatures ou gérez vos offres</p>
            </div>

            {/* QUICK LOGINS INSTRUCTIONS FOR CONVENIENCE */}
            <div className="bg-slate-50 border border-slate-200/60 p-3.5 rounded-2xl space-y-2.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Mode démo rapide :</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => quickFill("CANDIDATE")}
                  className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
                >
                  Compte Candidat
                </button>
                
                <button
                  type="button"
                  onClick={() => quickFill("RECRUITER")}
                  className="px-2.5 py-1.5 text-xs font-semibold text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 transition-all cursor-pointer"
                >
                  Compte Recruteur (RH)
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Identifiant</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    placeholder="Identifiant"
                    autoComplete="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    name="login-identifier"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-blue-500/20 focus:border-brand-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">Mot de passe</label>
                  <button
                    type="button"
                    onClick={() => setView("forgot")}
                    className="text-xs font-semibold text-brand-blue-600 hover:text-brand-blue-700 hover:underline"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    name="login-secret"
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-blue-500/20 focus:border-brand-blue-500 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-brand-blue-700 hover:bg-brand-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-500 flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                "Se connecter"
              )}
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-500">Nouveau sur notre portail ? </span>
              <button
                type="button"
                onClick={() => setView("register")}
                className="text-xs font-bold text-brand-blue-600 hover:text-brand-blue-700 hover:underline"
              >
                Créer un compte
              </button>
            </div>
          </form>
        )}

        {/* VIEW 2: REGISTER */}
        {view === "register" && (
          <form onSubmit={handleRegisterSubmit} className="space-y-6 text-left max-h-[75vh] overflow-y-auto pr-1">
            <div className="text-center space-y-2 pb-2 border-b border-slate-100">
              <h2 className="text-2xl font-extrabold font-display text-slate-900">Nouveau candidat</h2>
              <p className="text-sm text-slate-500">Créez votre profil de recrutement en 2 minutes</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Identifiants de connexion</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Prénom <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={regFirstName}
                    onChange={(e) => setRegFirstName(e.target.value)}
                    placeholder="Jean"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Nom <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={regLastName}
                    onChange={(e) => setRegLastName(e.target.value)}
                    placeholder="Dupont"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Adresse email <span className="text-rose-500">*</span></label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="jean.dupont@example.com"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Mot de passe <span className="text-rose-500">*</span></label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Confirmation <span className="text-rose-500">*</span></label>
                  <input
                    type="password"
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              <hr className="border-slate-100" />
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Informations personnelles</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Téléphone</label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+33 6 12 34 56 78"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Date de naissance</label>
                  <input
                    type="date"
                    value={regBirthDate}
                    onChange={(e) => setRegBirthDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Genre</label>
                  <select
                    value={regGender}
                    onChange={(e) => setRegGender(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none transition-all"
                  >
                    <option>Homme</option>
                    <option>Femme</option>
                    <option>Autre</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Nationalité</label>
                  <input
                    type="text"
                    value={regNationality}
                    onChange={(e) => setRegNationality(e.target.value)}
                    placeholder="Française"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Adresse</label>
                  <input
                    type="text"
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    placeholder="12 Avenue des Champs"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Code postal</label>
                  <input
                    type="text"
                    value={regPostalCode}
                    onChange={(e) => setRegPostalCode(e.target.value)}
                    placeholder="75001"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              <hr className="border-slate-100" />
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Formation & Diplômes</h3>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Niveau d'études</label>
                <select
                  value={regEducation}
                  onChange={(e) => setRegEducation(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none transition-all"
                >
                  <option>Bac +2</option>
                  <option>Licence</option>
                  <option>Master</option>
                  <option>Ingénieur</option>
                  <option>Doctorat</option>
                  <option>Autre</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Université / École</label>
                  <input
                    type="text"
                    value={regUniversity}
                    onChange={(e) => setRegUniversity(e.target.value)}
                    placeholder="Sorbonne, INSA..."
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Spécialité</label>
                  <input
                    type="text"
                    value={regSpeciality}
                    onChange={(e) => setRegSpeciality(e.target.value)}
                    placeholder="Informatique, RH..."
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-2">
                <input
                  type="checkbox"
                  id="accept-terms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 text-brand-blue-600 border-slate-300 rounded focus:ring-brand-blue-500 cursor-pointer"
                />
                <label htmlFor="accept-terms" className="text-xs text-slate-500 select-none leading-relaxed">
                  J'accepte les conditions générales d'utilisation et autorise le Groupe RIF à traiter mes données dans le cadre de ma recherche d'emploi ou de stage.
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-brand-blue-700 hover:bg-brand-blue-800 flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Création de compte...
                </>
              ) : (
                "S'enregistrer"
              )}
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-500">Déjà inscrit ? </span>
              <button
                type="button"
                onClick={() => setView("login")}
                className="text-xs font-bold text-brand-blue-600 hover:text-brand-blue-700 hover:underline"
              >
                Se connecter
              </button>
            </div>
          </form>
        )}

        {/* VIEW 3: FORGOT PASSWORD */}
        {view === "forgot" && (
          <form onSubmit={handleForgotSubmit} className="space-y-6 text-left">
            <button
              type="button"
              onClick={() => setView("login")}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-700"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Retour à la connexion
            </button>

            <div className="text-center space-y-2">
              <h2 className="text-2xl font-extrabold font-display text-slate-900">Mot de passe oublié</h2>
              <p className="text-sm text-slate-500">Saisissez l'adresse de votre compte candidat ou recruteur pour recevoir un lien.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Adresse email du compte</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="exemple@grouperif.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-brand-blue-700 hover:bg-brand-blue-800 flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Envoi...
                </>
              ) : (
                "Réinitialiser le mot de passe"
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
