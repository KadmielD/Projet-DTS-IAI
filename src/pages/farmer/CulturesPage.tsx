import { useEffect, useState } from "react";
import {
  createCulture,
  deleteCulture,
  getCultures,
  getExploitations,
  updateCulture,
} from "@/api/services";
import type { Culture, CultureStatus, Exploitation } from "@/types";
import { EmptyState } from "@/components/Feedback";
import {
  EditIcon,
  IconButton,
  Modal,
  TrashIcon,
} from "@/components/Modal";
import { Badge, Button, Card, Input, PageHeader } from "@/components/ui";
import { Icons } from "@/components/icons";

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

type CultureForm = {
  name: string;
  exploitationId: string;
  stage: string;
  startDate: string;
  endDate: string;
  status: CultureStatus;
};

const emptyForm = (exploitationId = ""): CultureForm => ({
  name: "",
  exploitationId,
  stage: "Plantation",
  startDate: new Date().toISOString().slice(0, 10),
  endDate: "",
  status: "en_cours",
});

const getCropPhoto = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("maïs") || n.includes("mais")) {
    return "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=120&q=80";
  }
  if (n.includes("haricot")) {
    return "https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=120&q=80";
  }
  if (n.includes("tomate")) {
    return "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=120&q=80";
  }
  return "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=120&q=80";
};

