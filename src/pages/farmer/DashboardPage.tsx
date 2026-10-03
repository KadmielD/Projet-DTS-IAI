import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getActivities,
  getAiStatus,
  getCultures,
  getDailyTip,
  getExploitations,
  getNotifications,
  getPredictions,
} from "@/api/services";
import type {
  Activity,
  AiStatus,
  AppNotification,
  Culture,
  Exploitation,
  Prediction,
} from "@/types";
import { Badge, Button, Card, KpiCard, PageHeader } from "@/components/ui";

export default function DashboardPage() {
  const [farms, setFarms] = useState<Exploitation[]>([]);
  const [cultures, setCultures] = useState<Culture[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [alerts, setAlerts] = useState<AppNotification[]>([]);
  const [dailyTip, setDailyTip] = useState<{ tip: string; culture: string; source: string } | null>(null);
  const [aiStatus, setAiStatus] = useState<AiStatus | null>(null);

  useEffect(() => {
    getAiStatus().then(setAiStatus);
    getDailyTip("Maïs").then(setDailyTip);
    Promise.all([
      getExploitations(),
      getCultures(),
      getActivities(),
      getPredictions(),
      getNotifications(),
    ]).then(([f, c, a, p, n]) => {
      setFarms(f);
      setCultures(c);
      setActivities(a);
      setPrediction(p[0] ?? null);
      setAlerts(n.filter((x) => !x.read));
    });
  }, []);

  const activeCultures = cultures.filter((c) => c.status === "en_cours");
  const nextActivity = activities[1] ?? activities[0];
  const farm = farms[0];

  return (
    <div>
      <PageHeader
        title="Tableau de bord"
        subtitle="Vue d'ensemble de vos exploitations, activités et recommandations IA en temps réel"
        actions={
          <div className="flex items-center gap-2">
            {aiStatus?.has_openai_key ? (
              <Badge tone="success" className="py-1">
                OpenAI Connecté
              </Badge>
            ) : null}
            <Link to="/app/notifications">
              <Button variant="outline">
                Notifications
                {alerts.length > 0 ? ` (${alerts.length})` : ""}
              </Button>
            </Link>
          </div>
        }
      />

      {dailyTip && (
        <div className="mb-6 rounded-2xl border border-primary/30 bg-primary/5 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl mt-0.5">🌱</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Conseil agronomique du jour (IA)
                </span>
                <Badge tone={dailyTip.source === "openai" ? "success" : "info"} className="text-[10px] py-0 px-2">
                  {dailyTip.source === "openai" ? "OpenAI GPT" : "Agronomie Expert"}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-foreground/90 font-medium">{dailyTip.tip}</p>
            </div>
          </div>
          <Link to="/app/diagnostic" className="shrink-0">
            <Button size="sm" variant="outline" className="border-primary/40 text-primary hover:bg-primary/10">
              Diagnostic photo →
            </Button>
          </Link>
        </div>
      )}

      {alerts[0] ? (
        <div className="mb-6 rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-foreground">
          <span className="font-semibold text-warning">{alerts[0].title} :</span>{" "}
          {alerts[0].message}{" "}
          <Link to="/app/notifications" className="font-semibold text-primary">
            Voir tout
          </Link>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Exploitations" value={farms.length} />
        <KpiCard label="Cultures en cours" value={activeCultures.length} />
        <KpiCard
          label="Prochaine activite"
          value={nextActivity ? "Irrigation" : "—"}
          hint={nextActivity?.date}
        />
        <KpiCard
          label="Recolte predite"
          value={prediction ? `${prediction.yieldPredicted} t/ha` : "—"}
          hint={prediction ? `${prediction.confidence}% confiance` : undefined}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                Apercu de l'exploitation
              </h2>
              <p className="mt-1 text-sm text-muted">{farm?.location}</p>
            </div>
            <Link to="/app/exploitations">
              <Button variant="outline">Voir details</Button>
            </Link>
          </div>
          <div className="mt-4 overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 p-6">
            <p className="text-2xl font-bold text-primary">
              {farm?.name ?? "—"}
            </p>
            <p className="mt-2 text-sm text-foreground/80">
              {farm ? `${farm.areaHa} ha · ${farm.description}` : ""}
            </p>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="text-lg font-semibold">Activites recentes</h2>
          <ul className="mt-4 space-y-3">
            {activities.slice(0, 5).map((a) => (
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
            Voir l'historique →
          </Link>
        </Card>
      </div>

      <div className="mt-6">
        <h2 className="mb-3 text-lg font-semibold">Acces rapides</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              href: "/app/diagnostic",
              title: "Diagnostic IA",
              desc: "Importer photo + recommandations",
            },
            {
              href: "/app/analyse-sol",
              title: "Analyse sol",
              desc: "Photo, pH, NPK et recommandations",
            },
            {
              href: "/app/planification",
              title: "Planification",
              desc: "Calendrier + meteo + predictions",
            },
          ].map((item) => (
            <Link key={item.href} to={item.href}>
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
