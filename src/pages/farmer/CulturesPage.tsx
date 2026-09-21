import { mockCultures, mockExploitations } from "@/api/mock";
import type { CultureStatus } from "@/types";
import { Badge, Card, PageHeader } from "@/components/ui";

const statusLabel: Record<CultureStatus, string> = {
  en_cours: "En cours",
  planifiee: "Planifiée",
  recoltee: "Récoltée",
};

const statusTone: Record<CultureStatus, "success" | "info" | "neutral"> = {
  en_cours: "success",
  planifiee: "info",
  recoltee: "neutral",
};

export default function CulturesPage() {
  return (
    <div>
      <PageHeader
        title="Mes cultures"
        subtitle="Suivi des cultures par exploitation"
      />
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-background text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Culture</th>
              <th className="px-4 py-3 font-medium">Exploitation</th>
              <th className="px-4 py-3 font-medium">Stade</th>
              <th className="px-4 py-3 font-medium">Période</th>
              <th className="px-4 py-3 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody>
            {mockCultures.map((c) => {
              const farm = mockExploitations.find(
                (e) => e.id === c.exploitationId,
              );
              return (
                <tr key={c.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-muted">{farm?.name}</td>
                  <td className="px-4 py-3">{c.stage}</td>
                  <td className="px-4 py-3 text-muted">
                    {c.startDate} → {c.endDate}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={statusTone[c.status]}>
                      {statusLabel[c.status]}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {mockCultures
          .filter((c) => c.status === "en_cours")
          .map((c) => (
            <Card key={c.id}>
              <p className="font-semibold text-primary">{c.name}</p>
              <p className="text-sm text-muted">{c.stage}</p>
            </Card>
          ))}
      </div>
    </div>
  );
}
