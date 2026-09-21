import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Badge, Card, Input, PageHeader } from "@/components/ui";

export default function ProfilPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  return (
    <div>
      <PageHeader
        title="Profil"
        subtitle="Informations du compte et préférences"
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold">Compte</h2>
          <div className="mt-4 space-y-3">
            <Input label="Nom" value={name} onChange={setName} />
            <Input label="Email" value={email} onChange={setEmail} />
            <div className="flex items-center gap-2 text-sm">
              Rôle : <Badge tone="success">{user?.role}</Badge>
            </div>
          </div>
        </Card>
        <Card>
          <h2 className="font-semibold">Préférences</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center justify-between">
              <span>Notifications email</span>
              <Badge tone="info">Activé</Badge>
            </li>
            <li className="flex items-center justify-between">
              <span>Langue</span>
              <Badge>Français</Badge>
            </li>
            <li className="flex items-center justify-between">
              <span>Unité de surface</span>
              <Badge>Hectares</Badge>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
