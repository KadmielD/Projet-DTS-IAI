import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getNotifications, markNotificationRead } from "@/api/services";
import type { AppNotification } from "@/types";
import { EmptyState } from "@/components/Feedback";
import { Badge, Button, Card, PageHeader } from "@/components/ui";

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

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle="Alertes, meteo et resultats d'analyses"
        actions={
          <Button variant="outline" onClick={markAll} disabled={unread === 0}>
            Tout marquer comme lu ({unread})
          </Button>
        }
      />

      {loading ? (
        <p className="text-sm text-muted">Chargement…</p>
      ) : items.length === 0 ? (
        <EmptyState
          title="Aucune notification"
          description="Les alertes d'irrigation, diagnostics et meteo apparaitront ici."
        />
      ) : (
        <div className="space-y-3">
          {items.map((n) => (
            <Card
              key={n.id}
              className={n.read ? "opacity-80" : "border-primary/30"}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <Badge tone={toneMap[n.type]}>{n.type}</Badge>
                    {!n.read ? <Badge tone="warning">Non lu</Badge> : null}
                    <span className="text-xs text-muted">{n.date}</span>
                  </div>
                  <h2 className="font-semibold">{n.title}</h2>
                  <p className="mt-1 text-sm text-muted">{n.message}</p>
                </div>
                <div className="flex gap-2">
                  {!n.read ? (
                    <Button
                      variant="ghost"
                      onClick={async () =>
                        setItems(await markNotificationRead(n.id, items))
                      }
                    >
                      Marquer lu
                    </Button>
                  ) : null}
                  {n.href ? (
                    <Link to={n.href}>
                      <Button variant="outline">Ouvrir</Button>
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
