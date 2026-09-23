import { useEffect, useState } from "react";
import { getSoilAnalyses } from "@/api/services";
import { mockExploitations } from "@/api/mock";
import type { SoilAnalysis } from "@/types";
import { PhotoUpload } from "@/components/PhotoUpload";
import { Stepper } from "@/components/Feedback";
import { Badge, Button, Card, Input, PageHeader } from "@/components/ui";
import { Icons } from "@/components/icons";

export default function AnalyseSolPage() {
  const [existing, setExisting] = useState<SoilAnalysis | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [ph, setPh] = useState("6.2");
  const [n, setN] = useState("28");
  const [p, setP] = useState("18");
  const [k, setK] = useState("22");
  const [humidity, setHumidity] = useState("34");
  const [saved, setSaved] = useState(false);
  const [fromPhoto, setFromPhoto] = useState(false);

  useEffect(() => {
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

  const farm = mockExploitations.find((e) => e.id === existing?.exploitationId);
  const step = saved || fromPhoto ? 3 : photoName ? 2 : 1;

  const simulateVision = () => {
    if (!photoName) return;
    setFromPhoto(true);
    setPh("6.4");
    setN("32");
    setP("20");
    setK("24");
    setHumidity("38");
  };

  // Compute fertility indicator
  const phNum = parseFloat(ph) || 6.2;
  const nNum = parseFloat(n) || 28;
  const pNum = parseFloat(p) || 18;
  const kNum = parseFloat(k) || 22;

  const fertilityScore = Math.min(
    100,
    Math.round(
      (phNum >= 6 && phNum <= 7.2 ? 30 : 15) +
        Math.min(25, nNum * 0.8) +
        Math.min(25, pNum * 1.2) +
        Math.min(20, kNum * 0.9),
    ),
  );

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Analyse Physico-Chimique du Sol"
        subtitle={`Suivi des indicateurs N-P-K, acidité pH et humidité — ${farm?.name ?? "Ferme de Ndop"}`}
        badge={
          <Badge tone="info" dot>
            Équilibre NPK
          </Badge>
        }
      />

      <Stepper
        steps={["Échantillon de terre", "Indicateurs NPK & pH", "Plan d'amendement"]}
        current={step}
      />

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Form: Photo & Inputs */}
        <div className="lg:col-span-6 space-y-4">
          <Card>
            <div className="flex items-center justify-between mb-4 border-b border-border/60 pb-3">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Icons.Camera className="w-5 h-5 text-emerald-800" />
                <span>Échantillon de sol / Carottage</span>
              </h2>
              <span className="text-xs text-muted">Facultatif</span>
            </div>

            <PhotoUpload
              label="Photographier l'échantillon ou la coupe de terre"
              hint="Permet d'estimer la texture du sol (limon, argile, sable) et l'humidité résiduelle."
              onChange={(f) => {
                setPhotoName(f?.name ?? null);
                setFromPhoto(false);
                setSaved(false);
              }}
            />

            <Button
              className="mt-3 w-full"
              variant="secondary"
              size="sm"
              disabled={!photoName}
              onClick={simulateVision}
              icon={<Icons.Sparkles className="w-4 h-4 text-emerald-700" />}
            >
              Estimer les indicateurs par Vision IA
            </Button>

            <div className="mt-6 pt-4 border-t border-border/60">
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <Icons.Soil className="w-4 h-4 text-amber-700" />
                <span>Valeurs mesurées ou saisies</span>
              </h3>

              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  label="Acidité pH"
                  value={ph}
                  onChange={setPh}
                  placeholder="6.0 - 7.0"
                  hint="Idéal : 6.2 - 6.8"
                />
                <Input
                  label="Azote N (mg/kg)"
                  value={n}
                  onChange={setN}
                  placeholder="20 - 40"
                  hint="Favorise la biomasse"
                />
                <Input
                  label="Phosphore P (mg/kg)"
                  value={p}
                  onChange={setP}
                  placeholder="15 - 30"
                  hint="Développement racinaire"
                />
                <Input
                  label="Potassium K (mg/kg)"
                  value={k}
                  onChange={setK}
                  placeholder="18 - 35"
                  hint="Résistance et floraison"
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Taux d'humidité (%)"
                    value={humidity}
                    onChange={setHumidity}
                    placeholder="25 - 45"
                    hint="Réserve utile du sol"
                  />
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <Button
                  onClick={() => setSaved(true)}
                  icon={<Icons.Check className="w-4 h-4" />}
                >
                  Enregistrer l&apos;analyse
                </Button>

                {saved ? (
                  <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
                    <Icons.Check className="w-3.5 h-3.5" /> Enregistré dans le registre
                  </span>
                ) : null}
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Nutrient Meters & Recommendations */}
        <div className="lg:col-span-6 space-y-4">
          <Card className="h-full flex flex-col justify-between">
            <div className="space-y-6">
              {/* Fertility Score Card */}
              <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50 via-surface to-emerald-50/50 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                      Indice Global de Fertilité
                    </span>
                    <h3 className="text-2xl font-black text-foreground mt-0.5">
                      {fertilityScore} / 100
                    </h3>
                    <p className="text-xs text-muted mt-1">
                      Sol limono-argileux fertile · Excellent potentiel céréalier
                    </p>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-800 text-white font-black text-lg shadow-md">
                    {fertilityScore > 80 ? "A+" : fertilityScore > 65 ? "A" : "B"}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge tone="info">pH {ph}</Badge>
                  <Badge tone="success">N {n} mg/kg</Badge>
                  <Badge tone="success">P {p} mg/kg</Badge>
                  <Badge tone="success">K {k} mg/kg</Badge>
                  <Badge tone="warning">Humidité {humidity}%</Badge>
                  {fromPhoto ? <Badge tone="info">Source : Vision IA</Badge> : null}
                </div>
              </div>

              {/* Visual Nutrient Gauges */}
              <div className="space-y-3.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                  <Icons.Stats className="w-4 h-4 text-emerald-800" />
                  Jauges de nutriments par rapport au seuil agronomique :
                </h4>

                {/* pH Gauge */}
                <div className="rounded-xl border border-border/70 bg-surface-subtle/50 p-3 space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span>pH Sol ({ph})</span>
                    <span className="text-emerald-800 font-bold">Zone Neutre Optimale</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (phNum / 14) * 100 * 1.4)}%` }}
                    />
                  </div>
                </div>

                {/* Azote N */}
                <div className="rounded-xl border border-border/70 bg-surface-subtle/50 p-3 space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span>Azote disponible N ({n} mg/kg)</span>
                    <span className="text-emerald-800 font-bold">Bien Pourvu</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (nNum / 50) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Phosphore P */}
                <div className="rounded-xl border border-border/70 bg-surface-subtle/50 p-3 space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span>Phosphore assimilable P ({p} mg/kg)</span>
                    <span className="text-emerald-800 font-bold">Optimal</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (pNum / 40) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Potassium K */}
                <div className="rounded-xl border border-border/70 bg-surface-subtle/50 p-3 space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span>Potassium échangeable K ({k} mg/kg)</span>
                    <span className="text-emerald-800 font-bold">Favorable</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (kNum / 40) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Recommendations list */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-2.5">
                  Recommandations d&apos;amendement & fertilisation :
                </h4>
                <ul className="space-y-2">
                  {(existing?.recommendations ?? [
                    "Sol équilibré pour le maïs. Apport de 15 t/ha de fumier composté au labour.",
                    "Fractionner les apports d'urée pour limiter le lessivage lors des épisodes de pluie.",
                    "Maintenir un paillage organique pour préserver l'humidité de surface à 35%.",
                  ]).map((r) => (
                    <li
                      key={r}
                      className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-surface-subtle/40 p-2.5 text-xs text-foreground leading-relaxed"
                    >
                      <Icons.Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border/60 text-xs text-muted">
              Dernière mise à jour : {existing?.date ?? "2024-05-10"} · Prochaine analyse suggérée : dans 6 mois.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
