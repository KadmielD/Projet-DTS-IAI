import { mockActivities } from "@/api/mock";
import type { Activity } from "@/types";
import { Badge, Card, PageHeader } from "@/components/ui";

const typeTone: Record<
  Activity["type"],
  "success" | "info" | "warning" | "danger"
> = {
  semis: "success",
  irrigation: "info",
  diagnostic: "warning",
  analyse_sol: "success",
  traitement: "danger",
  prediction: "info",
};

const typeLabel: Record<Activity["type"], string> = {
  semis: "Semis",
  irrigation: "Irrigation",
  diagnostic: "Diagnostic",
  analyse_sol: "Analyse sol",
  traitement: "Traitement",
  prediction: "Prédiction",
};

export default function HistoriquePage() {
  return (
    <div>
      <PageHeader
        title="Historique"
        subtitle="Journal unifié des activités, diagnostics, analyses et prédictions"
      />
      <Card>
        <ul className="space-y-4">
          {mockActivities.map((a) => (
            <li
              key={a.id}
              className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4 last:border-0 last:pb-0"
            >
              <div className="flex gap-3">
                <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                <div>
                  <p className="font-medium">{a.title}</p>
                  <p className="text-sm text-muted">{a.date}</p>
                </div>
              </div>
              <Badge tone={typeTone[a.type]}>{typeLabel[a.type]}</Badge>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
