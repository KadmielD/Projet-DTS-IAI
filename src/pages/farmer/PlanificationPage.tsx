import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { mockPlanning, planningMonths } from "@/api/mock";
import { getWeatherForecast } from "@/api/services";
import type { WeatherDay } from "@/types";
import { WeatherStrip } from "@/components/Feedback";
import { Button, Card, PageHeader } from "@/components/ui";

export default function PlanificationPage() {
  const [weather, setWeather] = useState<WeatherDay[]>([]);

  useEffect(() => {
    getWeatherForecast().then(setWeather);
  }, []);

  return (
    <div>
      <PageHeader
        title="Planification & calendrier cultural"
        subtitle="Optimisation des cycles de semis, d'irrigation et prévisions agro-météorologiques"
        actions={
          <div className="flex gap-2">
            <Link to="/app/predictions">
              <Button variant="outline">Projections IA</Button>
            </Link>
            <Link to="/app/cultures">
              <Button>+ Ajouter une culture</Button>
            </Link>
          </div>
        }
      />

      <Card className="mb-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="font-semibold">Prévisions agro-météorologiques (5 jours)</h2>
          <span className="text-xs text-muted">Données agro-climatiques régionales</span>
        </div>
        <WeatherStrip days={weather} />
      </Card>

      <Card>
        <h2 className="mb-4 font-semibold">Calendrier Mai — Octobre</h2>
        <div className="mb-4 grid grid-cols-[120px_1fr] gap-2 text-xs font-medium text-muted">
          <div />
          <div className="grid grid-cols-6 gap-1">
            {planningMonths.map((m) => (
              <div key={m} className="text-center">
                {m}
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          {mockPlanning.map((row) => (
            <div
              key={row.culture}
              className="grid grid-cols-[120px_1fr] items-center gap-2"
            >
              <p className="text-sm font-medium">{row.culture}</p>
              <div className="relative h-8 rounded-md bg-background">
                <div
                  className="absolute top-1 h-6 rounded-md"
                  style={{
                    left: `${(row.start / 6) * 100}%`,
                    width: `${(row.span / 6) * 100}%`,
                    backgroundColor: row.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted">
          Extension UC : consulter la prediction des recoltes depuis la
          planification.
        </p>
      </Card>
    </div>
  );
}