export default function CulturesPage() {
  const [cultures, setCultures] = useState<Culture[]>([]);
  const [farms, setFarms] = useState<Exploitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Culture | null>(null);
  const [form, setForm] = useState<CultureForm>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const reload = async () => {
    const [c, f] = await Promise.all([getCultures(), getExploitations()]);
    setCultures(c);
    setFarms(f);
  };

  useEffect(() => {
    reload().finally(() => setLoading(false));
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm(farms[0]?.id ?? ""));
    setError("");
    setModalOpen(true);
  };

  const openEdit = (culture: Culture) => {
    setEditing(culture);
    setForm({
      name: culture.name,
      exploitationId: culture.exploitationId,
      stage: culture.stage,
      startDate: culture.startDate,
      endDate: culture.endDate,
      status: culture.status,
    });
    setError("");
    setModalOpen(true);
  };

  const onDelete = async (culture: Culture) => {
    if (!confirm(`Supprimer définitivement la culture « ${culture.name} » ?`)) return;
    await deleteCulture(culture.id);
    await reload();
  };

  const onSave = async () => {
    if (
      !form.name.trim() ||
      !form.exploitationId ||
      !form.startDate ||
      !form.endDate
    ) {
      setError("Le nom, l'exploitation et les dates de cycle sont obligatoires.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        name: form.name.trim(),
        exploitationId: form.exploitationId,
        stage: form.stage.trim() || "Plantation",
        startDate: form.startDate,
        endDate: form.endDate,
        status: form.status,
      };
      if (editing) {
        await updateCulture(editing.id, payload);
      } else {
        await createCulture(payload);
      }
      await reload();
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Mes Cultures & Cycles Végétatifs"
        subtitle="Suivi des parcelles ensemencées, stades phénologiques et calendrier de récolte."
        actions={
          <Button
            onClick={openCreate}
            disabled={farms.length === 0}
            icon={<Icons.Plus className="w-4 h-4" />}
          >
            Ajouter une culture
          </Button>
        }
      />

      {loading ? (
        <Card className="p-12 text-center text-sm text-muted">
          <Icons.RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-800 mb-2" />
          <span>Chargement des cultures…</span>
        </Card>
      ) : cultures.length === 0 ? (
        <EmptyState
          title="Aucune culture enregistrée"
          description={
            farms.length === 0
              ? "Créez d'abord une exploitation agricole pour pouvoir y associer vos cultures."
              : "Ajoutez votre première culture pour démarrer le suivi agronomique."
          }
          action={
            farms.length > 0 ? (
              <Button onClick={openCreate} icon={<Icons.Plus className="w-4 h-4" />}>
                Ajouter une culture
              </Button>
            ) : null
          }
        />
      ) : (
        <>
          {/* Main Table View */}
          <div className="overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border/70 bg-surface-subtle/80 text-xs font-bold text-muted uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Culture</th>
                    <th className="px-5 py-3.5">Exploitation</th>
                    <th className="px-5 py-3.5">Stade Végétatif</th>
                    <th className="px-5 py-3.5">Période du Cycle</th>
                    <th className="px-5 py-3.5">Statut</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {cultures.map((c) => {
                    const farm = farms.find((e) => e.id === c.exploitationId);
                    return (
                      <tr
                        key={c.id}
                        className="hover:bg-surface-subtle/50 transition-colors"
                      >
                        <td className="px-5 py-4 font-bold text-foreground">
                          <div className="flex items-center gap-3">
                            <img
                              src={getCropPhoto(c.name)}
                              alt={c.name}
                              className="h-10 w-10 rounded-xl object-cover border border-emerald-200/80 shadow-xs"
                            />
                            <div>
                              <p className="font-bold text-foreground">{c.name}</p>
                              <p className="text-[11px] text-muted font-normal">{c.stage}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-muted text-xs">
                          {farm?.name ?? "—"}
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex rounded-lg bg-surface-subtle px-2.5 py-1 text-xs font-semibold text-foreground border border-border/70">
                            {c.stage}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-xs text-muted font-medium">
                          {c.startDate} → {c.endDate}
                        </td>
                        <td className="px-5 py-4">
                          <Badge tone={statusTone[c.status]} dot>
                            {statusLabel[c.status]}
                          </Badge>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <IconButton
                              label="Modifier"
                              variant="primary"
                              onClick={() => openEdit(c)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              label="Supprimer"
                              variant="danger"
                              onClick={() => onDelete(c)}
                            >
                              <TrashIcon />
                            </IconButton>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Active Crop Summary Cards */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">
              Cultures actuellement en production :
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              {cultures
                .filter((c) => c.status === "en_cours")
                .map((c) => (
                  <Card key={c.id} hover className="flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={getCropPhoto(c.name)}
                            alt={c.name}
                            className="h-10 w-10 rounded-xl object-cover border border-emerald-200/80 shadow-xs"
                          />
                          <div>
                            <h4 className="font-bold text-foreground text-sm">{c.name}</h4>
                            <p className="text-[11px] text-muted">Stade : <strong className="text-foreground">{c.stage}</strong></p>
                          </div>
                        </div>
                        <Badge tone="success">En cours</Badge>
                      </div>
                      <p className="text-[11px] text-muted mt-2">Période : {c.startDate} → {c.endDate}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/60 flex justify-end gap-1">
                      <IconButton
                        label="Modifier"
                        variant="primary"
                        onClick={() => openEdit(c)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        label="Supprimer"
                        variant="danger"
                        onClick={() => onDelete(c)}
                      >
                        <TrashIcon />
                      </IconButton>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        </>
      )}

      {/* Modal Form */}
      <Modal
        open={modalOpen}
        title={editing ? "Modifier la culture" : "Ajouter une culture"}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Annuler
            </Button>
            <Button size="sm" onClick={onSave} disabled={saving}>
              {saving ? "Enregistrement…" : editing ? "Enregistrer" : "Ajouter la culture"}
            </Button>
          </>
        }
      >
        <Input
          label="Nom de la culture végétale"
          value={form.name}
          onChange={(v) => setForm((f) => ({ ...f, name: v }))}
          placeholder="Ex : Maïs hybride jaune"
          required
        />
        <label className="block space-y-1.5 text-left">
          <span className="text-xs font-semibold text-foreground/90 uppercase tracking-wide">
            Exploitation de rattachement *
          </span>
          <select
            value={form.exploitationId}
            onChange={(e) =>
              setForm((f) => ({ ...f, exploitationId: e.target.value }))
            }
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10"
          >
            {farms.map((farm) => (
              <option key={farm.id} value={farm.id}>
                {farm.name} ({farm.location})
              </option>
            ))}
          </select>
        </label>
        <Input
          label="Stade phénologique"
          value={form.stage}
          onChange={(v) => setForm((f) => ({ ...f, stage: v }))}
          placeholder="Ex : Floraison, Semis, Remplissage grain"
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Date de début / semis"
            type="date"
            value={form.startDate}
            onChange={(v) => setForm((f) => ({ ...f, startDate: v }))}
            required
          />
          <Input
            label="Date estimée de récolte"
            type="date"
            value={form.endDate}
            onChange={(v) => setForm((f) => ({ ...f, endDate: v }))}
            required
          />
        </div>
        <label className="block space-y-1.5 text-left">
          <span className="text-xs font-semibold text-foreground/90 uppercase tracking-wide">
            Statut cultural
          </span>
          <select
            value={form.status}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                status: e.target.value as CultureStatus,
              }))
            }
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10"
          >
            <option value="en_cours">En cours</option>
            <option value="planifiee">Planifiée</option>
            <option value="recoltee">Récoltée</option>
          </select>
        </label>
        {error ? (
          <p className="text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
            {error}
          </p>
        ) : null}
      </Modal>
    </div>
  );
}
