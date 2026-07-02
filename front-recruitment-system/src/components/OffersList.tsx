import React, { useState, useMemo } from "react";
import { Search, MapPin, Briefcase, Calendar, ChevronRight, SlidersHorizontal, ArrowUpDown, Filter, Building2, Tag } from "lucide-react";
import { motion } from "motion/react";
import { JobOfferResponse } from "../types";

interface OffersListProps {
  offers?: JobOfferResponse[];
  onSelectOffer: (id: number) => void;
  isLoading?: boolean;
}

export const OffersList: React.FC<OffersListProps> = ({ offers = [], onSelectOffer, isLoading = false }) => {
  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filters state
  const [selectedCity, setSelectedCity] = useState("Toutes");
  const [selectedContract, setSelectedContract] = useState("Tous");
  const [selectedDepartment, setSelectedDepartment] = useState("Tous");
  
  // Sort state
  const [sortBy, setSortBy] = useState<"date" | "title">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Dynamically extract unique values for filter dropdowns based on actual offers
  const uniqueCities = useMemo(() => {
    // Standardize locations from database descriptions
    const cities = new Set<string>();
    offers.forEach((o) => {
      if (o.descriptionPoste.includes("Lyon") || o.titrePoste.includes("Lyon")) {
        cities.add("Lyon");
      } else if (o.descriptionPoste.includes("Paris") || o.titrePoste.includes("Paris")) {
        cities.add("Paris");
      } else {
        cities.add("Paris"); // Default mock city
      }
    });
    return ["Toutes", "Paris", "Lyon", "Remote"];
  }, [offers]);

  const uniqueContracts = ["Tous", "CDI", "CDD", "Stage", "Alternance"];
  
  const uniqueDepartments = useMemo(() => {
    const depts = new Set<string>();
    offers.forEach((o) => {
      if (o.titrePoste.toLowerCase().includes("développeur") || o.titrePoste.toLowerCase().includes("système") || o.titrePoste.toLowerCase().includes("devops")) {
        depts.add("Informatique");
      } else if (o.titrePoste.toLowerCase().includes("recrutement") || o.titrePoste.toLowerCase().includes("rh")) {
        depts.add("Ressources Humaines");
      } else if (o.titrePoste.toLowerCase().includes("finance") || o.titrePoste.toLowerCase().includes("gestion")) {
        depts.add("Finance");
      } else {
        depts.add("Autre");
      }
    });
    return ["Tous", ...Array.from(depts)];
  }, [offers]);

  // Handle Filtering & Searching
  const filteredOffers = useMemo(() => {
    return offers
      .filter((offer) => {
        const matchesSearch =
          offer.titrePoste.toLowerCase().includes(searchTerm.toLowerCase()) ||
          offer.descriptionPoste.toLowerCase().includes(searchTerm.toLowerCase()) ||
          offer.competencesRequises.toLowerCase().includes(searchTerm.toLowerCase());

        // Get location helper
        const isLyon = offer.descriptionPoste.includes("Lyon") || offer.titrePoste.includes("Lyon");
        const location = isLyon ? "Lyon" : "Paris";

        const matchesCity =
          selectedCity === "Toutes" ||
          location.toLowerCase() === selectedCity.toLowerCase() ||
          (selectedCity === "Remote" && offer.descriptionPoste.toLowerCase().includes("remote"));

        // Get contract type helper
        let contractType = "CDI";
        if (offer.titrePoste.toLowerCase().includes("stage")) contractType = "Stage";
        else if (offer.titrePoste.toLowerCase().includes("alternance") || offer.titrePoste.toLowerCase().includes("stagiaire")) contractType = "Stage";
        else if (offer.titrePoste.toLowerCase().includes("chargé")) contractType = "CDD";

        const matchesContract =
          selectedContract === "Tous" || contractType.toLowerCase() === selectedContract.toLowerCase();

        // Get department helper
        let dept = "Autre";
        if (offer.titrePoste.toLowerCase().includes("développeur") || offer.titrePoste.toLowerCase().includes("système") || offer.titrePoste.toLowerCase().includes("devops")) {
          dept = "Informatique";
        } else if (offer.titrePoste.toLowerCase().includes("recrutement") || offer.titrePoste.toLowerCase().includes("rh")) {
          dept = "Ressources Humaines";
        } else if (offer.titrePoste.toLowerCase().includes("finance") || offer.titrePoste.toLowerCase().includes("gestion")) {
          dept = "Finance";
        }

        const matchesDept =
          selectedDepartment === "Tous" || dept.toLowerCase() === selectedDepartment.toLowerCase();

        return matchesSearch && matchesCity && matchesContract && matchesDept;
      })
      .sort((a, b) => {
        if (sortBy === "date") {
          const dateA = new Date(a.datePublication).getTime();
          const dateB = new Date(b.datePublication).getTime();
          return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        } else {
          return sortOrder === "asc"
            ? a.titrePoste.localeCompare(b.titrePoste)
            : b.titrePoste.localeCompare(a.titrePoste);
        }
      });
  }, [offers, searchTerm, selectedCity, selectedContract, selectedDepartment, sortBy, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 text-left" id="offers-list-container">
      {/* HEADER SECTION */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold font-display text-slate-900">Nos offres d'emploi</h1>
        <p className="text-sm text-slate-500">Explorez nos opportunités et rejoignez le Groupe RIF.</p>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par mot-clé (ex: Java, Spring, DevOps, RH...)"
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-blue-500/20 focus:border-brand-blue-500 outline-none text-sm transition-all"
          />
        </div>

        {/* Filters Selects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Ville filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-brand-blue-500" />
              Localisation
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-sm outline-none transition-colors"
            >
              {uniqueCities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Contrat filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 text-brand-blue-500" />
              Type de contrat
            </label>
            <select
              value={selectedContract}
              onChange={(e) => setSelectedContract(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-sm outline-none transition-colors"
            >
              {uniqueContracts.map((contract) => (
                <option key={contract} value={contract}>{contract}</option>
              ))}
            </select>
          </div>

          {/* Department filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-brand-blue-500" />
              Département
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-sm outline-none transition-colors"
            >
              {uniqueDepartments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Sort Controls */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
              <ArrowUpDown className="h-3.5 w-3.5 text-brand-blue-500" />
              Trier par
            </label>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "date" | "title")}
                className="flex-1 py-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-sm outline-none transition-colors"
              >
                <option value="date">Date de publication</option>
                <option value="title">Titre du poste</option>
              </select>
              <button
                type="button"
                onClick={toggleSortOrder}
                className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                title="Inverser l'ordre de tri"
              >
                <ArrowUpDown className="h-4 w-4 text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RESULTS COUNT */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
        <span>{filteredOffers.length} {filteredOffers.length > 1 ? "offres d'emploi trouvées" : "offre d'emploi trouvée"}</span>
        {(searchTerm || selectedCity !== "Toutes" || selectedContract !== "Tous" || selectedDepartment !== "Tous") && (
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCity("Toutes");
              setSelectedContract("Tous");
              setSelectedDepartment("Tous");
            }}
            className="text-brand-blue-600 hover:underline font-bold cursor-pointer"
          >
            Réinitialiser les filtres
          </button>
        )}
      </div>

      {/* OFFERS GRID / LIST */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="skeleton-offers-container">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4 animate-pulse">
              <div className="flex justify-between items-center">
                <div className="h-3 w-20 bg-slate-200 rounded-md"></div>
                <div className="h-5 w-14 bg-slate-200 rounded-full"></div>
              </div>
              <div className="h-6 w-3/4 bg-slate-200 rounded-md"></div>
              <div className="space-y-1.5 pt-1">
                <div className="h-3.5 w-1/2 bg-slate-200 rounded-md"></div>
                <div className="h-3.5 w-1/3 bg-slate-200 rounded-md"></div>
              </div>
              <div className="space-y-1.5 pt-1">
                <div className="h-3 w-full bg-slate-200 rounded-md"></div>
                <div className="h-3 w-5/6 bg-slate-200 rounded-md"></div>
              </div>
              <div className="pt-6 border-t border-slate-100 mt-6">
                <div className="h-10 w-full bg-slate-200 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredOffers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map((offer, index) => {
            // Extrapolate meta attributes for beautiful cards
            const isLyon = offer.descriptionPoste.includes("Lyon") || offer.titrePoste.includes("Lyon");
            const location = isLyon ? "Lyon, France" : "Paris, France";
            
            let contractType = "CDI";
            let contractBadge = "bg-blue-50 text-brand-blue-700 border-brand-blue-100";
            
            if (offer.titrePoste.toLowerCase().includes("stage") || offer.titrePoste.toLowerCase().includes("stagiaire") || offer.titrePoste.toLowerCase().includes("alternance")) {
              contractType = "Stage";
              contractBadge = "bg-amber-50 text-brand-gold-700 border-brand-gold-100";
            } else if (offer.titrePoste.toLowerCase().includes("chargé")) {
              contractType = "CDD";
              contractBadge = "bg-indigo-50 text-indigo-700 border-indigo-100";
            }

            // Excerpt snippet of job description
            const excerpt = offer.descriptionPoste.substring(0, 140) + "...";

            // Categorize department icon & badge
            let categoryLabel = "Informatique";
            if (offer.titrePoste.toLowerCase().includes("recrutement") || offer.titrePoste.toLowerCase().includes("rh")) {
              categoryLabel = "Ressources Humaines";
            } else if (offer.titrePoste.toLowerCase().includes("finance") || offer.titrePoste.toLowerCase().includes("gestion")) {
              categoryLabel = "Finance";
            }

            return (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
                className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-brand-blue-200 transition-all duration-200 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Category and Contract tags */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {categoryLabel}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${contractBadge}`}>
                      {contractType}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => onSelectOffer(offer.id)}
                    className="font-bold text-lg text-slate-900 group-hover:text-brand-blue-700 transition-colors cursor-pointer font-display leading-snug line-clamp-2"
                  >
                    {offer.titrePoste}
                  </h3>

                  {/* Metas */}
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500 font-medium pt-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span>{location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>Publié le {new Date(offer.datePublication).toLocaleDateString("fr-FR")}</span>
                    </div>
                  </div>

                  {/* Description snippet */}
                  <p className="text-slate-600 text-sm leading-relaxed font-light line-clamp-3">
                    {excerpt}
                  </p>
                </div>

                {/* View details button */}
                <div className="pt-6 border-t border-slate-50 mt-6">
                  <button
                    onClick={() => onSelectOffer(offer.id)}
                    className="w-full py-2.5 px-4 bg-slate-50 group-hover:bg-brand-blue-50 text-slate-700 group-hover:text-brand-blue-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-transparent group-hover:border-brand-blue-100"
                  >
                    Voir les détails
                    <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
          <Briefcase className="h-10 w-10 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800 font-display">Aucune offre ne correspond</h3>
          <p className="text-sm text-slate-500">
            Essayez de modifier vos filtres, de simplifier vos mots-clés de recherche, ou de réinitialiser les critères.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCity("Toutes");
              setSelectedContract("Tous");
              setSelectedDepartment("Tous");
            }}
            className="px-5 py-2 text-xs font-bold text-white bg-brand-blue-600 hover:bg-brand-blue-700 rounded-xl transition-colors cursor-pointer"
          >
            Réinitialiser tout
          </button>
        </div>
      )}
    </div>
  );
};
