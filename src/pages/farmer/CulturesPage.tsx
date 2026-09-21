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

const statusLabel: Record<CultureStatus, string> = {
  en_cours: "En cours",
  planifiee: "Planifiee",
  recoltee: "Recoltee",
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
    if (!confirm(`Supprimer la culture « ${culture.name} » ?`)) return;
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
      setError("Nom, exploitation et dates sont obligatoires.");
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
    <div>
      <PageHeader
        title="Mes cultures"
        subtitle="Ajouter, modifier ou supprimer vos cultures"
        actions={
          <Button onClick={openCreate} disabled={farms.length === 0}>
            + Ajouter
          </Button>
        }
      />

      {loading ? (
        <p className="text-sm text-muted">Chargement…</p>
      ) : cultures.length === 0 ? (
        <EmptyState
          title="Aucune culture"
          description={
            farms.length === 0
              ? "Creez d'abord une exploitation."
              : "Ajoutez votre premiere culture."
          }
          action={
            farms.length > 0 ? (
              <Button onClick={openCreate}>Ajouter une culture</Button>
            ) : null
          }
        />
      ) : (
        <>
          <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-background text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Culture</th>
                  <th className="px-4 py-3 font-medium">Exploitation</th>
                  <th className="px-4 py-3 font-medium">Stade</th>
                  <th className="px-4 py-3 font-medium">Periode</th>
                  <th className="px-4 py-3 font-medium">Statut</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cultures.map((c) => {
                  const farm = farms.find((e) => e.id === c.exploitationId);
                  return (
                    <tr
                      key={c.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-4 py-3 font-medium">{c.name}</td>
                      <td className="px-4 py-3 text-muted">{farm?.name}</td>
                      <td className="px-4 py-3">{c.stage}</td>
                      <td className="px-4 py-3 text-muted">
                        {c.startDate} → {c.endDate}
                      </td>
                      <td className="px-4 py-3">
                        <Badge tone={statusTone[c.status]}>
                          {statusLabel[c.status]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
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

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {cultures
              .filter((c) => c.status === "en_cours")
              .map((c) => (
                <Card key={c.id}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-primary">{c.name}</p>
                      <p className="text-sm text-muted">{c.stage}</p>
                    </div>
                    <div className="flex gap-1">
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
                  </div>
                </Card>
              ))}
          </div>
        </>
      )}

      <Modal
        open={modalOpen}
        title={editing ? "Modifier la culture" : "Ajouter une culture"}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={onSave} disabled={saving}>
              {saving ? "Enregistrement…" : editing ? "Enregistrer" : "Ajouter"}
            </Button>
          </>
        }
      >
        <Input
          label="Nom de la culture"
          value={form.name}
          onChange={(v) => setForm((f) => ({ ...f, name: v }))}
          required
        />
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-foreground">
            Exploitation
          </span>
          <select
            value={form.exploitationId}
            onChange={(e) =>
              setForm((f) => ({ ...f, exploitationId: e.target.value }))
            }
            className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2"
          >
            {farms.map((farm) => (
              <option key={farm.id} value={farm.id}>
                {farm.name}
              </option>
            ))}
          </select>
        </label>
        <Input
          label="Stade"
          value={form.stage}
          onChange={(v) => setForm((f) => ({ ...f, stage: v }))}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Date debut"
            type="date"
            value={form.startDate}
            onChange={(v) => setForm((f) => ({ ...f, startDate: v }))}
            required
          />
          <Input
            label="Date fin"
            type="date"
            value={form.endDate}
            onChange={(v) => setForm((f) => ({ ...f, endDate: v }))}
            required
          />
        </div>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-foreground">Statut</span>
          <select
            value={form.status}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                status: e.target.value as CultureStatus,
              }))
            }
            className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2"
          >
            <option value="en_cours">En cours</option>
            <option value="planifiee">Planifiee</option>
            <option value="recoltee">Recoltee</option>
          </select>
        </label>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </Modal>
    </div>
  );
}
