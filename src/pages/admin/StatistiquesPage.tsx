import { mockPlatformStats } from "@/api/mock";
import { Badge, Card, PageHeader } from "@/components/ui";
import { Icons } from "@/components/icons";

export default function StatistiquesPage() {
  const maxUsage = Math.max(
    ...mockPlatformStats.moduleUsage.map((m) => m.value),
  );
  const totalRoles = mockPlatformStats.roleDistribution.reduce(
    (s, r) => s + r.count,
    0,
  );

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Statistiques & Télémétrie des Modules"
        subtitle="Métriques d'adoption des outils IA, engagement des agriculteurs et répartition des licences."
        badge={<Badge tone="success" dot>Métriques en direct</Badge>}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Module Usage */}
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-border/60 pb-3 mb-6">
              <Icons.Diagnostic className="w-5 h-5 text-emerald-800" />
              <h2 className="text-base font-bold text-foreground">
                Taux d&apos;Utilisation des Modules IA
              </h2>
            </div>

            <div className="space-y-4">
              {mockPlatformStats.moduleUsage.map((m) => (
                <div key={m.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-foreground">{m.name}</span>
                    <span className="text-emerald-800 tabular-nums">{m.value} requêtes</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden border border-border/50">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-800 to-emerald-600 transition-all duration-300"
                      style={{ width: `${(m.value / maxUsage) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-6 pt-3 border-t border-border/60 text-xs text-muted">
            Le module de Diagnostic IA foliaire représente la majorité du trafic de calcul.
          </p>
        </Card>

        {/* Roles Distribution */}
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-border/60 pb-3 mb-6">
              <Icons.Users className="w-5 h-5 text-emerald-800" />
              <h2 className="text-base font-bold text-foreground">
                Répartition des Rôles & Licences
              </h2>
            </div>

            <ul className="space-y-3">
              {mockPlatformStats.roleDistribution.map((r) => {
                const pct = Math.round((r.count / totalRoles) * 100);
                return (
                  <li
                    key={r.role}
                    className="flex items-center justify-between rounded-xl border border-border/60 bg-surface-subtle/50 px-4 py-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface border border-border/70 font-bold text-xs text-emerald-800 capitalize">
                        {r.role[0]}
                      </span>
                      <span className="font-bold text-xs text-foreground capitalize">
                        {r.role}s
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-xs text-foreground tabular-nums">
                        {r.count} comptes
                      </span>
                      <span className="text-muted text-[11px] block">
                        {pct}% du total
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <p className="mt-6 pt-3 border-t border-border/60 text-xs text-muted">
            Taux de rétention mesuré : ~78% des exploitants actifs de manière hebdomadaire.
          </p>
        </Card>
      </div>
    </div>
  );
}
