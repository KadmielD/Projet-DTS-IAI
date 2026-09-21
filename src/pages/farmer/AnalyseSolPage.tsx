import { useState } from "react";
import { mockExploitations, mockSoilAnalyses } from "@/api/mock";
import { Badge, Button, Card, Input, PageHeader } from "@/components/ui";

export default function AnalyseSolPage() {
  const existing = mockSoilAnalyses[0];
  const [ph, setPh] = useState(String(existing.ph));
  const [n, setN] = useState(String(existing.nitrogen));
  const [p, setP] = useState(String(existing.phosphorus));
  const [k, setK] = useState(String(existing.potassium));
  const [humidity, setHumidity] = useState(String(existing.humidity));
  const [saved, setSaved] = useState(false);

  const farm = mockExploitations.find((e) => e.id === existing.exploitationId);

  return (
    <div>
      <PageHeader
        title="Analyse sol"
        subtitle={`Dernière analyse — ${farm?.name} (${existing.date})`}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold">Saisie des indicateurs</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Input label="pH" value={ph} onChange={setPh} />
            <Input label="Azote (N)" value={n} onChange={setN} />
            <Input label="Phosphore (P)" value={p} onChange={setP} />
            <Input label="Potassium (K)" value={k} onChange={setK} />
            <Input
              label="Humidité (%)"
              value={humidity}
              onChange={setHumidity}
            />
          </div>
          <Button className="mt-4" onClick={() => setSaved(true)}>
            Enregistrer l&apos;analyse
          </Button>
          {saved ? (
            <p className="mt-2 text-sm text-primary">
              Analyse enregistrée (mock).
            </p>
          ) : null}
        </Card>

        <Card>
          <h2 className="font-semibold">Résultat & recommandations</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge tone="info">pH {ph}</Badge>
            <Badge tone="success">N {n}</Badge>
            <Badge tone="success">P {p}</Badge>
            <Badge tone="success">K {k}</Badge>
            <Badge tone="warning">Humidité {humidity}%</Badge>
          </div>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted">
            {existing.recommendations.map((r: string) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
