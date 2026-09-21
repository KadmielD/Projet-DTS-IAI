import { useState } from "react";
import { Badge, Button, Card, PageHeader } from "@/components/ui";

export default function DiagnosticPage() {
  const [hasPhoto, setHasPhoto] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  return (
    <div>
      <PageHeader
        title="Diagnostic IA"
        subtitle="Envoyez une photo de la plante pour détecter maladies et stress"
      />

      <div className="mb-4 flex items-center gap-2">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center gap-2">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                step === 2 && hasPhoto
                  ? "bg-primary text-white"
                  : step === 3 && analyzed
                    ? "bg-primary text-white"
                    : step === 1
                      ? "bg-primary text-white"
                      : "bg-background text-muted"
              }`}
            >
              {step}
            </span>
            {step < 3 ? <span className="h-px w-8 bg-border" /> : null}
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold">
            Envoyez une photo de la plante malade
          </h2>
          <button
            type="button"
            onClick={() => {
              setHasPhoto(true);
              setAnalyzed(false);
            }}
            className="mt-4 flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 px-4 py-12 text-primary transition-colors hover:bg-primary/10"
          >
            <svg
              className="mb-2 h-10 w-10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            <span className="font-semibold">
              {hasPhoto ? "Photo ajoutée (simulée)" : "Ajouter une photo"}
            </span>
          </button>
          <Button
            className="mt-4 w-full"
            disabled={!hasPhoto}
            onClick={() => setAnalyzed(true)}
          >
            Lancer le diagnostic
          </Button>
        </Card>

        <Card>
          <h2 className="font-semibold">Résultat</h2>
          {analyzed ? (
            <div className="mt-4 space-y-3">
              <p>
                Maladie détectée :{" "}
                <strong className="text-primary">Tasker yellow</strong>
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge tone="danger">Gravité : Élevé</Badge>
                <Badge tone="info">Confiance : 92%</Badge>
              </div>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted">
                <li>Isoler les plants atteints</li>
                <li>Appliquer un traitement adapté sous 48h</li>
                <li>Surveiller les parcelles voisines</li>
              </ul>
              <Button variant="outline">Voir plus de recommandations</Button>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">
              Les résultats apparaîtront ici après analyse.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
