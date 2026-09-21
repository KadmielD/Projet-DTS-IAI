import { useState } from "react";
import { defaultSettings } from "@/api/mock";
import { Badge, Button, Card, Input, PageHeader } from "@/components/ui";

export default function ParametresPage() {
  const [threshold, setThreshold] = useState(
    String(defaultSettings.alertThresholdYield),
  );
  const [maintenance, setMaintenance] = useState(
    defaultSettings.maintenanceMode,
  );
  const [modules, setModules] = useState(defaultSettings.modulesEnabled);
  const [legal, setLegal] = useState(defaultSettings.legalNotice);
  const [saved, setSaved] = useState(false);

  const toggleModule = (key: keyof typeof modules) => {
    setModules((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div>
      <PageHeader
        title="Paramètres"
        subtitle="Configuration plateforme AgriIntelli"
        actions={
          <Button
            onClick={() => {
              setSaved(true);
              setTimeout(() => setSaved(false), 2000);
            }}
          >
            Enregistrer
          </Button>
        }
      />

      {saved ? (
        <p className="mb-4 text-sm font-medium text-primary">
          Paramètres enregistrés (mock).
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold">Seuils & maintenance</h2>
          <div className="mt-4 space-y-4">
            <Input
              label="Seuil d'alerte rendement (t/ha)"
              value={threshold}
              onChange={setThreshold}
            />
            <button
              type="button"
              onClick={() => setMaintenance((v) => !v)}
              className="flex w-full items-center justify-between rounded-lg border border-border px-4 py-3 text-sm"
            >
              <span>Mode maintenance</span>
              <Badge tone={maintenance ? "warning" : "success"}>
                {maintenance ? "Activé" : "Désactivé"}
              </Badge>
            </button>
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold">Activation des modules</h2>
          <ul className="mt-4 space-y-2">
            {(
              [
                ["diagnostic", "Diagnostic IA"],
                ["prediction", "Prédictions"],
                ["soilAnalysis", "Analyse sol"],
                ["planning", "Planification"],
              ] as const
            ).map(([key, label]) => (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => toggleModule(key)}
                  className="flex w-full items-center justify-between rounded-lg bg-background px-4 py-3 text-sm"
                >
                  <span>{label}</span>
                  <Badge tone={modules[key] ? "success" : "neutral"}>
                    {modules[key] ? "ON" : "OFF"}
                  </Badge>
                </button>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="font-semibold">Textes légaux</h2>
          <textarea
            value={legal}
            onChange={(e) => setLegal(e.target.value)}
            rows={4}
            className="mt-3 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2"
          />
        </Card>
      </div>
    </div>
  );
}
