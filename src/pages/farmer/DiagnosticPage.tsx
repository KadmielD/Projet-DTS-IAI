import { useState } from "react";
import { Link } from "react-router-dom";
import { runDiagnostic } from "@/api/services";
import type { DiagnosticResult } from "@/types";
import { PhotoUpload } from "@/components/PhotoUpload";
import { Stepper } from "@/components/Feedback";
import { Badge, Button, Card, PageHeader } from "@/components/ui";

export default function DiagnosticPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [showAllRecos, setShowAllRecos] = useState(false);

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
        title="Diagnostic phytosanitaire"
        subtitle="Importer une photo, analyser avec l'IA, consulter resultats et recommandations"
      />

      <Stepper
        steps={["Authentifie", "Importer photo", "Resultats & reco"]}
        current={step}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold">Importer une photo de la plante</h2>
          <p className="mt-1 text-sm text-muted">
            Cas d'usage partage avec l'analyse de sol — pret pour OpenAI Vision.
          </p>
          <div className="mt-4">
            <PhotoUpload
              onChange={(f) => {
                setFile(f);
                setResult(null);
              }}
            />
          </div>
          <Button
            className="mt-4 w-full"
            disabled={!file || loading}
            onClick={analyze}
          >
            {loading ? "Analyse en cours…" : "Lancer le diagnostic"}
          </Button>
        </Card>

        <Card>
          <h2 className="font-semibold">Resultats diagnostic et recommandations</h2>
          {result ? (
            <div className="mt-4 space-y-3">
              <p>
                Maladie detectee :{" "}
                <strong className="text-primary">{result.disease}</strong>
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge tone={severityTone}>
                  Gravite : {result.severity}
                </Badge>
                <Badge tone="info">Confiance : {result.confidence}%</Badge>
              </div>
              {result.photoName ? (
                <p className="text-xs text-muted">Photo : {result.photoName}</p>
              ) : null}
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted">
                {(showAllRecos
                  ? result.recommendations
                  : result.recommendations.slice(0, 2)
                ).map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
              {!showAllRecos && result.recommendations.length > 2 ? (
                <Button variant="outline" onClick={() => setShowAllRecos(true)}>
                  Voir plus de recommandations
                </Button>
              ) : null}
              <Link to="/app/historique" className="inline-block text-sm font-semibold text-primary">
                Voir dans l'historique →
              </Link>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">
              Les resultats apparaitront ici apres analyse.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
