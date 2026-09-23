import { mockActivities } from "@/api/mock";
import type { Activity } from "@/types";
import { Badge, Card, PageHeader } from "@/components/ui";
import { Icons } from "@/components/icons";

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
  diagnostic: "Diagnostic IA",
  analyse_sol: "Analyse Sol",
  traitement: "Traitement",
  prediction: "Prédiction",
};

export default function HistoriquePage() {
  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "diagnostic":
        return <Icons.Diagnostic className="w-4 h-4 text-amber-700" />;
      case "analyse_sol":
        return <Icons.Soil className="w-4 h-4 text-emerald-800" />;
      case "irrigation":
        return <Icons.Droplet className="w-4 h-4 text-sky-700" />;
      case "traitement":
        return <Icons.ShieldCheck className="w-4 h-4 text-red-600" />;
      case "prediction":
        return <Icons.Prediction className="w-4 h-4 text-purple-600" />;
      default:
        return <Icons.Sprout className="w-4 h-4 text-emerald-800" />;
    }
  };

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Journal d'Exploitation & Traçabilité"
        subtitle="Historique immuable de l'ensemble des interventions culturales, diagnostics foliaires et analyses agronomiques."
        badge={<Badge tone="neutral">Conforme GlobalGAP</Badge>}
      />

      <Card>
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-border/80">
          {mockActivities.map((a) => (
            <div
              key={a.id}
              className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border/60 bg-surface-subtle/30 p-4 transition-colors hover:bg-surface-subtle/80 hover:border-emerald-600/30"
            >
              {/* Timeline Dot */}
              <div className="absolute -left-[31px] sm:-left-[35px] top-4 flex h-6 w-6 items-center justify-center rounded-full bg-surface border-2 border-emerald-700 shadow-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-700" />
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface border border-border/70 shadow-xs">
                  {getActivityIcon(a.type)}
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm">{a.title}</p>
                  <p className="text-xs text-muted mt-0.5 flex items-center gap-1.5">
                    <Icons.Calendar className="w-3.5 h-3.5 text-muted" />
                    <span>{a.date}</span>
                  </p>
                </div>
              </div>

              <div className="self-start sm:self-center">
                <Badge tone={typeTone[a.type]}>{typeLabel[a.type]}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
