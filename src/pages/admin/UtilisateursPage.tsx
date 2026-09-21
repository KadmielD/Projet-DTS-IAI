import { useMemo, useState } from "react";
import { mockUsers } from "@/api/mock";
import type { Role, User, UserStatus } from "@/types";
import { Badge, Button, Card, Input, PageHeader } from "@/components/ui";

export default function UtilisateursPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("agriculteur");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchQuery =
        u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.email.toLowerCase().includes(query.toLowerCase());
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      return matchQuery && matchRole;
    });
  }, [users, query, roleFilter]);

  const selected = users.find((u) => u.id === selectedId);

  const toggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              status: (u.status === "actif" ? "inactif" : "actif") as UserStatus,
            }
          : u,
      ),
    );
  };

  const changeRole = (id: string, next: Role) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: next } : u)),
    );
  };

  const addUser = () => {
    if (!name.trim() || !email.trim()) return;
    setUsers((prev) => [
      {
        id: `u-${Date.now()}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
        status: "actif",
        createdAt: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
    setName("");
    setEmail("");
    setShowForm(false);
  };

  return (
    <div>
      <PageHeader
        title="Utilisateurs"
        subtitle="Gestion des comptes et des rôles"
        actions={
          <Button onClick={() => setShowForm((v) => !v)}>+ Ajouter</Button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="min-w-[220px] flex-1">
          <Input
            label="Recherche"
            value={query}
            onChange={setQuery}
            placeholder="Nom ou email…"
          />
        </div>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Rôle</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as Role | "all")}
            className="block rounded-lg border border-border bg-surface px-3 py-2.5 text-sm"
          >
            <option value="all">Tous</option>
            <option value="agriculteur">Agriculteur</option>
            <option value="technicien">Technicien</option>
            <option value="admin">Administrateur</option>
          </select>
        </label>
      </div>

      {showForm ? (
        <Card className="mb-4">
          <h2 className="font-semibold">Nouvel utilisateur</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <Input label="Nom" value={name} onChange={setName} />
            <Input label="Email" value={email} onChange={setEmail} />
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Rôle</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="block w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm"
              >
                <option value="agriculteur">Agriculteur</option>
                <option value="technicien">Technicien</option>
                <option value="admin">Administrateur</option>
              </select>
            </label>
          </div>
          <Button className="mt-3" onClick={addUser}>
            Créer
          </Button>
        </Card>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm lg:col-span-2">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-background text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Nom</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Rôle</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-muted">{u.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role}
                      onChange={(e) =>
                        changeRole(u.id, e.target.value as Role)
                      }
                      className="rounded border border-border bg-surface px-2 py-1 text-xs"
                    >
                      <option value="agriculteur">Agriculteur</option>
                      <option value="technicien">Technicien</option>
                      <option value="admin">Administrateur</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      tone={u.status === "actif" ? "success" : "neutral"}
                    >
                      {u.status === "actif" ? "Actif" : "Inactif"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="text-xs font-semibold text-accent"
                        onClick={() => setSelectedId(u.id)}
                      >
                        Résumé
                      </button>
                      <button
                        type="button"
                        className="text-xs font-semibold text-primary"
                        onClick={() => toggleStatus(u.id)}
                      >
                        {u.status === "actif" ? "Désactiver" : "Activer"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Card>
          <h2 className="font-semibold">Résumé d&apos;activité</h2>
          {selected ? (
            <div className="mt-4 space-y-2 text-sm">
              <p className="text-lg font-bold">{selected.name}</p>
              <p className="text-muted">{selected.email}</p>
              <Badge tone="info">{selected.role}</Badge>
              <p className="pt-2 text-muted">
                Inscrit le {selected.createdAt}
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-muted">
                <li>3 diagnostics ce mois</li>
                <li>1 analyse de sol</li>
                <li>2 prédictions consultées</li>
              </ul>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">
              Sélectionnez un utilisateur pour voir un résumé (sans page
              Exploitations admin).
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
