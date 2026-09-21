import { useEffect, useState } from "react";
import { getSoilAnalyses } from "@/api/services";
import { mockExploitations } from "@/api/mock";
import type { SoilAnalysis } from "@/types";
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

  const farm = mockExploitations.find(
    (e) => e.id === existing?.exploitationId,
  );

  const step = saved || fromPhoto ? 3 : photoName ? 2 : 1;

  const simulateVision = () => {
    if (!photoName) return;
    setFromPhoto(true);
    setPh("6.1");
    setN("26");
    setP("17");
    setK("21");
    setHumidity("36");
  };

  return (
    <div>
      <PageHeader
        title="Analyse sol"
        subtitle={`Importer une photo et/ou saisir les indicateurs — ${farm?.name ?? "exploitation"}`}
      />

      <Stepper
        steps={["Importer photo", "Indicateurs", "Recommandations"]}
        current={step}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold">Importer une photo du sol / echantillon</h2>
          <div className="mt-4">
            <PhotoUpload
              label="Ajouter une photo"
              onChange={(f) => {
                setPhotoName(f?.name ?? null);
                setFromPhoto(false);
                setSaved(false);
              }}
            />
          </div>
          <Button
            className="mt-3 w-full"
            variant="outline"
            disabled={!photoName}
            onClick={simulateVision}
          >
            Estimer via IA (simulation OpenAI)
          </Button>

          <h2 className="mt-6 font-semibold">Saisie des indicateurs</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Input label="pH" value={ph} onChange={setPh} />
            <Input label="Azote (N)" value={n} onChange={setN} />
            <Input label="Phosphore (P)" value={p} onChange={setP} />
            <Input label="Potassium (K)" value={k} onChange={setK} />
            <Input label="Humidite (%)" value={humidity} onChange={setHumidity} />
          </div>
          <Button className="mt-4" onClick={() => setSaved(true)}>
            Enregistrer l'analyse
          </Button>
          {saved ? (
            <p className="mt-2 text-sm text-primary">Analyse enregistree (mock).</p>
          ) : null}
        </Card>

        <Card>
          <h2 className="font-semibold">Resultat & recommandations</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge tone="info">pH {ph}</Badge>
            <Badge tone="success">N {n}</Badge>
            <Badge tone="success">P {p}</Badge>
            <Badge tone="success">K {k}</Badge>
            <Badge tone="warning">Humidite {humidity}%</Badge>
            {photoName ? <Badge>Photo : {photoName}</Badge> : null}
            {fromPhoto ? <Badge tone="info">Estime IA</Badge> : null}
          </div>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted">
            {(existing?.recommendations ?? []).map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
