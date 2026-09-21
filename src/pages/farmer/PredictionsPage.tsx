import { mockPredictions } from "@/api/mock";
import { Badge, Card, PageHeader } from "@/components/ui";

export default function PredictionsPage() {
  const p = mockPredictions[0];
  const maxY = Math.max(...p.yieldPredictedSeries, ...p.yieldObserved, 1);

  return (
    <div>
      <PageHeader
        title="Prédictions"
        subtitle="Estimation des rendements et confiance du modèle"
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold">Résultat de la prédiction</h2>
          <p className="mt-1 text-sm text-muted">{p.cultureName}</p>
          <p className="mt-4 text-3xl font-bold text-primary">
            {p.yieldPredicted} t/ha
          </p>
          <p className="mt-2 text-sm">
            Date estimée de récolte : <strong>{p.harvestDate}</strong>
          </p>
          <div className="mt-3">
            <Badge tone="success">Confiance {p.confidence}%</Badge>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">
            Évolution du rendement (t/ha)
          </h2>
          <div className="mt-6 flex h-40 items-end gap-3">
            {p.months.map((month: string, i: number) => {
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
                      title={`Prédit ${pred}`}
                    />
                    {obs != null ? (
                      <div
                        className="w-3 rounded-t bg-primary"
                        style={{ height: `${(obs / maxY) * 100}%` }}
                        title={`Observé ${obs}`}
                      />
                    ) : null}
                  </div>
                  <span className="text-xs text-muted">{month}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex gap-4 text-xs text-muted">
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-4 border border-dashed border-primary" />{" "}
              Prédit
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-4 bg-primary" /> Observé
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
