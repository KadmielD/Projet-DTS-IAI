import { useState } from "react";
import { Link } from "react-router-dom";
import { runDiagnostic } from "@/api/services";
import type { DiagnosticResult } from "@/types";
import { PhotoUpload } from "@/components/PhotoUpload";
import { Stepper } from "@/components/Feedback";
import { Badge, Button, Card, PageHeader } from "@/components/ui";
import { Icons } from "@/components/icons";

export default function DiagnosticPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysisStepText, setAnalysisStepText] = useState("");
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [showAllRecos, setShowAllRecos] = useState(false);

  const step = result ? 3 : file ? 2 : 1;

  const analyze = async () => {
    setLoading(true);
    setAnalysisStepText("Prétraitement & normalisation de la feuille...");

    const timer1 = setTimeout(() => {
      setAnalysisStepText("Détection des motifs pathogènes par réseau convolutif...");
    }, 600);

    const timer2 = setTimeout(() => {
      setAnalysisStepText("Croisement avec la base agronomique & remèdes...");
    }, 1200);

    try {
      const res = await runDiagnostic(file);
      // add small artificial delay for realistic scan feel
      await new Promise((resolve) => setTimeout(resolve, 1400));
      setResult({ ...res, photoName: file?.name ?? res.photoName });
      setShowAllRecos(false);
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setLoading(false);
      setAnalysisStepText("");
    }
  };

  const severityTone =
    result?.severity === "eleve"
      ? "danger"
      : result?.severity === "moyen"
        ? "warning"
        : "success";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Diagnostic Phytosanitaire par IA"
        subtitle="Détection ultra-rapide des maladies végétales, ravageurs et carences par vision par ordinateur."
        badge={
          <Badge tone="success" dot>
            Vision IA Prête
          </Badge>
        }
      />

      <Stepper
        steps={["Sélection de la feuille", "Inférence Vision IA", "Diagnostic & Traitements"]}
        current={step}
      />

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Upload and Scan Zone */}
        <div className="lg:col-span-6 space-y-4">
          <Card className="text-left">
            <div className="flex items-center justify-between mb-4 border-b border-border/60 pb-3">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Icons.Camera className="w-5 h-5 text-emerald-800" />
                <span>Prise de vue ou téléversement</span>
              </h2>
              <span className="text-xs text-muted">Caméra / Smartphone</span>
            </div>

            <PhotoUpload
              label="Importer une photo de la feuille malade"
              hint="Prenez une photo nette de la feuille avec bonne lumière. Échantillons 1-clic disponibles ci-dessous."
              onChange={(f) => {
                setFile(f);
                setResult(null);
              }}
            />

            <div className="mt-5">
              <Button
                size="lg"
                className="w-full font-bold"
                disabled={!file || loading}
                onClick={analyze}
                icon={
                  loading ? (
                    <Icons.RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Icons.Sparkles className="w-4 h-4" />
                  )
                }
              >
                {loading ? "Diagnostic en cours d'exécution…" : "Lancer le Diagnostic IA"}
              </Button>

              {loading && analysisStepText ? (
                <div className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-emerald-800 animate-pulse">
                  <span className="h-2 w-2 rounded-full bg-emerald-600" />
                  <span>{analysisStepText}</span>
                </div>
              ) : null}
            </div>
          </Card>
        </div>

        {/* Right: Results & Recommendations */}
        <div className="lg:col-span-6 space-y-4">
          <Card className="text-left h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Icons.Diagnostic className="w-5 h-5 text-emerald-800" />
                  <span>Résultat d&apos;analyse agronomique</span>
                </h2>
                {result ? (
                  <Badge tone={severityTone}>Gravité : {result.severity}</Badge>
                ) : (
                  <span className="text-xs text-muted">En attente</span>
                )}
              </div>

              {result ? (
                <div className="mt-5 space-y-5">
                  {/* Diagnosis Card Highlight */}
                  <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/70 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase font-bold tracking-wider text-emerald-800">
                          Pathogène Diagnostiqué
                        </p>
                        <h3 className="text-xl font-extrabold text-foreground mt-0.5">
                          {result.disease}
                        </h3>
                        {result.photoName ? (
                          <p className="text-xs text-muted mt-1">Source : {result.photoName}</p>
                        ) : null}
                      </div>

                      <div className="flex flex-col items-end">
                        <span className="text-2xl font-extrabold text-emerald-800 tabular-nums">
                          {result.confidence}%
                        </span>
                        <span className="text-[10px] uppercase font-bold text-muted">
                          Indice confiance
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations List */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-3 flex items-center gap-1.5">
                      <Icons.ShieldCheck className="w-4 h-4 text-emerald-800" />
                      Plan d&apos;action & recommandations agronomiques :
                    </h4>

                    <ul className="space-y-2.5">
                      {(showAllRecos
                        ? result.recommendations
                        : result.recommendations.slice(0, 3)
                      ).map((r, i) => (
                        <li
                          key={r}
                          className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-surface-subtle/60 p-3 text-xs leading-relaxed text-foreground"
                        >
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-800 mt-0.5">
                            {i + 1}
                          </span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>

                    {!showAllRecos && result.recommendations.length > 3 ? (
                      <button
                        type="button"
                        onClick={() => setShowAllRecos(true)}
                        className="mt-3 text-xs font-semibold text-emerald-800 hover:underline cursor-pointer"
                      >
                        Afficher toutes les recommandations ({result.recommendations.length}) ↓
                      </button>
                    ) : null}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-subtle text-muted border border-border/70">
                    <Icons.Diagnostic className="h-7 w-7" />
                  </div>
                  <p className="text-sm font-bold text-foreground">
                    Aucune analyse effectuée
                  </p>
                  <p className="mt-1 max-w-xs text-xs text-muted leading-relaxed">
                    Importez une photo à gauche ou choisissez un échantillon de test 1-clic pour voir le résultat ici.
                  </p>
                </div>
              )}
            </div>

            {result ? (
              <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs">
                <Link
                  to="/app/historique"
                  className="font-semibold text-emerald-800 hover:underline flex items-center gap-1"
                >
                  <Icons.History className="w-3.5 h-3.5" />
                  Consulter dans le journal parcellaire →
                </Link>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFile(null);
                    setResult(null);
                  }}
                >
                  Nouveau scan
                </Button>
              </div>
            ) : null}
          </Card>
        </div>
      </div>
    </div>
  );
}
