import { mockPlanning, planningMonths } from "@/api/mock";
import { Button, Card, PageHeader } from "@/components/ui";

export default function PlanificationPage() {
  return (
    <div>
      <PageHeader
        title="Planification"
        subtitle="Calendrier cultural Mai — Octobre"
        actions={<Button>+ Ajouter une culture</Button>}
      />
      <Card>
        <div className="mb-4 grid grid-cols-[120px_1fr] gap-2 text-xs font-medium text-muted">
          <div />
          <div className="grid grid-cols-6 gap-1">
            {planningMonths.map((m) => (
              <div key={m} className="text-center">
                {m}
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          {mockPlanning.map((row) => (
            <div
              key={row.culture}
              className="grid grid-cols-[120px_1fr] items-center gap-2"
            >
              <p className="text-sm font-medium">{row.culture}</p>
              <div className="relative h-8 rounded-md bg-background">
                <div
                  className="absolute top-1 h-6 rounded-md"
                  style={{
                    left: `${(row.start / 6) * 100}%`,
                    width: `${(row.span / 6) * 100}%`,
                    backgroundColor: row.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted">
          Les barres représentent les périodes de culture prévues. Ajustez les
          dates depuis la fiche culture.
        </p>
      </Card>
    </div>
  );
}
