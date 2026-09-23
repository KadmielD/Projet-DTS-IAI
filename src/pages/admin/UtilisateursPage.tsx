import { useMemo, useState } from "react";
import { mockUsers } from "@/api/mock";
import type { Role, User, UserStatus } from "@/types";
import { Badge, Button, Card, Input, PageHeader } from "@/components/ui";
import { Icons } from "@/components/icons";

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
    <div className="space-y-6 text-left">
      <PageHeader
        title="Gestion des Comptes & Rôles"
        subtitle="Contrôle des accès exploitants, techniciens agronomiques et administrateurs."
        actions={
          <Button
            onClick={() => setShowForm((v) => !v)}
            icon={<Icons.Plus className="w-4 h-4" />}
          >
            {showForm ? "Fermer le formulaire" : "Nouvel Utilisateur"}
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-[240px] flex-1">
          <Input
            label="Rechercher un exploitant"
            value={query}
            onChange={setQuery}
            placeholder="Nom, prénom ou adresse email…"
            icon={<Icons.Search className="w-4 h-4" />}
          />
        </div>

        <label className="block space-y-1.5 text-left">
          <span className="text-xs font-semibold text-foreground/90 uppercase tracking-wide">
            Filtrer par rôle
          </span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as Role | "all")}
            className="rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10"
          >
            <option value="all">Tous les rôles</option>
            <option value="agriculteur">Agriculteur</option>
            <option value="technicien">Technicien</option>
            <option value="admin">Administrateur</option>
          </select>
        </label>
      </div>

      {showForm ? (
        <Card className="border-emerald-300 bg-emerald-50/30">
          <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
            <Icons.User className="w-4 h-4 text-emerald-800" />
            <span>Ajouter un utilisateur sur la plateforme</span>
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <Input
              label="Nom complet"
              value={name}
              onChange={setName}
              placeholder="Ex : Amina Ngo"
            />
            <Input
              label="Adresse Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="amina@ferme.cm"
            />
            <label className="block space-y-1.5 text-left">
              <span className="text-xs font-semibold text-foreground/90 uppercase tracking-wide">
                Rôle attribué
              </span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10"
              >
                <option value="agriculteur">Agriculteur</option>
                <option value="technicien">Technicien</option>
                <option value="admin">Administrateur</option>
              </select>
            </label>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={addUser} icon={<Icons.Check className="w-4 h-4" />}>
              Valider l&apos;enregistrement
            </Button>
          </div>
        </Card>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Users Table */}
        <div className="overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-sm lg:col-span-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border/70 bg-surface-subtle/80 text-xs font-bold text-muted uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Utilisateur</th>
                  <th className="px-5 py-3.5">Email</th>
                  <th className="px-5 py-3.5">Rôle</th>
                  <th className="px-5 py-3.5">Statut</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-surface-subtle/40 transition-colors"
                  >
                    <td className="px-5 py-3.5 font-bold text-foreground">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-800 text-xs font-bold text-white uppercase">
                          {u.name[0]}
                        </div>
                        <span>{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted">{u.email}</td>
                    <td className="px-5 py-3.5">
                      <select
                        value={u.role}
                        onChange={(e) =>
                          changeRole(u.id, e.target.value as Role)
                        }
                        className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-medium text-foreground outline-none focus:border-emerald-600"
                      >
                        <option value="agriculteur">Agriculteur</option>
                        <option value="technicien">Technicien</option>
                        <option value="admin">Administrateur</option>
                      </select>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge
                        tone={u.status === "actif" ? "success" : "neutral"}
                        dot
                      >
                        {u.status === "actif" ? "Actif" : "Inactif"}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          className="text-xs font-bold text-sky-700 hover:underline cursor-pointer"
                          onClick={() => setSelectedId(u.id)}
                        >
                          Fiche
                        </button>
                        <button
                          type="button"
                          className={`text-xs font-bold cursor-pointer hover:underline ${
                            u.status === "actif" ? "text-amber-700" : "text-emerald-800"
                          }`}
                          onClick={() => toggleStatus(u.id)}
                        >
                          {u.status === "actif" ? "Suspendre" : "Activer"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Summary Sidebar */}
        <div className="lg:col-span-4">
          <Card className="h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 border-b border-border/60 pb-3 mb-4">
                <Icons.User className="w-5 h-5 text-emerald-800" />
                <h3 className="font-bold text-foreground">Détail du Compte</h3>
              </div>

              {selected ? (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-800 text-white font-extrabold text-base">
                      {selected.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-base text-foreground">{selected.name}</p>
                      <p className="text-muted">{selected.email}</p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border/60 bg-surface-subtle/50 p-3 space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-muted">Statut compte</span>
                      <Badge tone={selected.status === "actif" ? "success" : "neutral"} dot>
                        {selected.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Date d&apos;inscription</span>
                      <span className="font-bold text-foreground">{selected.createdAt}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Dernière connexion</span>
                      <span className="font-bold text-foreground">Aujourd&apos;hui</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold uppercase tracking-wider text-muted mb-2">
                      Activités récentes de l&apos;utilisateur :
                    </h4>
                    <ul className="space-y-1.5 text-muted list-disc pl-4 leading-relaxed">
                      <li>3 diagnostics foliaires analysés</li>
                      <li>1 analyse de sol enregistrée</li>
                      <li>2 prédictions de rendement consultées</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted py-10 text-center leading-relaxed">
                  Cliquez sur « Fiche » sur l&apos;une des lignes du tableau pour inspecter l&apos;activité d&apos;un exploitant ou technicien.
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-border/60 text-[11px] text-muted">
              Rôle Admin : vous pouvez changer les permissions en temps réel.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
