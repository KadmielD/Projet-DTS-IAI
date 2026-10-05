import { useEffect, useState } from "react";
import { analyzeSoilWithAI, getAiStatus, getSoilAnalyses } from "@/api/services";
import { mockExploitations } from "@/api/mock";
import type { AiStatus, SoilAnalysis, SoilAnalysisAIResponse } from "@/types";
import { PhotoUpload } from "@/components/PhotoUpload";
import { Stepper } from "@/components/Feedback";
import { Badge, Button, Card, Input, PageHeader } from "@/components/ui";

export default function AnalyseSolPage() {
  const [existing, setExisting] = useState<SoilAnalysis | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [ph, setPh] = useState("6.2");
  const [n, setN] = useState("28");
  const [p, setP] = useState("18");
  const [k, setK] = useState("22");
  const [humidity, setHumidity] = useState("34");
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<SoilAnalysisAIResponse | null>(null);
  const [aiStatus, setAiStatus] = useState<AiStatus | null>(null);

  useEffect(() => {
    getAiStatus().then(setAiStatus);
    getSoilAnalyses().then((list) => {
      const first = list[0] ?? null;
      setExisting(first);
      if (first) {
        setPh(String(first.ph));
        setN(String(first.nitrogen));
        setP(String(first.phosphorus));
        setK(String(first.potassium));
        setHumidity(String(first.humidity));
      }
    });
  }, []);

  const farm = mockExploitations.find(
    (e) => e.id === existing?.exploitationId,
  );

  const step = aiResult ? 3 : photoName ? 2 : 1;

  const runAnalysis = async () => {
    setAnalyzing(true);
    try {
      const res = await analyzeSoilWithAI({
        ph: parseFloat(ph) || 6.2,
        nitrogen: parseFloat(n) || 28,
        phosphorus: parseFloat(p) || 18,
        potassium: parseFloat(k) || 22,
        humidity: parseFloat(humidity) || 34,
        culture: "Maïs",
      });
      setAiResult(res);
    } finally {
      setAnalyzing(false);
    }
  };

  const simulateFromPhoto = () => {
    if (!photoName) return;
    setPh("6.4");
    setN("32");
    setP("19");
    setK("24");
    setHumidity("38");
    runAnalysis();
  };

  return (
    <div>
      <PageHeader
        title="Analyse physico-chimique du sol & fertilisation"
        subtitle={`Évaluation des ratios N-P-K, pH et teneur hydrique — ${farm?.name ?? "Exploitation agricole"}`}
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
                Agronomie Intégrée (Local)
              </Badge>
            )}
          </div>
        }
      />

      <Stepper
        steps={["Échantillon photo", "Indicateurs NPK", "Bilan & Prescription"]}
        current={step}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold text-foreground">Échantillon de sol / Parcelle</h2>
          <p className="mt-1 text-sm text-muted">
            Téléversez une photo de votre prélèvement de sol pour une estimation visuelle de la texture.
          </p>

          <div className="mt-4">
            <PhotoUpload
              label="Ajouter une photo de sol ou carottage"
              hint="Format JPG/PNG — terre arable ou profil racinaire"
              onChange={(f) => {
                setPhotoName(f?.name ?? null);
                setAiResult(null);
              }}
            />
          </div>

          <Button
            className="mt-3 w-full"
            variant="outline"
            disabled={!photoName || analyzing}
            onClick={simulateFromPhoto}
          >
            {analyzing ? "Estimation en cours…" : "Analyser la texture depuis la photo"}
          </Button>

          <div className="mt-6 border-t border-border pt-4">
            <h2 className="font-semibold text-foreground">Saisie des indicateurs physico-chimiques</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Input label="pH (acidité/alcalinité)" value={ph} onChange={setPh} />
              <Input label="Azote disponible (N - ppm)" value={n} onChange={setN} />
              <Input label="Phosphore assimilable (P - ppm)" value={p} onChange={setP} />
              <Input label="Potassium échangeable (K - ppm)" value={k} onChange={setK} />
              <Input label="Humidité résiduelle (%)" value={humidity} onChange={setHumidity} />
            </div>

            <Button
              className="mt-4 w-full text-base font-semibold"
              disabled={analyzing}
              onClick={runAnalysis}
            >
              {analyzing ? "Calcul agronomique en cours…" : "Générer la prescription agronomique"}
            </Button>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Bilan de fertilité & recommandations</h2>
            {aiResult && (
              <Badge tone={aiResult.source === "openai" ? "success" : "info"}>
                {aiResult.source === "openai" ? "Généré par OpenAI" : "Modèle Agronomique"}
              </Badge>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge tone="info">pH : {ph}</Badge>
            <Badge tone="success">N : {n} ppm</Badge>
            <Badge tone="success">P : {p} ppm</Badge>
            <Badge tone="success">K : {k} ppm</Badge>
            <Badge tone="warning">Humidité : {humidity}%</Badge>
            {photoName && <Badge className="text-xs">Photo : {photoName}</Badge>}
          </div>

          {aiResult ? (
            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-border/80 bg-background/50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted">Indice global de fertilité</span>
                  <span className="text-2xl font-bold text-primary">{aiResult.fertilityScore} / 100</span>
                </div>
                <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${aiResult.fertilityScore}%` }}
                  />
                </div>
                <p className="mt-2 text-sm font-semibold text-foreground">
                  Diagnostic : <span className="text-primary">{aiResult.soilQuality}</span>
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground">Actions correctives recommandées :</h3>
                <ul className="mt-2 space-y-2 text-sm text-foreground/90">
                  {aiResult.recommendations.map((r, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                        {idx + 1}
                      </span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="mt-8">
              <p className="text-sm font-medium text-foreground">Prescriptions antérieures enregistrées :</p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
                {(existing?.recommendations ?? [
                  "Maintenir un paillage organique pour protéger la structure du sol",
                  "Apporter un engrais ternaire équilibré au tallage",
                ]).map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
              <p className="mt-6 text-xs text-muted">
                Ajustez les valeurs NPK à gauche et cliquez sur « Générer la prescription agronomique » pour obtenir un bilan actualisé.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
