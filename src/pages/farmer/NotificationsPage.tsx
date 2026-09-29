import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getNotifications, markNotificationRead } from "@/api/services";
import type { AppNotification } from "@/types";
import { EmptyState } from "@/components/Feedback";
import { Badge, Button, Card, PageHeader } from "@/components/ui";
import { Icons } from "@/components/icons";

const toneMap = {
  alerte: "warning",
  info: "info",
  succes: "success",
  meteo: "info",
} as const;

export default function NotificationsPage() {
  const [items, setItems] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotifications()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  const unread = useMemo(() => items.filter((n) => !n.read).length, [items]);

  const markAll = async () => {
    let next = items;
    for (const n of items.filter((x) => !x.read)) {
      next = await markNotificationRead(n.id, next);
    }
    setItems(next);
  };

  const getNotificationIcon = (type: AppNotification["type"]) => {
    switch (type) {
      case "alerte":
        return <Icons.AlertTriangle className="w-5 h-5 text-amber-600" />;
      case "meteo":
        return <Icons.Sun className="w-5 h-5 text-sky-600" />;
      case "succes":
        return <Icons.Check className="w-5 h-5 text-emerald-600" />;
      default:
        return <Icons.Bell className="w-5 h-5 text-emerald-800" />;
    }
  };

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Centre d'Alertes & Notifications"
        subtitle="Avertissements phytosanitaires, prévisions météo extrêmes et alertes de calendrier."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={markAll}
            disabled={unread === 0}
            icon={<Icons.Check className="w-4 h-4" />}
          >
            Tout marquer comme lu ({unread})
          </Button>
        }
      />

      {loading ? (
        <Card className="p-12 text-center text-sm text-muted">
          <Icons.RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-800 mb-2" />
          <span>Chargement des alertes…</span>
        </Card>
      ) : items.length === 0 ? (
        <EmptyState
          title="Aucune notification en attente"
          description="Votre exploitation est à jour. Les alertes d'irrigation, de diagnostic ou de météo s'afficheront ici."
          icon={<Icons.Bell className="w-6 h-6" />}
        />
      ) : (
        <div className="space-y-3">
          {items.map((n) => (
            <Card
              key={n.id}
              className={`transition-all duration-150 ${
                n.read
                  ? "opacity-75 border-border/60 bg-surface"
                  : "border-emerald-300/80 bg-emerald-50/20 shadow-sm"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-subtle border border-border/70 mt-0.5">
                    {getNotificationIcon(n.type)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={toneMap[n.type]}>{n.type.toUpperCase()}</Badge>
                      {!n.read ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                          Non lu
                        </span>
                      ) : null}
                      <span className="text-xs text-muted">{n.date}</span>
                    </div>
                    <h3 className="font-bold text-foreground text-sm">{n.title}</h3>
                    <p className="text-xs text-muted leading-relaxed max-w-xl">{n.message}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {!n.read ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={async () =>
                        setItems(await markNotificationRead(n.id, items))
                      }
                    >
                      Marquer lu
                    </Button>
                  ) : null}
                  {n.href ? (
                    <Link to={n.href}>
                      <Button variant="outline" size="sm" icon={<Icons.ArrowUpRight className="w-3.5 h-3.5" />}>
                        Consulter
                      </Button>
                    </Link>
                  ) : null}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
