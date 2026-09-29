import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getActivities,
  getCultures,
  getExploitations,
  getNotifications,
  getPredictions,
} from "@/api/services";
import type {
  Activity,
  AppNotification,
  Culture,
  Exploitation,
  Prediction,
} from "@/types";
import { Badge, Button, Card, KpiCard, PageHeader } from "@/components/ui";
import { Icons } from "@/components/icons";
import { MapPlaceholder } from "@/components/Feedback";

export default function DashboardPage() {
  const [farms, setFarms] = useState<Exploitation[]>([]);
  const [cultures, setCultures] = useState<Culture[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [alerts, setAlerts] = useState<AppNotification[]>([]);

  useEffect(() => {
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
  const totalArea = farms.reduce((acc, curr) => acc + curr.areaHa, 0);

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "diagnostic":
        return <Icons.Diagnostic className="w-4 h-4 text-amber-600" />;
      case "analyse_sol":
        return <Icons.Soil className="w-4 h-4 text-emerald-600" />;
      case "irrigation":
        return <Icons.Droplet className="w-4 h-4 text-sky-600" />;
      case "prediction":
        return <Icons.Prediction className="w-4 h-4 text-purple-600" />;
      default:
        return <Icons.Sprout className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner & Agro Assistant */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-200/80 bg-gradient-to-br from-emerald-800 via-emerald-800 to-emerald-900 p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <Icons.Sun className="w-3.5 h-3.5 text-amber-300" />
              <span>Ndop, Cameroun · 26°C · Conditions idéales</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl text-white">
              Bonjour, Jean Mbarga 👋
            </h1>
            <p className="max-w-xl text-sm text-emerald-100/90 leading-relaxed">
              Vos parcelles présentent un indice de vitalité foliaire élevé (NDVI 0.82). Aucune anomalie critique détectée aujourd&apos;hui.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link to="/app/diagnostic">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white text-emerald-900 hover:bg-emerald-50 border-0 font-bold"
                icon={<Icons.Camera className="w-4 h-4" />}
              >
                Nouveau Diagnostic
              </Button>
            </Link>
            <Link to="/app/analyse-sol">
              <Button
                variant="outline"
                size="sm"
                className="border-white/30 text-white hover:bg-white/10"
                icon={<Icons.Soil className="w-4 h-4" />}
              >
                Analyse Sol NPK
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Alert banner if active */}
      {alerts[0] ? (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3.5 text-sm text-amber-900 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-200/80 text-amber-800">
              <Icons.AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-amber-950">{alerts[0].title} :</span>{" "}
              <span className="text-amber-800">{alerts[0].message}</span>
            </div>
          </div>
          <Link
            to="/app/notifications"
            className="shrink-0 text-xs font-bold text-amber-900 hover:underline"
          >
            Consulter ({alerts.length}) →
          </Link>
        </div>
      ) : null}

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Exploitations"
          value={farms.length}
          hint={`${totalArea.toFixed(1)} ha sous gestion`}
          trend={{ value: "+1 parcelle", positive: true }}
          icon={<Icons.Farm className="w-5 h-5" />}
        />
        <KpiCard
          label="Cultures Actives"
          value={activeCultures.length}
          hint="Maïs, Haricot, Tomate"
          trend={{ value: "En croissance", positive: true }}
          icon={<Icons.Sprout className="w-5 h-5" />}
        />
        <KpiCard
          label="Prochaine Intervention"
          value={nextActivity ? "Irrigation" : "—"}
          hint={nextActivity?.date ?? "Prévue sous 48h"}
          icon={<Icons.Droplet className="w-5 h-5 text-sky-600" />}
        />
        <KpiCard
          label="Rendement Estimé IA"
          value={prediction ? `${prediction.yieldPredicted} t/ha` : "—"}
          hint={prediction ? `${prediction.confidence}% de fiabilité modèle` : undefined}
          trend={{ value: "+18% vs n-1", positive: true }}
          icon={<Icons.Prediction className="w-5 h-5 text-purple-600" />}
        />
      </div>

      {/* Main Grid: Farm Overview Map & Recent Activities */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Farm & Satellite Parcel Map */}
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-foreground">
                    {farm?.name ?? "Exploitation Principale"}
                  </h2>
                  <Badge tone="success" dot>En ligne</Badge>
                </div>
                <p className="mt-1 text-xs text-muted flex items-center gap-1.5">
                  <Icons.MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  {farm?.location ?? "Localisation GPS non renseignée"}
                </p>
              </div>

              <Link to="/app/exploitations">
                <Button variant="outline" size="sm" icon={<Icons.ArrowUpRight className="w-3.5 h-3.5" />}>
                  Gérer les parcelles
                </Button>
              </Link>
            </div>

            <div className="overflow-hidden rounded-2xl">
              <MapPlaceholder
                title={farm?.name ?? "Cartographie Satellite"}
                subtitle={`${farm?.location ?? ""} · Surveillance spectrale active`}
                areaHa={farm?.areaHa ?? 12.5}
              />
            </div>

            {/* Farm specs badges */}
            <div className="mt-4 flex flex-wrap items-center gap-2 pt-2 border-t border-border/60">
              <span className="text-xs font-semibold text-muted">Cultures suivies :</span>
              {cultures.slice(0, 4).map((c) => (
                <Badge key={c.id} tone="success">
                  {c.name} ({c.stage})
                </Badge>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Activities Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Icons.History className="w-4 h-4 text-emerald-800" />
                  <span>Journal Récent</span>
                </h2>
                <Link
                  to="/app/historique"
                  className="text-xs font-semibold text-emerald-800 hover:underline"
                >
                  Voir tout →
                </Link>
              </div>

              <ul className="mt-4 space-y-3.5">
                {activities.slice(0, 5).map((a) => (
                  <li key={a.id} className="flex items-start gap-3 text-left">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-surface-subtle border border-border/70 mt-0.5">
                      {getActivityIcon(a.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {a.title}
                      </p>
                      <p className="text-xs text-muted mt-0.5">{a.date}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Daily AI Agronomic Tip */}
            <div className="mt-6 rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-3.5 text-xs text-emerald-950">
              <p className="font-bold flex items-center gap-1.5 text-emerald-900 mb-1">
                <Icons.Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                Conseil Agronomique IA du Jour
              </p>
              <p className="text-emerald-800/90 leading-relaxed">
                Apport en potassium recommandé sur la parcelle Maïs avant les pluies prévues vendredi pour maximiser le remplissage des grains.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Launchpad to Core AI Tools */}
      <div>
        <h2 className="mb-4 text-base font-bold tracking-tight text-foreground flex items-center gap-2">
          <Icons.Sparkles className="w-4 h-4 text-emerald-700" />
          <span>Accès Rapides aux Modules d&apos;Intelligence</span>
        </h2>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              href: "/app/diagnostic",
              title: "Diagnostic Phytosanitaire IA",
              desc: "Scanner foliaire assisté par vision par ordinateur et remèdes bio.",
              badge: "Vision IA",
              icon: <Icons.Diagnostic className="w-5 h-5 text-emerald-700" />,
            },
            {
              href: "/app/analyse-sol",
              title: "Analyse des Sols & NPK",
              desc: "Contrôle des indicateurs chimiques N-P-K, pH et fertilisation.",
              badge: "Agronomie",
              icon: <Icons.Soil className="w-5 h-5 text-amber-700" />,
            },
            {
              href: "/app/planification",
              title: "Calendrier & Météo 5 Jours",
              desc: "Synchronisation des cycles culturaux avec la pluviométrie.",
              badge: "Météo",
              icon: <Icons.Calendar className="w-5 h-5 text-sky-700" />,
            },
          ].map((item) => (
            <Link key={item.href} to={item.href}>
              <Card hover className="h-full flex flex-col justify-between text-left">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-subtle border border-border/70">
                      {item.icon}
                    </div>
                    <Badge tone="success">{item.badge}</Badge>
                  </div>
                  <h3 className="font-bold text-foreground text-sm">{item.title}</h3>
                  <p className="mt-1.5 text-xs text-muted leading-relaxed">{item.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-emerald-800">
                  <span>Accéder à l&apos;outil</span>
                  <Icons.ChevronRight className="w-4 h-4" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
