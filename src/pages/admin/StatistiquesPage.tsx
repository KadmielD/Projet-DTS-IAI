import { mockPlatformStats } from "@/api/mock";
import { Card, PageHeader } from "@/components/ui";

export default function StatistiquesPage() {
  const maxUsage = Math.max(
    ...mockPlatformStats.moduleUsage.map((m) => m.value),
  );
  const totalRoles = mockPlatformStats.roleDistribution.reduce(
    (s, r) => s + r.count,
    0,
  );

  return (
    <div>
      <PageHeader
        title="Statistiques"
        subtitle="Usage des modules et répartition des rôles"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold">Usage des modules</h2>
          <div className="mt-6 space-y-4">
            {mockPlatformStats.moduleUsage.map((m) => (
              <div key={m.name}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{m.name}</span>
                  <span className="font-semibold">{m.value}</span>
                </div>
                <div className="h-2 rounded-full bg-background">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${(m.value / maxUsage) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Répartition des rôles</h2>
          <ul className="mt-6 space-y-3">
            {mockPlatformStats.roleDistribution.map((r) => (
              <li
                key={r.role}
                className="flex items-center justify-between rounded-lg bg-background px-4 py-3"
              >
                <span className="font-medium">{r.role}</span>
                <span className="text-sm text-muted">
                  {r.count} ({Math.round((r.count / totalRoles) * 100)}%)
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted">
            Rétention indicative : ~72% des agriculteurs actifs sur 30 jours.
          </p>
        </Card>
      </div>
    </div>
  );
}
