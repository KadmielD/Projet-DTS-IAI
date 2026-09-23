import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { Button, Card, Badge } from "@/components/ui";
import { Icons } from "@/components/icons";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* Sticky Blur Header */}
      <header className="sticky top-0 z-50 border-b border-border/80 bg-surface/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-3">
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
          </div>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-foreground/80 md:flex">
            <a href="#accueil" className="transition-colors hover:text-emerald-700">
              Accueil
            </a>
            <a href="#fonctionnalites" className="transition-colors hover:text-emerald-700">
              Piliers Technologiques
            </a>
            <a href="#impact" className="transition-colors hover:text-emerald-700">
              Impact & Précision
            </a>
            <a href="#apropos" className="transition-colors hover:text-emerald-700">
              À Propos
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Se connecter
              </Button>
            </Link>
            <Link to="/app">
              <Button size="sm" icon={<Icons.Sparkles className="w-3.5 h-3.5" />}>
                Accès Direct Démo
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="accueil" className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Subtle Ambient Glow */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-full max-w-7xl opacity-50 bg-gradient-radial-subtle" />

        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/80 px-3.5 py-1 text-xs font-semibold text-emerald-800 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>IA Multimodale de Nouvelle Génération</span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.12]">
                Cultivez avec <span className="text-emerald-800">précision</span>. Décidez avec <span className="text-sky-600">certitude</span>.
              </h1>

              <p className="text-base text-muted sm:text-lg leading-relaxed max-w-xl">
                La plateforme agrotechnologique qui combine <strong>vision par ordinateur</strong>, <strong>analyse prédictive de sol NPK</strong> et <strong>modélisation climatique</strong> pour maximiser le rendement de vos parcelles.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link to="/app">
                  <Button size="lg" icon={<Icons.ArrowUpRight className="w-4 h-4" />}>
                    Lancer la démonstration
                  </Button>
                </Link>
                <a href="#fonctionnalites">
                  <Button variant="outline" size="lg">
                    Découvrir les modules
                  </Button>
                </a>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-border/70 flex flex-wrap items-center gap-6 text-xs text-muted font-medium">
                <span className="flex items-center gap-1.5">
                  <Icons.ShieldCheck className="w-4 h-4 text-emerald-700" />
                  Prêt pour l&apos;Afrique subsaharienne
                </span>
                <span className="flex items-center gap-1.5">
                  <Icons.Check className="w-4 h-4 text-emerald-700" />
                  Sans connexion obligatoire (mode terrain)
                </span>
              </div>
            </div>

            {/* Right Interactive Simulation Card */}
            <div className="lg:col-span-6">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                {/* Floating decorative elements */}
                <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-emerald-300/30 blur-2xl pointer-events-none" />
                <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-sky-300/30 blur-3xl pointer-events-none" />

                <div className="relative rounded-3xl border border-border/80 bg-surface/95 p-6 shadow-[0_12px_40px_-8px_rgba(6,95,70,0.12)] backdrop-blur-xl space-y-5">
                  {/* Top Bar of the Mockup */}
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-red-400" />
                      <span className="h-3 w-3 rounded-full bg-amber-400" />
                      <span className="h-3 w-3 rounded-full bg-emerald-400" />
                      <span className="text-xs font-mono text-muted ml-2">agriintelli.ai/live-field</span>
                    </div>
                    <Badge tone="success" dot>IA Active</Badge>
                  </div>

                  {/* Leaf Diagnostic Simulation */}
                  <div className="rounded-2xl border border-border/80 bg-slate-900 p-4 text-white relative overflow-hidden">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                        <Icons.Diagnostic className="w-4 h-4" />
                        <span>Scanner Foliaire IA — Analyse en temps réel</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">94.8% Confiance</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 items-center">
                      <div className="relative rounded-xl overflow-hidden bg-slate-800 border border-slate-700 p-2 text-center">
                        <div className="h-24 w-full rounded-lg bg-emerald-950 flex flex-col items-center justify-center relative">
                          <Icons.Sprout className="w-10 h-10 text-emerald-400" />
                          <div className="absolute inset-0 border border-amber-400/80 rounded-lg animate-pulse" />
                          <span className="absolute bottom-1 right-1 text-[9px] bg-amber-500/90 text-slate-950 font-bold px-1 rounded">
                            Lésion foliaire
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs text-left">
                        <p className="text-slate-400">Pathogène identifié :</p>
                        <p className="font-bold text-amber-400 text-sm">Rouille du maïs (Puccinia sorghi)</p>
                        <p className="text-[11px] text-slate-300">Action : Traitement bio à base de décoction de prêle sous 48h.</p>
                      </div>
                    </div>
                  </div>

                  {/* Mini Telemetry Grid */}
                  <div className="grid grid-cols-3 gap-3 text-left">
                    <div className="rounded-xl border border-border/70 bg-surface-subtle p-3">
                      <p className="text-[11px] font-semibold text-muted uppercase">Rendement estimé</p>
                      <p className="mt-1 text-lg font-bold text-foreground">2.4 t/ha</p>
                      <p className="text-[10px] text-emerald-700 font-semibold">+18% vs 2023</p>
                    </div>

                    <div className="rounded-xl border border-border/70 bg-surface-subtle p-3">
                      <p className="text-[11px] font-semibold text-muted uppercase">Indice NDVI</p>
                      <p className="mt-1 text-lg font-bold text-emerald-800">0.82</p>
                      <p className="text-[10px] text-muted">Végétation optimale</p>
                    </div>

                    <div className="rounded-xl border border-border/70 bg-surface-subtle p-3">
                      <p className="text-[11px] font-semibold text-muted uppercase">Humidité Sol</p>
                      <p className="mt-1 text-lg font-bold text-sky-700">34%</p>
                      <p className="text-[10px] text-sky-800 font-semibold">Irrigation jeudi</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Numbers Bar */}
      <section id="impact" className="border-y border-border/80 bg-surface py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 text-center">
            <div>
              <p className="text-3xl font-extrabold text-emerald-800 sm:text-4xl tabular-nums">98.7%</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted">Précision Diagnostique</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-foreground sm:text-4xl tabular-nums">12 500 ha</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted">Surfaces Modélisées</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-emerald-800 sm:text-4xl tabular-nums">+34%</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted">Gain Moyen de Rendement</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-sky-700 sm:text-4xl tabular-nums">&lt; 3 sec</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted">Inférence Modèle IA</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars Section */}
      <section id="fonctionnalites" className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Architecture & Fonctionnalités
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Les 4 Piliers de l&apos;Intelligence AgriIntelli
            </h2>
            <p className="text-base text-muted">
              Une suite intégrée conçue pour accompagner l&apos;agriculteur du semis jusqu&apos;à la récolte en éliminant les incertitudes.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1 */}
            <Card hover className="flex flex-col justify-between text-left">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
                  <Icons.Diagnostic className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Diagnostic Phytosanitaire</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  Importez une photo de feuille malade. L&apos;IA identifie immédiatement le champignon, la bactérie ou le ravageur avec recommandations biologiques et curatives.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/60">
                <Badge tone="success">Vision par Ordinateur</Badge>
              </div>
            </Card>

            {/* Card 2 */}
            <Card hover className="flex flex-col justify-between text-left">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
                  <Icons.Soil className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Analyse & Santé du Sol</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  Suivi des indicateurs clés N-P-K, pH et humidité. Calcul d&apos;amendements organiques et préconisations d&apos;engrais sur-mesure pour éviter le gaspillage.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/60">
                <Badge tone="warning">NPK & Chimie des Sols</Badge>
              </div>
            </Card>

            {/* Card 3 */}
            <Card hover className="flex flex-col justify-between text-left">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-800">
                  <Icons.Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Planification & Météo</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  Calendrier cultural intelligent synchronisé avec les prévisions météo locales à 5 jours pour caler idéalement vos dates de semis, sarclage et récolte.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/60">
                <Badge tone="info">Open-Meteo & Gantt</Badge>
              </div>
            </Card>

            {/* Card 4 */}
            <Card hover className="flex flex-col justify-between text-left">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
                  <Icons.Prediction className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Prédictions de Rendement</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  Modèles d&apos;apprentissage automatique anticipant le tonnage à l&apos;hectare selon l&apos;historique de la parcelle, la météo et la santé des cultures.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/60">
                <Badge tone="success">Machine Learning</Badge>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonial Quote */}
      <section className="bg-surface border-y border-border/80 py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
            <Icons.Sprout className="w-5 h-5" />
          </div>
          <blockquote className="text-xl sm:text-2xl font-semibold text-foreground leading-relaxed">
            &laquo; Grâce au diagnostic IA foliaire et aux prédictions de sol d&apos;AgriIntelli, nous avons réduit de 40% l&apos;usage de fongicides chimiques tout en augmentant notre récolte de maïs de 18 quintaux par hectare. &raquo;
          </blockquote>
          <div className="mt-6">
            <p className="font-bold text-emerald-800">Dr. Jean-Pierre Mbarga</p>
            <p className="text-xs text-muted">Agronome Référent — Coopérative Céréalière de Ndop</p>
          </div>
        </div>
      </section>

      {/* High-Impact CTA Section */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 p-8 sm:p-14 text-white shadow-2xl">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-2xl space-y-4 text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">
                Prêt à explorer le futur agronomique ?
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
                Prenez les commandes d&apos;AgriIntelli dès maintenant.
              </h2>
              <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
                Connectez-vous avec l&apos;un des comptes de démonstration préconfigurés et explorez la gestion intégrée des exploitations, le scanner IA et les modèles prédictifs.
              </p>
              <div className="pt-4 flex flex-wrap gap-3">
                <Link to="/app">
                  <Button
                    size="lg"
                    className="bg-white text-emerald-900 hover:bg-emerald-50 shadow-lg font-bold"
                  >
                    Accéder à l&apos;espace agriculteur
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/40 text-white hover:bg-white/10"
                  >
                    Se connecter
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/80 bg-surface py-10">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <div className="flex items-center gap-2">
            <img src={logo} alt="AgriIntelli" className="h-6 w-6 object-contain" />
            <span className="font-semibold text-foreground">AgriIntelli &copy; 2026</span>
            <span>— Plateforme d&apos;agriculture de précision assistée par IA.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#accueil" className="hover:text-emerald-800 transition-colors">Haut de page</a>
            <Link to="/login" className="hover:text-emerald-800 transition-colors">Connexion</Link>
            <Link to="/admin" className="hover:text-emerald-800 transition-colors">Administration</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
