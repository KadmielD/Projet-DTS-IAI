import { mockPlatformStats, mockUsers } from "@/api/mock";
import { Badge, Card, KpiCard, PageHeader } from "@/components/ui";

export default function DashboardPage() {
  const recentUsers = [...mockUsers]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 4);
  const maxActivity = Math.max(
    ...mockPlatformStats.activityByMonth.map((m) => m.value),
  );

  return (
    <div>
      <PageHeader
        title="Tableau de bord admin"
        subtitle="Vue plateforme AgriIntelli"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard
          label="Utilisateurs actifs"
          value={mockPlatformStats.activeUsers}
        />
        <KpiCard label="Nouveaux inscrits" value={mockPlatformStats.newSignups} />
        <KpiCard
          label="Diagnostics"
          value={mockPlatformStats.diagnosticsRun}
        />
        <KpiCard
          label="Prédictions"
          value={mockPlatformStats.predictionsRun}
        />
        <KpiCard
          label="Analyses sol"
          value={mockPlatformStats.soilAnalyses}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold">Activité globale</h2>
          <div className="mt-6 flex h-40 items-end gap-3">
            {mockPlatformStats.activityByMonth.map((m) => (
              <div
                key={m.month}
                className="flex flex-1 flex-col items-center gap-1"
              >
                <div
                  className="w-full rounded-t bg-primary"
                  style={{ height: `${(m.value / maxActivity) * 100}%` }}
                />
                <span className="text-xs text-muted">{m.month}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Dernières inscriptions</h2>
          <ul className="mt-4 space-y-3">
            {recentUsers.map((u) => (
              <li
                key={u.id}
                className="flex items-center justify-between border-b border-border pb-3 last:border-0"
              >
                <div>
                  <p className="font-medium">{u.name}</p>
                  <p className="text-xs text-muted">{u.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone="info">{u.role}</Badge>
                  <span className="text-xs text-muted">{u.createdAt}</span>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
