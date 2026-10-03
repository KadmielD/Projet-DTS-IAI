import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAiStatus, runDiagnostic } from "@/api/services";
import type { AiStatus, DiagnosticResult } from "@/types";
import { PhotoUpload } from "@/components/PhotoUpload";
import { Stepper } from "@/components/Feedback";
import { Badge, Button, Card, PageHeader } from "@/components/ui";

export default function DiagnosticPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [showAllRecos, setShowAllRecos] = useState(false);
  const [aiStatus, setAiStatus] = useState<AiStatus | null>(null);

  useEffect(() => {
    getAiStatus().then(setAiStatus);
  }, []);

  const step = result ? 3 : file ? 2 : 1;

  const analyze = async () => {
    setLoading(true);
    try {
      const res = await runDiagnostic(file);
      setResult({ ...res, photoName: file?.name ?? res.photoName });
      setShowAllRecos(false);
    } finally {
      setLoading(false);
    }
  };

  const severityTone =
    result?.severity === "eleve"
      ? "danger"
      : result?.severity === "moyen"
        ? "warning"
        : "success";

  return (
    <div>
      <PageHeader
        title="Diagnostic phytosanitaire par Vision IA"
        subtitle="Détection instantanée des pathologies foliaires et recommandations de traitement"
        actions={
          <div className="flex items-center gap-2">
            {aiStatus?.has_openai_key ? (
              <Badge tone="success" className="flex items-center gap-1.5 py-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Moteur : OpenAI {aiStatus.vision_model}
              </Badge>
            ) : (
              <Badge tone="info" className="flex items-center gap-1.5 py-1">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Mode Démo : Modèle Agronomique Intégré
              </Badge>
            )}
          </div>
        }
      />

      <Stepper
        steps={["Authentifié", "Importer photo", "Résultats & Recommandations"]}
        current={step}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Importer une photo de la plante</h2>
            <span className="text-xs text-muted">Formats : JPG, PNG, WEBP</span>
          </div>
          <p className="mt-1 text-sm text-muted">
            Prenez en photo une feuille présentant des symptômes visibles (taches, nécroses, flétrissement).
          </p>

          <div className="mt-4">
            <PhotoUpload
              label="Sélectionner ou déposer l'image foliaire"
              hint="Optimisé pour détection multi-pathologies (Maïs, Tomate, Manioc, Caféier)"
              onChange={(f) => {
                setFile(f);
                setResult(null);
              }}
            />
          </div>

          <Button
            className="mt-4 w-full text-base font-semibold"
            disabled={!file || loading}
            onClick={analyze}
          >
            {loading ? "Analyse Vision en cours (inspection des tissus)…" : "Lancer le diagnostic IA"}
          </Button>

          {aiStatus && !aiStatus.has_openai_key && (
            <p className="mt-3 text-xs text-muted/80 text-center">
              💡 Clé OpenAI non détectée : l'analyse bascule automatiquement sur la base agronomique locale haute précision.
            </p>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Rapport d'expertise agronomique</h2>
            {result && (
              <Badge tone={result.source === "openai" ? "success" : "info"}>
                {result.source === "openai" ? "OpenAI GPT-4o Vision" : "Agronomie Expert (Local)"}
              </Badge>
            )}
          </div>

          {result ? (
            <div className="mt-4 space-y-4">
              <div className="rounded-xl border border-border/80 bg-background/50 p-4">
                <p className="text-xs font-medium text-muted uppercase tracking-wider">Pathologie diagnostiquée</p>
                <p className="text-xl font-bold text-primary mt-1">{result.disease}</p>
                
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Badge tone={severityTone}>Gravité : {result.severity.toUpperCase()}</Badge>
                  <Badge tone="info">Indice de confiance : {result.confidence}%</Badge>
                  {result.photoName && (
                    <Badge className="text-xs">Fichier : {result.photoName}</Badge>
                  )}
                </div>
              </div>

              {result.symptoms && (
                <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-sm">
                  <span className="font-semibold text-amber-600 dark:text-amber-400">Symptômes identifiés : </span>
                  <span className="text-foreground/90">{result.symptoms}</span>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-foreground">Protocole d'intervention recommandé :</h3>
                <ul className="mt-2 space-y-2 text-sm text-foreground/90">
                  {(showAllRecos
                    ? result.recommendations
                    : result.recommendations.slice(0, 3)
                  ).map((r, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                        {idx + 1}
                      </span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {!showAllRecos && result.recommendations.length > 3 && (
                <Button variant="outline" size="sm" onClick={() => setShowAllRecos(true)}>
                  Voir les {result.recommendations.length - 3} recommandations supplémentaires
                </Button>
              )}

              <div className="pt-2 border-t border-border flex items-center justify-between">
                <Link to="/app/historique" className="text-sm font-semibold text-primary hover:underline">
                  Consulter dans l'historique →
                </Link>
                <Link to="/app/planification">
                  <Button variant="outline" size="sm">
                    Planifier un traitement
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-12 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-border rounded-xl">
              <span className="text-4xl mb-2">🌿</span>
              <p className="font-medium text-foreground">En attente d'échantillon</p>
              <p className="mt-1 text-sm text-muted max-w-sm">
                Chargez une photographie foliaire à gauche et cliquez sur « Lancer le diagnostic IA ».
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
