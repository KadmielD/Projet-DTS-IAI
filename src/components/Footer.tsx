import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { Icons } from "./icons";
import { Badge, Button } from "./ui";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="border-t border-border/80 bg-surface text-foreground antialiased">
      {/* Top Newsletter & Agronomic Bulletin Strip */}
      <div className="border-b border-border/70 bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 py-12 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="space-y-2 max-w-xl text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md text-emerald-300">
                <Icons.Sparkles className="w-3.5 h-3.5" />
                <span>Bulletin Agronomique & Alertes Climatiques</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Restez informé des alertes régionales et avancées IA
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
                Rejoignez plus de 1 400 agronomes, exploitants et coopératives. Recevez chaque semaine les prévisions météo locales et les alertes bio-agresseurs.
              </p>
            </div>

            <div className="w-full max-w-md">
              {subscribed ? (
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-400/40 bg-emerald-800/80 p-4 text-xs font-semibold text-emerald-200 backdrop-blur-md">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
                    <Icons.Check className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Merci pour votre inscription !</p>
                    <p className="text-[11px] text-emerald-200/90 mt-0.5">
                      Vous recevrez le prochain bulletin agronomique du Nord-Ouest dans votre boîte mail.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="agronome@exploitation.cm"
                      required
                      className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-emerald-200/60 outline-none backdrop-blur-md focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                    />
                    <Button
                      type="submit"
                      size="md"
                      className="bg-emerald-500 text-emerald-950 hover:bg-emerald-400 font-bold border-0 shrink-0"
                    >
                      S&apos;abonner
                    </Button>
                  </div>
                  <p className="text-[10px] text-emerald-200/70 text-left flex items-center gap-1.5">
                    <Icons.ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Données foncières protégées. Désabonnement en 1 clic à tout moment.</span>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main 4-Column Footer */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-12 text-left">
          {/* Brand Info & Mission */}
          <div className="lg:col-span-4 space-y-5">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="AgriIntelli" className="h-10 w-10 object-contain drop-shadow-sm" />
              <div>
                <p className="text-lg font-bold leading-none tracking-tight">
                  <span className="text-emerald-800">Agri</span>
                  <span className="text-sky-600">Intelli</span>
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-800/70 mt-0.5">
                  Intelligence Agronomique
                </p>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-sm">
              Plateforme agrotechnologique d&apos;avant-garde unissant la vision par ordinateur, la biochimie des sols NPK et l&apos;intelligence artificielle prédictive pour décupler la souveraineté alimentaire et la rentabilité agricole.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Badge tone="success" dot>Normes FAO</Badge>
              <Badge tone="info">GlobalGAP Ready</Badge>
              <Badge tone="neutral">Chiffrement AES-256</Badge>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3 pt-2 text-muted">
              {[
                { label: "LinkedIn", href: "https://linkedin.com" },
                { label: "X / Twitter", href: "https://twitter.com" },
                { label: "GitHub", href: "https://github.com" },
                { label: "YouTube Agronomie", href: "https://youtube.com" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/80 bg-surface-subtle/50 text-xs font-bold text-muted hover:border-emerald-600/40 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                  title={s.label}
                >
                  {s.label[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Links Column 1: Moteurs d'IA */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-b border-border/60 pb-2 flex items-center gap-2">
              <Icons.Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>Moteurs d&apos;Intelligence IA</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-muted">
              <li>
                <Link to="/app/diagnostic" className="hover:text-emerald-800 transition-colors flex items-center gap-1.5">
                  <Icons.ChevronRight className="w-3 h-3 text-emerald-600" />
                  <span>Diagnostic Phytosanitaire Vision</span>
                </Link>
              </li>
              <li>
                <Link to="/app/analyse-sol" className="hover:text-emerald-800 transition-colors flex items-center gap-1.5">
                  <Icons.ChevronRight className="w-3 h-3 text-emerald-600" />
                  <span>Analyse & Chimie des Sols NPK</span>
                </Link>
              </li>
              <li>
                <Link to="/app/predictions" className="hover:text-emerald-800 transition-colors flex items-center gap-1.5">
                  <Icons.ChevronRight className="w-3 h-3 text-emerald-600" />
                  <span>Prédictions de Rendements ML</span>
                </Link>
              </li>
              <li>
                <Link to="/app/planification" className="hover:text-emerald-800 transition-colors flex items-center gap-1.5">
                  <Icons.ChevronRight className="w-3 h-3 text-emerald-600" />
                  <span>Modélisation Météo Open-Meteo</span>
                </Link>
              </li>
              <li>
                <a href="#fonctionnalites" className="hover:text-emerald-800 transition-colors flex items-center gap-1.5">
                  <Icons.ChevronRight className="w-3 h-3 text-emerald-600" />
                  <span>Télédétection & Cartographie NDVI</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Links Column 2: Outils & Terrain */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-b border-border/60 pb-2 flex items-center gap-2">
              <Icons.Farm className="w-3.5 h-3.5 text-emerald-700" />
              <span>Gestion Terrain</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-muted">
              <li>
                <Link to="/app/exploitations" className="hover:text-emerald-800 transition-colors flex items-center gap-1.5">
                  <Icons.ChevronRight className="w-3 h-3 text-emerald-600" />
                  <span>Gestion des Parcelles</span>
                </Link>
              </li>
              <li>
                <Link to="/app/cultures" className="hover:text-emerald-800 transition-colors flex items-center gap-1.5">
                  <Icons.ChevronRight className="w-3 h-3 text-emerald-600" />
                  <span>Suivi Phénologique</span>
                </Link>
              </li>
              <li>
                <Link to="/app/historique" className="hover:text-emerald-800 transition-colors flex items-center gap-1.5">
                  <Icons.ChevronRight className="w-3 h-3 text-emerald-600" />
                  <span>Journal de Traçabilité</span>
                </Link>
              </li>
              <li>
                <Link to="/app/notifications" className="hover:text-emerald-800 transition-colors flex items-center gap-1.5">
                  <Icons.ChevronRight className="w-3 h-3 text-emerald-600" />
                  <span>Alertes Ravageurs</span>
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-emerald-800 transition-colors flex items-center gap-1.5">
                  <Icons.ChevronRight className="w-3 h-3 text-emerald-600" />
                  <span>Cockpit Administrateur</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 3: Recherche & Partenariats */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-b border-border/60 pb-2 flex items-center gap-2">
              <Icons.Sprout className="w-3.5 h-3.5 text-emerald-700" />
              <span>Partenaires & Recherche</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-muted">
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                <span>Coopérative Céréalière de Ndop</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                <span>Institut de Recherche Agricole (IRAD)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                <span>Faculté d&apos;Agronomie (FASA Dschang)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                <span>MINADER — Appui Filières Vivrières</span>
              </li>
            </ul>

            <div className="pt-2">
              <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/60 p-3 text-[11px] text-emerald-950">
                <p className="font-bold flex items-center gap-1.5">
                  <Icons.ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Livre Blanc 2026</span>
                </p>
                <p className="text-emerald-800/90 mt-0.5">
                  &laquo; IA & Résilience Agronomique face aux aléas pluviaux &raquo;
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Live System Operational Status Badge */}
        <div className="mt-12 rounded-2xl border border-border/70 bg-surface-subtle/60 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <span className="font-bold text-foreground">
              Tous les moteurs d&apos;inférence sont opérationnels
            </span>
            <span className="text-muted hidden md:inline">
              · Modèles Vision Convolutionnelle & ML v2.4 Actifs
            </span>
          </div>

          <div className="flex items-center gap-4 text-muted">
            <span>Disponibilité : <strong className="text-foreground">99.98%</strong></span>
            <span>Latence moyenne : <strong className="text-emerald-700">&lt; 120ms</strong></span>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="mt-8 border-t border-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>
            &copy; {new Date().getFullYear()} AgriIntelli Inc. Tous droits réservés. Développé pour une agriculture durable.
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <a href="#accueil" className="hover:text-emerald-800 transition-colors">
              Haut de page ↑
            </a>
            <a href="#apropos" className="hover:text-emerald-800 transition-colors">
              Politique de Confidentialité Foncière
            </a>
            <a href="#fonctionnalites" className="hover:text-emerald-800 transition-colors">
              Conditions Générales d&apos;Usage
            </a>
            <Link to="/admin" className="hover:text-emerald-800 transition-colors font-semibold">
              Espace Administrateur
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
