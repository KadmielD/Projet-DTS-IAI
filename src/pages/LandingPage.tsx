import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <img src={logo} alt="AgriIntelli" width={48} height={48} />
          <div>
            <p className="text-lg font-bold leading-tight">
              <span className="text-primary">Agri</span>
              <span className="text-accent">Intelli</span>
            </p>
            <p className="text-[10px] uppercase tracking-wide text-muted">
              Agriculture durable
            </p>
          </div>
        </div>
        <nav className="hidden items-center gap-6 text-sm font-medium text-foreground/80 md:flex">
          <a href="#accueil" className="hover:text-primary">
            Accueil
          </a>
          <a href="#fonctionnalites" className="hover:text-primary">
            Fonctionnalités
          </a>
          <a href="#apropos" className="hover:text-primary">
            À propos
          </a>
        </nav>
        <Link
          to="/login"
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
        >
          Se connecter
        </Link>
      </header>

      <section
        id="accueil"
        className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2"
      >
        <div>
          <h1 className="text-4xl font-bold leading-tight text-foreground md:text-5xl">
            Votre agriculture, plus intelligente chaque jour.
          </h1>
          <p className="mt-4 text-lg text-muted">
            Planifiez vos cultures, diagnostiquez vos plantes et prédisez vos
            récoltes grâce à l&apos;intelligence artificielle.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/register"
              className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary/90"
            >
              Commencer
            </Link>
            <a
              href="#fonctionnalites"
              className="rounded-lg border border-primary px-5 py-3 text-sm font-semibold text-primary hover:bg-primary/5"
            >
              En savoir plus
            </a>
          </div>
          <p className="mt-6 text-xs uppercase tracking-wide text-muted">
            Cultiver aujourd&apos;hui, prévoir demain
          </p>
        </div>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/15 via-accent/10 to-warning/10 p-8">
          <div className="space-y-4">
            {[
              { title: "Planification", desc: "Calendrier cultural intelligent" },
              { title: "Diagnostic", desc: "Détection IA des stress et maladies" },
              {
                title: "Prédiction",
                desc: "2.4 t/ha — rendement estimé maïs",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-xl border border-border bg-surface/90 p-4 shadow-sm"
              >
                <p className="font-semibold text-primary">{card.title}</p>
                <p className="text-sm text-muted">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="fonctionnalites"
        className="border-t border-border bg-background py-16"
      >
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold" id="apropos">
            Une plateforme pour décider mieux
          </h2>
          <p className="mt-2 max-w-2xl text-muted">
            AgriIntelli centralise vos exploitations, cultures, analyses de sol
            et historiques pour une agriculture durable et prédictive.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Exploitations & cultures",
              "Diagnostic IA",
              "Analyse de sol",
              "Prédiction des récoltes",
            ].map((f) => (
              <div
                key={f}
                className="rounded-xl border border-border bg-surface p-5 shadow-sm"
              >
                <p className="font-semibold text-foreground">{f}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
