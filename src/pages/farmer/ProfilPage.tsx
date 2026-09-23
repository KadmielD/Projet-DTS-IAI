import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Badge, Button, Card, Input, PageHeader } from "@/components/ui";
import { Icons } from "@/components/icons";

export default function ProfilPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [saved, setSaved] = useState(false);

  const onSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Profil de l'Agriculteur & Préférences"
        subtitle="Paramètres de votre compte exploitant, préférences agronomiques et certifications."
        actions={
          <Button onClick={onSave} icon={<Icons.Check className="w-4 h-4" />}>
            {saved ? "Modifications enregistrées" : "Enregistrer les modifications"}
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-12">
        {/* User Card */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="text-center p-6 space-y-4">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-800 text-white font-extrabold text-2xl shadow-lg ring-4 ring-emerald-100">
              {user?.name?.[0] ?? "J"}
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">{user?.name}</h2>
              <p className="text-xs text-muted">{user?.email}</p>
              <div className="mt-2.5 flex justify-center">
                <Badge tone="success" dot>Rôle : {user?.role}</Badge>
              </div>
            </div>

            <div className="pt-4 border-t border-border/60 text-xs text-muted space-y-2 text-left">
              <div className="flex justify-between">
                <span>Identifiant exploitant</span>
                <span className="font-mono font-bold text-foreground">AGRI-CM-7729</span>
              </div>
              <div className="flex justify-between">
                <span>Membre depuis</span>
                <span className="font-bold text-foreground">Janvier 2024</span>
              </div>
              <div className="flex justify-between">
                <span>Région d&apos;activité</span>
                <span className="font-bold text-foreground">Nord-Ouest, Cameroun</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Edit fields & preferences */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="space-y-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border/60 pb-3">
              <Icons.User className="w-4 h-4 text-emerald-800" />
              <span>Informations Générales</span>
            </h3>

            <div className="space-y-3.5">
              <Input
                label="Nom complet de l'exploitant"
                value={name}
                onChange={setName}
                icon={<Icons.User className="w-4 h-4" />}
              />
              <Input
                label="Adresse Email de notification"
                type="email"
                value={email}
                onChange={setEmail}
                icon={<Icons.User className="w-4 h-4" />}
              />
            </div>
          </Card>

          <Card className="space-y-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border/60 pb-3">
              <Icons.Settings className="w-4 h-4 text-emerald-800" />
              <span>Préférences Agronomiques & Régionales</span>
            </h3>

            <ul className="space-y-3 text-xs">
              <li className="flex items-center justify-between p-3 rounded-xl bg-surface-subtle/50 border border-border/60">
                <div>
                  <p className="font-bold text-foreground">Alertes météo par SMS / Push</p>
                  <p className="text-muted">Avertissements en cas d&apos;orage violent ou sécheresse</p>
                </div>
                <Badge tone="success">Activé</Badge>
              </li>
              <li className="flex items-center justify-between p-3 rounded-xl bg-surface-subtle/50 border border-border/60">
                <div>
                  <p className="font-bold text-foreground">Langue de l&apos;interface</p>
                  <p className="text-muted">Français (Cameroun)</p>
                </div>
                <Badge>Français</Badge>
              </li>
              <li className="flex items-center justify-between p-3 rounded-xl bg-surface-subtle/50 border border-border/60">
                <div>
                  <p className="font-bold text-foreground">Unités de mesure surfacique</p>
                  <p className="text-muted">Hectares (ha) & Kilogrammes (kg)</p>
                </div>
                <Badge>Métrique (ha)</Badge>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
