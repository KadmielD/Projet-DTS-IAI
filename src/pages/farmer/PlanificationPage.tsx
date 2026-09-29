import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { mockPlanning, planningMonths } from "@/api/mock";
import { getWeatherForecast } from "@/api/services";
import type { WeatherDay } from "@/types";
import { WeatherStrip } from "@/components/Feedback";
import { Badge, Button, Card, PageHeader } from "@/components/ui";
import { Icons } from "@/components/icons";

export default function PlanificationPage() {
  const [weather, setWeather] = useState<WeatherDay[]>([]);

  useEffect(() => {
    getWeatherForecast().then(setWeather);
  }, []);

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Planification & Calendrier Cultural"
        subtitle="Ordonnancement des cycles de production agronomique et prévisions météorologiques locales."
        actions={
          <div className="flex gap-2.5">
            <Link to="/app/predictions">
              <Button
                variant="outline"
                size="sm"
                icon={<Icons.Prediction className="w-4 h-4 text-purple-600" />}
              >
                Prédictions Récoltes
              </Button>
            </Link>
            <Link to="/app/cultures">
              <Button size="sm" icon={<Icons.Plus className="w-4 h-4" />}>
                Ajouter une culture
              </Button>
            </Link>
          </div>
        }
      />

      {/* 5-Day Agro-Weather Forecast */}
      <Card>
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Icons.Sun className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-foreground">
              Météo Agronomique Prévisionnelle (5 Jours)
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone="success" dot>Station Ndop</Badge>
            <span className="text-xs text-muted">Synchronisé Open-Meteo</span>
          </div>
        </div>
        <WeatherStrip days={weather} />
      </Card>

      {/* Interactive Gantt Cultural Timeline */}
      <Card>
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/60 pb-3">
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Icons.Calendar className="w-5 h-5 text-emerald-800" />
              <span>Gantt des Cycles Végétatifs (Mai — Octobre)</span>
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Visualisation des périodes de semis, croissance foliaire, floraison et fauche.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" /> Céréales
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Légumineuses
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Maraîchage
            </span>
          </div>
        </div>

        {/* Month Header Grid */}
        <div className="mb-3 grid grid-cols-[140px_1fr] gap-3 text-xs font-bold text-muted uppercase tracking-wider">
          <div>Culture & Stade</div>
          <div className="grid grid-cols-6 gap-2 text-center">
            {planningMonths.map((m) => (
              <div key={m} className="rounded-lg bg-surface-subtle py-1.5 border border-border/50">
                {m}
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Rows */}
        <div className="space-y-4">
          {mockPlanning.map((row) => (
            <div
              key={row.culture}
              className="grid grid-cols-[140px_1fr] items-center gap-3 rounded-xl border border-border/60 bg-surface-subtle/30 p-2.5 hover:bg-surface-subtle/70 transition-colors"
            >
              <div>
                <p className="text-sm font-bold text-foreground">{row.culture}</p>
                <p className="text-[11px] text-muted">Cycle 120j</p>
              </div>

              <div className="relative h-10 w-full rounded-xl bg-surface border border-border/70 overflow-hidden flex items-center">
                {/* Visual grid subdivisions */}
                <div className="absolute inset-0 grid grid-cols-6 divide-x divide-border/40 pointer-events-none" />

                {/* Cultural Phase Pill */}
                <div
                  className="absolute h-7 rounded-lg shadow-sm transition-all duration-200 hover:brightness-110 flex items-center justify-between px-3 text-xs font-bold text-white overflow-hidden"
                  style={{
                    left: `${(row.start / 6) * 100}%`,
                    width: `${(row.span / 6) * 100}%`,
                    backgroundColor: row.color,
                  }}
                >
                  <span className="truncate">{row.culture}</span>
                  <span className="text-[10px] font-mono opacity-90 hidden sm:inline">
                    {row.span * 30}j
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline Insight Footer */}
        <div className="mt-8 rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
              <Icons.Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-950">
                Optimisation IA du Calendrier
              </p>
              <p className="text-xs text-emerald-800/90 mt-0.5">
                La fauche du haricot en août libèrera la parcelle pour un semis dérobé de sorgho.
              </p>
            </div>
          </div>

          <Link to="/app/predictions" className="shrink-0">
            <Button size="sm" icon={<Icons.ArrowUpRight className="w-3.5 h-3.5" />}>
              Consulter le rendement prévu
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
