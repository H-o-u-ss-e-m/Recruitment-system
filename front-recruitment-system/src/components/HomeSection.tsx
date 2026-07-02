import React from "react";
import { ArrowRight, Users, Trophy, Lightbulb, Briefcase, GraduationCap, Globe, CheckCircle2, ChevronRight, Laptop, Cpu, Settings, Award } from "lucide-react";
import { motion } from "motion/react";

interface HomeSectionProps {
  onDiscoverOffers: () => void;
  onGoToAuth: () => void;  
}

export const HomeSection: React.FC<HomeSectionProps> = ({ onDiscoverOffers , onGoToAuth }) => {
  // Stagger animation container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const} },
  };

  const stats = [
    { value: "2018", label: "Création", desc: "Une entreprise digitale fondée en France" },
    { value: "2", label: "Pays", desc: "Présence en France et en Tunisie" },
    { value: "3", label: "Piliers", desc: "Conseil, développement et formation" },
  ];

  const benefits = [
    {
      title: "Conseil SI",
      desc: "Accompagnement sur l'analyse, la conception et l'évolution des systèmes d'information.",
      icon: Users,
      color: "bg-blue-50 text-brand-blue-600",
    },
    {
      title: "Solutions sur mesure",
      desc: "Développement de solutions logicielles adaptées aux besoins réels des clients.",
      icon: Lightbulb,
      color: "bg-amber-50 text-brand-gold-600",
    },
    {
      title: "Formation",
      desc: "Actions de formation professionnelle pour renforcer durablement les compétences.",
      icon: Trophy,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Accompagnement global",
      desc: "De l'étude des besoins à la mise en œuvre de solutions performantes.",
      icon: Globe,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Innovation",
      desc: "Des solutions informatiques innovantes et sur mesure parfaitement adaptées à vos besoins.",
      icon: GraduationCap,
      color: "bg-rose-50 text-rose-600",
    },
    {
      title: "Partenariat de confiance",
      desc: "Une approche orientée qualité, proximité et efficacité pour vos projets digitaux.",
      icon: Award,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  const sectors = [
    { name: "Informatique & Cloud", count: "12 offres", icon: Laptop },
    { name: "Industrie & Ingénierie", count: "6 offres", icon: Cpu },
    { name: "Ressources Humaines", count: "3 offres", icon: Users },
    { name: "Finance & Gestion", count: "4 offres", icon: Settings },
    { name: "Marketing & Digital", count: "3 offres", icon: Globe },
    { name: "Logistique & Transport", count: "4 offres", icon: Briefcase },
  ];

  const steps = [
    {
      num: "01",
      title: "Création du compte",
      desc: "Créez votre profil candidat en quelques clics et complétez vos informations de contact et réseaux.",
    },
    {
      num: "02",
      title: "Choisir une offre",
      desc: "Explorez nos catégories de métiers et filtrez les offres par type de contrat, ville ou mot-clé.",
    },
    {
      num: "03",
      title: "Déposer sa candidature",
      desc: "Postulez en téléversant votre CV PDF et en rédigeant votre lettre de motivation directement en ligne.",
    },
    {
      num: "04",
      title: "Étude du dossier",
      desc: "Nos recruteurs étudient votre profil avec la plus grande attention sous 48 à 72 heures ouvrées.",
    },
    {
      num: "05",
      title: "Entretien d'embauche",
      desc: "Échangez avec nos équipes RH et opérationnelles pour valider l'adéquation technique et culturelle.",
    },
    {
      num: "06",
      title: "Décision finale",
      desc: "Si votre candidature est retenue, vous recevez une proposition d'embauche et débutez votre onboarding.",
    },
  ];

  return (
    <div className="space-y-24 pb-16" id="home-section-container">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-blue-900 via-brand-blue-950 to-slate-950 text-white rounded-3xl mx-4 lg:mx-8 my-4 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.15),transparent_45%)]" />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
        
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-gold-500/10 border border-brand-gold-500/20 text-brand-gold-400 text-xs font-semibold uppercase tracking-wider">
              <span className="flex h-2 w-2 rounded-full bg-brand-gold-500 animate-pulse" />
              Vos besoins. Nos solutions.
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display leading-[1.1] text-white">
              Des solutions IT <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-400 to-amber-500">sur mesure</span> pour vos besoins.
            </h1>
            
            <p className="text-base sm:text-lg text-slate-300 font-light max-w-xl leading-relaxed">
              Nous créons des solutions informatiques innovantes et sur mesure, parfaitement adaptées à vos besoins. Conseil, développement et formation au service de vos projets.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onDiscoverOffers}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-brand-blue-950 bg-brand-gold-400 hover:bg-brand-gold-300 hover:scale-[1.02] shadow-lg shadow-brand-gold-500/20 transition-all duration-200 cursor-pointer text-sm"
              >
                Découvrir les offres
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href="#qui-sommes-nous"
                className="flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-sm"
              >
                Voir plus de détail
              </a>
            </div>
          </div>

          {/* Hero Right Graphic */}
          <div className="lg:col-span-5 relative hidden lg:block">
            <div className="absolute -inset-4 rounded-full bg-brand-gold-500/10 blur-3xl" />
            <div className="relative bg-slate-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500" />
                  <div className="h-3 w-3 rounded-full bg-amber-500" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
                </div>
                <span className="text-xs text-slate-500 font-mono">RIF-Portal v2.4.0</span>
              </div>
              
              <div className="space-y-4">
                <div className="bg-brand-blue-950/80 rounded-xl p-4 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-brand-gold-500/15 flex items-center justify-center text-brand-gold-400">
                      <Laptop className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-200">Ingénierie Logicielle</h4>
                      <p className="text-xs text-slate-400">Spring Boot / Angular / GCP</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-[10px] font-semibold uppercase">Actif</span>
                </div>

                <div className="bg-brand-blue-950/80 rounded-xl p-4 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-indigo-500/15 flex items-center justify-center text-indigo-400">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-200">Ressources Humaines</h4>
                      <p className="text-xs text-slate-400">Recrutement de talents tech</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-[10px] font-semibold uppercase">Actif</span>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Prochaine commission</span>
                  <span className="text-brand-gold-400 font-semibold">Aujourd'hui</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUI SOMMES-NOUS */}
      <section id="qui-sommes-nous" className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 relative">
          <div className="absolute -inset-3 bg-brand-gold-400/20 rounded-3xl blur-2xl opacity-70" />
          <div className="relative bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center">
                <img src="/logo-rif.jpg" alt="GroupRIF" className="h-full w-full object-contain" />
              </div>
              <div>
                <h3 className="font-bold text-lg font-display text-brand-blue-950">Groupe RIF</h3>
                <p className="text-xs text-slate-500">Partenaire de votre transformation</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed italic">
              "Nous créons des solutions informatiques innovantes et sur mesure, avec une approche fondée sur le conseil, l'étude et la formation."
            </p>
            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-2 text-brand-blue-600 font-semibold text-sm">
              <span>Visiter le site officiel</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 text-left space-y-6">
          <span className="text-xs font-bold text-brand-gold-600 tracking-wider uppercase">Qui Sommes-Nous</span>
          <h2 className="text-3xl font-extrabold font-display text-slate-900">
            Une entreprise digitale innovante fondée en 2018 en France.
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Le <strong>Groupe RIF</strong> est spécialisé dans la programmation informatique, le conseil en systèmes d'information, la conception et le développement de solutions logicielles sur mesure.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Nous accompagnons nos clients de l'analyse des besoins à la mise en œuvre de solutions performantes, en intégrant également la formation professionnelle pour assurer une montée en compétences durable.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-brand-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Proximité locale</h4>
                <p className="text-xs text-slate-500">Présence en France et en Tunisie pour un accompagnement de proximité.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-brand-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Solutions sur mesure</h4>
                <p className="text-xs text-slate-500">Des services adaptés aux besoins réels de chaque client.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATISTIQUES */}
      <section className="bg-slate-900 text-white py-16 rounded-3xl mx-4 lg:mx-8 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i} className="space-y-2 p-4">
              <div className="text-5xl font-extrabold font-display text-brand-gold-400">
                {stat.value}
              </div>
              <div className="text-lg font-semibold text-white">
                {stat.label}
              </div>
              <div className="text-xs text-slate-400">
                {stat.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY JOIN US */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-bold text-brand-gold-600 tracking-wider uppercase">Pourquoi RIF ?</span>
          <h2 className="text-3xl font-extrabold font-display text-slate-900">
            Pourquoi rejoindre le Groupe RIF ?
          </h2>
          <p className="text-slate-500 text-sm">
            Plus qu'un emploi, nous vous proposons de participer à une aventure humaine stimulante, entouré d'experts de haut niveau.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-white border border-slate-200/80 hover:border-brand-blue-300 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group text-left"
              >
                <div className="space-y-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${benefit.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-950 font-display group-hover:text-brand-blue-700 transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* SECTORS / METIERS */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-bold text-brand-gold-600 tracking-wider uppercase">Nos expertises</span>
          <h2 className="text-3xl font-extrabold font-display text-slate-900">
            Conseil, développement et formation
          </h2>
          <p className="text-slate-500 text-sm">
            Des solutions informatiques innovantes et sur mesure pour accompagner vos transformations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sectors.map((sector, i) => {
            const Icon = sector.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:bg-slate-50 hover:border-slate-200 transition-all text-left group"
              >
                <div className="h-12 w-12 rounded-xl bg-slate-100 group-hover:bg-brand-blue-50 flex items-center justify-center text-slate-600 group-hover:text-brand-blue-600 transition-colors shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-base">{sector.name}</h4>
                  <p className="text-xs text-slate-400">{sector.count}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* PROCESS RECRUTEMENT */}
      <section className="bg-slate-50 border border-slate-200/50 py-20 rounded-3xl mx-4 lg:mx-8">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-bold text-brand-gold-600 tracking-wider uppercase">Transparence</span>
            <h2 className="text-3xl font-extrabold font-display text-slate-900">
              Notre démarche d'accompagnement
            </h2>
            <p className="text-slate-500 text-sm">
              Une approche claire, réactive et structurée, de l'étude du besoin à la mise en œuvre.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {steps.map((step, i) => (
              <div key={i} className="relative bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                <span className="absolute top-4 right-4 text-3xl font-extrabold font-mono text-slate-100 select-none">
                  {step.num}
                </span>
                <div className="space-y-3 z-10">
                  <h4 className="text-lg font-bold text-slate-900 font-display">
                    {step.title}
                  </h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="max-w-5xl mx-auto px-6 text-center">
        <div className="bg-gradient-to-r from-brand-blue-800 to-brand-blue-950 text-white rounded-3xl p-12 relative overflow-hidden shadow-2xl space-y-6">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
          <div className="absolute -top-12 -left-12 h-32 w-32 rounded-full bg-brand-gold-500/10 blur-xl" />
          
          <h2 className="text-3xl font-extrabold font-display text-white z-10 relative">
            Vous souhaitez collaborer avec GroupeRIF ?
          </h2>
          <p className="text-slate-300 max-w-lg mx-auto text-sm leading-relaxed font-light z-10 relative">
            Contactez-nous pour explorer de nouvelles opportunités et construire des solutions adaptées à vos besoins.
          </p>
          <div className="pt-4 z-10 relative">
            <button
              onClick={onDiscoverOffers}
              className="px-8 py-3.5 bg-brand-gold-400 hover:bg-brand-gold-300 text-brand-blue-950 font-bold rounded-xl shadow-lg hover:scale-[1.01] transition-all cursor-pointer text-sm"
            >
              Voir plus de détail
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
