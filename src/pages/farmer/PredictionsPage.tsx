import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPredictions } from "@/api/services";
import type { Prediction } from "@/types";
import { EmptyState } from "@/components/Feedback";
import { Badge, Button, Card, PageHeader } from "@/components/ui";

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
    ? Math.max(...p.yieldPredictedSeries, ...p.yieldObserved, 1)
    : 1;

  return (
    <div>
      <PageHeader
        title="Prediction des recoltes"
        subtitle="Modele IA de prediction — valeurs mock jusqu'au branchement ML"
        actions={
          <Link to="/app/planification">
            <Button variant="outline">Retour planification</Button>
          </Link>
        }
      />

      {loading ? (
        <p className="text-sm text-muted">Chargement…</p>
      ) : !p ? (
        <EmptyState
          title="Aucune prediction"
          description="Lancez une planification pour generer une prediction."
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <h2 className="text-lg font-semibold">Resultat de la prediction</h2>
            <p className="mt-1 text-sm text-muted">{p.cultureName}</p>
            <p className="mt-4 text-3xl font-bold text-primary">
              {p.yieldPredicted} t/ha
            </p>
            <p className="mt-2 text-sm">
              Date estimee de recolte : <strong>{p.harvestDate}</strong>
            </p>
            <div className="mt-3">
              <Badge tone="success">Confiance {p.confidence}%</Badge>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold">
              Evolution du rendement (t/ha)
            </h2>
            <div className="mt-6 flex h-40 items-end gap-3">
              {p.months.map((month, i) => {
                const pred = p.yieldPredictedSeries[i] ?? 0;
                const obs = p.yieldObserved[i];
                return (
                  <div
                    key={month}
                    className="flex flex-1 flex-col items-center gap-1"
                  >
                    <div className="relative flex h-32 w-full items-end justify-center gap-1">
                      <div
                        className="w-2 rounded-t border border-dashed border-primary"
                        style={{ height: `${(pred / maxY) * 100}%` }}
                        title={`Predite ${pred}`}
                      />
                      {obs != null ? (
                        <div
                          className="w-3 rounded-t bg-primary"
                          style={{ height: `${(obs / maxY) * 100}%` }}
                          title={`Observee ${obs}`}
                        />
                      ) : null}
                    </div>
                    <span className="text-xs text-muted">{month}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex gap-4 text-xs text-muted">
              <span>Tirets = predit</span>
              <span>Plein = observe</span>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
