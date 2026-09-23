import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPredictions } from "@/api/services";
import type { Prediction } from "@/types";
import { EmptyState } from "@/components/Feedback";
import { Badge, Button, Card, PageHeader } from "@/components/ui";
import { Icons } from "@/components/icons";

export default function PredictionsPage() {
  const [items, setItems] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPredictions()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  const p = items[0];
  const maxY = p
    ? Math.max(...p.yieldPredictedSeries, ...p.yieldObserved, 3)
    : 3;

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Prédiction & Modélisation des Récoltes"
        subtitle="Algorithme d'apprentissage automatique estimant les rendements à l'hectare et la maturité foliaire."
        actions={
          <Link to="/app/planification">
            <Button variant="outline" size="sm" icon={<Icons.Calendar className="w-4 h-4" />}>
              Voir le calendrier
            </Button>
          </Link>
        }
      />

      {loading ? (
        <Card className="p-12 text-center text-sm text-muted">
          <Icons.RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-800 mb-2" />
          <span>Calcul des modèles prédictifs…</span>
        </Card>
      ) : !p ? (
        <EmptyState
          title="Aucune prédiction disponible"
          description="Renseignez vos cultures et activez une planification pour générer les modèles de prédiction."
          action={
            <Link to="/app/cultures">
              <Button size="sm">Ajouter une culture</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Main Yield Projection Card */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="relative overflow-hidden h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Icons.Prediction className="w-5 h-5 text-emerald-800" />
                    <h2 className="text-base font-bold text-foreground">
                      Rendement Prévisionnel
                    </h2>
                  </div>
                  <Badge tone="success" dot>IA Calibrée</Badge>
                </div>

                <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-surface p-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    {p.cultureName} (Variété hybride)
                  </span>

                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-4xl font-black text-foreground tabular-nums">
                      {p.yieldPredicted}
                    </span>
                    <span className="text-lg font-bold text-muted">tonnes / ha</span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Badge tone="success">Fiabilité modèle : {p.confidence}%</Badge>
                    <Badge tone="info">+18% vs moyenne locale</Badge>
                  </div>
                </div>

                <div className="mt-5 space-y-3 text-xs">
                  <div className="flex items-center justify-between rounded-xl border border-border/60 bg-surface-subtle/50 p-3">
                    <span className="text-muted font-medium">Date estimée de récolte</span>
                    <span className="font-bold text-foreground flex items-center gap-1.5">
                      <Icons.Calendar className="w-3.5 h-3.5 text-emerald-800" />
                      {p.harvestDate}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-border/60 bg-surface-subtle/50 p-3">
                    <span className="text-muted font-medium">Cumul thermique requis</span>
                    <span className="font-bold text-foreground">1 750 degrés-jours</span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-border/60 bg-surface-subtle/50 p-3">
                    <span className="text-muted font-medium">Indice de biomasse épis</span>
                    <span className="font-bold text-emerald-800">Optimal (0.88)</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60 text-[11px] text-muted">
                Modèle ML entraîné sur l&apos;historique agro-météorologique des hautes terres de l&apos;Ouest.
              </div>
            </Card>
          </div>

          {/* Evolution Chart & Agronomic Risk Analysis */}
          <div className="lg:col-span-7 space-y-4">
            <Card>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/60 pb-3 mb-6">
                <div>
                  <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                    <Icons.Stats className="w-5 h-5 text-emerald-800" />
                    <span>Évolution du Rendement Prévisionnel vs Observé (t/ha)</span>
                  </h2>
                  <p className="text-xs text-muted mt-0.5">
                    Comparaison dynamique mensuelle au cours de la saison culturale.
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-muted">
                    <span className="h-3 w-3 rounded-sm border border-dashed border-emerald-600 bg-emerald-100" />
                    Modèle Prédit
                  </span>
                  <span className="flex items-center gap-1.5 text-foreground">
                    <span className="h-3 w-3 rounded-sm bg-emerald-800" />
                    Observé Terrain
                  </span>
                </div>
              </div>

              {/* Bar Chart Container */}
              <div className="h-56 flex items-end gap-3 sm:gap-6 pt-6 pb-2 px-2 border-b border-border/60">
                {p.months.map((month, i) => {
                  const pred = p.yieldPredictedSeries[i] ?? 0;
                  const obs = p.yieldObserved[i];
                  const predHeight = `${(pred / maxY) * 100}%`;
                  const obsHeight = obs != null ? `${(obs / maxY) * 100}%` : "0%";

                  return (
                    <div
                      key={month}
                      className="flex flex-1 flex-col items-center justify-end h-full gap-2 group"
                    >
                      <div className="relative flex w-full items-end justify-center gap-1.5 h-full">
                        {/* Predicted bar */}
                        <div
                          className="w-3.5 sm:w-5 rounded-t-lg border-2 border-dashed border-emerald-600 bg-emerald-50 transition-all duration-300 group-hover:bg-emerald-100"
                          style={{ height: predHeight }}
                          title={`Prédit : ${pred} t/ha`}
                        />
                        {/* Observed bar */}
                        {obs != null ? (
                          <div
                            className="w-3.5 sm:w-5 rounded-t-lg bg-emerald-800 transition-all duration-300 group-hover:bg-emerald-700 shadow-sm"
                            style={{ height: obsHeight }}
                            title={`Observé : ${obs} t/ha`}
                          />
                        ) : null}
                      </div>
                      <span className="text-xs font-bold text-muted group-hover:text-foreground">
                        {month}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Factors grid */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-border/70 bg-surface-subtle p-3">
                  <p className="text-[10px] uppercase font-bold text-muted">Stress Hydrique</p>
                  <p className="mt-1 text-sm font-bold text-emerald-800">Faible</p>
                  <p className="text-[10px] text-muted">Pluviométrie idéale</p>
                </div>
                <div className="rounded-xl border border-border/70 bg-surface-subtle p-3">
                  <p className="text-[10px] uppercase font-bold text-muted">Pression Parasitaire</p>
                  <p className="mt-1 text-sm font-bold text-amber-600">Modérée</p>
                  <p className="text-[10px] text-muted">Rouille sous contrôle</p>
                </div>
                <div className="rounded-xl border border-border/70 bg-surface-subtle p-3">
                  <p className="text-[10px] uppercase font-bold text-muted">Fertilisation Sol</p>
                  <p className="mt-1 text-sm font-bold text-emerald-800">Optimale</p>
                  <p className="text-[10px] text-muted">Azote disponible OK</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
