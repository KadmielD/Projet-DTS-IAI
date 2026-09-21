import { Link } from "react-router-dom";
import {
  mockActivities,
  mockCultures,
  mockExploitations,
  mockPredictions,
} from "@/api/mock";
import { Badge, Button, Card, KpiCard, PageHeader } from "@/components/ui";

export default function DashboardPage() {
  const activeCultures = mockCultures.filter((c) => c.status === "en_cours");
  const nextActivity = mockActivities[1];
  const prediction = mockPredictions[0];
  const farm = mockExploitations[0];

  return (
    <div>
      <PageHeader
        title="Tableau de bord"
        subtitle="Vue d'ensemble de vos exploitations et activités"
      />

      <div className="mb-6 rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-foreground">
        <span className="font-semibold text-warning">Attention :</span>{" "}
        Irrigation prévue le 12 Mai — Parcelle Bambui. Préparez l&apos;eau et
        les équipements.
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Exploitations" value={mockExploitations.length} />
        <KpiCard label="Cultures en cours" value={activeCultures.length} />
        <KpiCard
          label="Prochaine activité"
          value="Irrigation"
          hint={nextActivity?.date}
        />
        <KpiCard
          label="Récolte prédite"
          value={`${prediction.yieldPredicted} t/ha`}
          hint={`${prediction.confidence}% confiance`}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                Aperçu de l&apos;exploitation
              </h2>
              <p className="mt-1 text-sm text-muted">{farm.location}</p>
            </div>
            <Link to="/app/exploitations">
              <Button variant="outline">Voir détails</Button>
            </Link>
          </div>
          <div className="mt-4 overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 p-6">
            <p className="text-2xl font-bold text-primary">{farm.name}</p>
            <p className="mt-2 text-sm text-foreground/80">
              {farm.areaHa} ha · {farm.description}
            </p>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="text-lg font-semibold">Activités récentes</h2>
          <ul className="mt-4 space-y-3">
            {mockActivities.slice(0, 5).map((a) => (
              <li key={a.id} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <div>
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-muted">{a.date}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link
            to="/app/historique"
            className="mt-4 inline-block text-sm font-semibold text-primary"
          >
            Voir l&apos;historique →
          </Link>
        </Card>
      </div>

      <div className="mt-6">
        <h2 className="mb-3 text-lg font-semibold">Accès rapides</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              to: "/app/diagnostic",
              title: "Diagnostic IA",
              desc: "Analyser une plante malade",
            },
            {
              to: "/app/analyse-sol",
              title: "Analyse sol",
              desc: "pH, NPK et recommandations",
            },
            {
              to: "/app/planification",
              title: "Planification",
              desc: "Calendrier cultural",
            },
          ].map((item) => (
            <Link key={item.to} to={item.to}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <p className="font-semibold text-primary">{item.title}</p>
                <p className="mt-1 text-sm text-muted">{item.desc}</p>
                <Badge tone="success">Ouvrir</Badge>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
