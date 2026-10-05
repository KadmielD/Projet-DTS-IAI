import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAiStatus, getAiYieldPrediction, getPredictions } from "@/api/services";
import type { AiStatus, Prediction, PredictionAIResponse } from "@/types";
import { Badge, Button, Card, Input, PageHeader } from "@/components/ui";

export default function PredictionsPage() {
  const [culture, setCulture] = useState("Maïs");
  const [areaHa, setAreaHa] = useState("12.5");
  const [loading, setLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState<AiStatus | null>(null);
  const [activePrediction, setActivePrediction] = useState<{
    cultureName: string;
    yieldPredicted: number;
    confidence: number;
    harvestDate: string;
    yieldPredictedSeries: number[];
    yieldObserved: (number | null)[];
    dailyTip?: string;
    source?: string;
  } | null>(null);

  const months = ["Mai", "Juin", "Juil", "Août", "Sept", "Oct"];

  useEffect(() => {
    getAiStatus().then(setAiStatus);
    getPredictions().then((list) => {
      const p = list[0];
      if (p) {
        setActivePrediction({
          cultureName: p.cultureName,
          yieldPredicted: p.yieldPredicted,
          confidence: p.confidence,
          harvestDate: p.harvestDate,
          yieldPredictedSeries: p.yieldPredictedSeries,
          yieldObserved: p.yieldObserved,
          dailyTip: "L'azote et le soufre au stade 6 feuilles sont déterminants pour atteindre le potentiel de rendement.",
          source: "Modèle Agronomique",
        });
      }
    });
  }, []);

  const calculateYield = async () => {
    setLoading(true);
    try {
      const res: PredictionAIResponse = await getAiYieldPrediction({
        culture,
        areaHa: parseFloat(areaHa) || 10,
        location: "Ndop, Ouest Cameroun",
      });
      setActivePrediction({
        cultureName: res.cultureName,
        yieldPredicted: res.yieldPredicted,
        confidence: res.confidence,
        harvestDate: res.harvestDate,
        yieldPredictedSeries: res.yieldPredictedSeries,
        yieldObserved: res.yieldObserved,
        dailyTip: res.dailyTip,
        source: res.source === "openai" ? "OpenAI gpt-4o-mini" : "Modèle Agronomique",
      });
    } finally {
      setLoading(false);
    }
  };

  const p = activePrediction;
  const maxY = p
    ? Math.max(
        ...p.yieldPredictedSeries,
        ...p.yieldObserved.filter((x): x is number => x != null),
        1,
      )
    : 1;

  return (
    <div>
      <PageHeader
        title="Modélisation prédictive des récoltes"
        subtitle="Estimation des rendements agricoles et calendrier prévisionnel par intelligence artificielle"
        actions={
          <div className="flex items-center gap-2">
            {aiStatus?.has_gemini_key ? (
              <Badge tone="success" className="py-1">
                Google {aiStatus.text_model}
              </Badge>
            ) : aiStatus?.has_openai_key ? (
              <Badge tone="success" className="py-1">
                OpenAI {aiStatus.text_model}
              </Badge>
            ) : (
              <Badge tone="info" className="py-1">
                Simulation Prédictive Intégrée
              </Badge>
            )}
            <Link to="/app/planification">
              <Button variant="outline">Retour planification</Button>
            </Link>
          </div>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <Card className="sm:col-span-3">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[140px]">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted">Spéculation</label>
              <select
                value={culture}
                onChange={(e) => setCulture(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Maïs">Maïs grain (Hybride)</option>
                <option value="Tomate">Tomate plein champ</option>
                <option value="Manioc">Manioc amélioré</option>
                <option value="Riz">Riz pluvial</option>
              </select>
            </div>
            <div className="w-36">
              <Input
                label="Superficie (ha)"
                value={areaHa}
                onChange={setAreaHa}
              />
            </div>
            <Button
              className="font-semibold"
              disabled={loading}
              onClick={calculateYield}
            >
              {loading ? "Calcul en cours…" : "Lancer la projection IA"}
            </Button>
          </div>
        </Card>

        <Card className="flex flex-col justify-center">
          <span className="text-xs font-medium text-muted">Production brute estimée</span>
          <p className="text-2xl font-bold text-primary mt-1">
            {p ? ((p.yieldPredicted * (parseFloat(areaHa) || 10))).toFixed(1) : "—"} tonnes
          </p>
        </Card>
      </div>

      {p && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Projection de rendement</h2>
              <Badge tone={p.source?.includes("OpenAI") ? "success" : "info"}>
                {p.source ?? "IA Prédictive"}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted">{p.cultureName} · {areaHa} hectares</p>

            <div className="mt-6 flex items-baseline gap-2">
              <p className="text-4xl font-extrabold text-primary">
                {p.yieldPredicted}
              </p>
              <span className="text-lg font-medium text-foreground/70">tonnes / hectare</span>
            </div>

            <div className="mt-4 rounded-xl border border-border/80 bg-background/50 p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Date optimale de récolte :</span>
                <strong className="text-foreground">{p.harvestDate}</strong>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Indice de confiance du modèle :</span>
                <span className="font-semibold text-primary">{p.confidence}%</span>
              </div>
            </div>

            {p.dailyTip && (
              <div className="mt-4 rounded-xl bg-primary/10 border border-primary/20 p-3 text-sm">
                <p className="font-semibold text-primary">💡 Recommandation agronomique liée :</p>
                <p className="mt-1 text-foreground/90">{p.dailyTip}</p>
              </div>
            )}
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                Trajectoire d'accumulation de biomasse (t/ha)
              </h2>
              <span className="text-xs text-muted">Cycle cultural 2026</span>
            </div>

            <div className="mt-8 flex h-48 items-end gap-3">
              {months.map((month, i) => {
                const pred = p.yieldPredictedSeries[i] ?? 0;
                const obs = p.yieldObserved[i];
                return (
                  <div
                    key={month}
                    className="flex flex-1 flex-col items-center gap-2"
                  >
                    <div className="relative flex h-36 w-full items-end justify-center gap-1.5">
                      <div
                        className="w-3 rounded-t border-2 border-dashed border-primary/80 bg-primary/20 transition-all duration-500"
                        style={{ height: `${(pred / maxY) * 100}%` }}
                        title={`Prédit : ${pred} t/ha`}
                      />
                      {obs != null ? (
                        <div
                          className="w-3 rounded-t bg-primary transition-all duration-500 shadow-sm"
                          style={{ height: `${(obs / maxY) * 100}%` }}
                          title={`Observé : ${obs} t/ha`}
                        />
                      ) : null}
                    </div>
                    <span className="text-xs font-medium text-muted">{month}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-center gap-6 border-t border-border pt-3 text-xs text-muted">
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-sm border-2 border-dashed border-primary bg-primary/20" />
                <span>Rendement projeté par l'IA</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-sm bg-primary" />
                <span>Biomasse observée sur le terrain</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
