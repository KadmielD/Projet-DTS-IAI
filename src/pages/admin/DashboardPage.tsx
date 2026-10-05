import { mockPlatformStats, mockUsers } from "@/api/mock";
import { Badge, Card, KpiCard, PageHeader } from "@/components/ui";
import { Icons } from "@/components/icons";

export default function DashboardPage() {
  const recentUsers = [...mockUsers]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 4);
  const maxActivity = Math.max(
    ...mockPlatformStats.activityByMonth.map((m) => m.value),
  );

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Cockpit d'Administration AgriIntelli"
        subtitle="Supervision globale de l'écosystème agronomique, télémétrie des modèles et activité des exploitants."
        badge={<Badge tone="info" dot>Superviseur</Badge>}
      />

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard
          label="Utilisateurs Actifs"
          value={mockPlatformStats.activeUsers}
          trend={{ value: "+12% ce mois", positive: true }}
          icon={<Icons.Users className="w-5 h-5 text-emerald-800" />}
        />
        <KpiCard
          label="Nouveaux Inscrits"
          value={mockPlatformStats.newSignups}
          hint="Derniers 30 jours"
          icon={<Icons.User className="w-5 h-5 text-sky-700" />}
        />
        <KpiCard
          label="Diagnostics Vision"
          value={mockPlatformStats.diagnosticsRun}
          trend={{ value: "+28% d'usage", positive: true }}
          icon={<Icons.Diagnostic className="w-5 h-5 text-amber-700" />}
        />
        <KpiCard
          label="Prédictions ML"
          value={mockPlatformStats.predictionsRun}
          hint="Inférences exécutées"
          icon={<Icons.Prediction className="w-5 h-5 text-purple-600" />}
        />
        <KpiCard
          label="Analyses Sol NPK"
          value={mockPlatformStats.soilAnalyses}
          hint="Rapports générés"
          icon={<Icons.Soil className="w-5 h-5 text-emerald-800" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Activity Chart */}
        <div className="lg:col-span-7">
          <Card className="h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-6">
                <div className="flex items-center gap-2">
                  <Icons.Stats className="w-5 h-5 text-emerald-800" />
                  <h2 className="text-base font-bold text-foreground">
                    Volume d&apos;Activité Mensuelle Globale
                  </h2>
                </div>
                <Badge tone="success">En croissance</Badge>
              </div>

              <div className="h-48 flex items-end gap-3 sm:gap-6 px-2 border-b border-border/60 pb-2">
                {mockPlatformStats.activityByMonth.map((m) => (
                  <div
                    key={m.month}
                    className="flex flex-1 flex-col items-center justify-end h-full gap-2 group"
                  >
                    <div
                      className="w-full max-w-[40px] rounded-t-xl bg-gradient-to-t from-emerald-800 to-emerald-600 transition-all duration-300 group-hover:brightness-110 shadow-sm"
                      style={{ height: `${(m.value / maxActivity) * 100}%` }}
                      title={`${m.month} : ${m.value} requêtes`}
                    />
                    <span className="text-xs font-bold text-muted group-hover:text-foreground">
                      {m.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-4 text-xs text-muted">
              Mesure agrégée des requêtes API, scans foliaires et analyses NPK enregistrées sur le cluster.
            </p>
          </Card>
        </div>

        {/* Recent Registrations */}
        <div className="lg:col-span-5">
          <Card className="h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Icons.User className="w-5 h-5 text-emerald-800" />
                  <h2 className="text-base font-bold text-foreground">
                    Dernières Inscriptions
                  </h2>
                </div>
                <span className="text-xs text-muted">Comptes récents</span>
              </div>

              <ul className="space-y-3">
                {recentUsers.map((u) => (
                  <li
                    key={u.id}
                    className="flex items-center justify-between rounded-xl border border-border/60 bg-surface-subtle/40 p-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-800 text-xs font-bold text-white uppercase">
                        {u.name[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-foreground text-xs truncate">{u.name}</p>
                        <p className="text-[11px] text-muted truncate">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end shrink-0 gap-1">
                      <Badge tone={u.role === "admin" ? "warning" : "info"}>
                        {u.role}
                      </Badge>
                      <span className="text-[10px] text-muted">{u.createdAt}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 pt-3 border-t border-border/60 text-xs font-semibold text-emerald-800">
              {mockUsers.length} comptes au total sur la plateforme
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
