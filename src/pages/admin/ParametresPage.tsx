import { useState } from "react";
import { defaultSettings } from "@/api/mock";
import { Badge, Button, Card, Input, PageHeader } from "@/components/ui";
import { Icons } from "@/components/icons";

export default function ParametresPage() {
  const [threshold, setThreshold] = useState(
    String(defaultSettings.alertThresholdYield),
  );
  const [maintenance, setMaintenance] = useState(
    defaultSettings.maintenanceMode,
  );
  const [modules, setModules] = useState(defaultSettings.modulesEnabled);
  const [legal, setLegal] = useState(defaultSettings.legalNotice);
  const [saved, setSaved] = useState(false);

  const toggleModule = (key: keyof typeof modules) => {
    setModules((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const onSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Configuration & Paramètres Plateforme"
        subtitle="Réglez les seuils d'alerte agronomiques, le mode maintenance et l'activation des modules IA."
        actions={
          <Button onClick={onSave} icon={<Icons.Check className="w-4 h-4" />}>
            {saved ? "Paramètres enregistrés" : "Enregistrer la configuration"}
          </Button>
        }
      />

      {saved ? (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800 shadow-sm">
          <Icons.Check className="w-4 h-4 text-emerald-700" />
          <span>Configuration AgriIntelli mise à jour avec succès sur l&apos;ensemble des nœuds.</span>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Thresholds and Maintenance */}
        <div className="lg:col-span-6 space-y-4">
          <Card className="h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 border-b border-border/60 pb-3 mb-5">
                <Icons.Settings className="w-5 h-5 text-emerald-800" />
                <h2 className="text-base font-bold text-foreground">
                  Seuils & Mode Maintenance
                </h2>
              </div>

              <div className="space-y-4">
                <Input
                  label="Seuil d'alerte de baisse de rendement (t/ha)"
                  value={threshold}
                  onChange={setThreshold}
                  placeholder="Ex : 2.0"
                  hint="Déclenche une notification d'urgence si la prédiction passe sous cette valeur"
                />

                <div className="pt-2">
                  <span className="block text-xs font-semibold text-foreground/90 uppercase tracking-wide mb-1.5">
                    État du service
                  </span>
                  <button
                    type="button"
                    onClick={() => setMaintenance((v) => !v)}
                    className="flex w-full items-center justify-between rounded-xl border border-border/80 bg-surface px-4 py-3.5 text-xs font-semibold hover:bg-surface-subtle transition-colors cursor-pointer"
                  >
                    <div>
                      <p className="font-bold text-foreground text-sm">Mode Maintenance</p>
                      <p className="text-muted font-normal">Restreindre temporairement l&apos;accès public</p>
                    </div>
                    <Badge tone={maintenance ? "warning" : "success"} dot>
                      {maintenance ? "Maintenance Active" : "Opérationnel (En ligne)"}
                    </Badge>
                  </button>
                </div>
              </div>
            </div>

            <p className="mt-6 pt-3 border-t border-border/60 text-xs text-muted">
              Les modifications de seuils s&apos;appliquent immédiatement aux calculs des modèles.
            </p>
          </Card>
        </div>

        {/* Feature Flags / Module activations */}
        <div className="lg:col-span-6 space-y-4">
          <Card className="h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 border-b border-border/60 pb-3 mb-5">
                <Icons.Sparkles className="w-5 h-5 text-emerald-800" />
                <h2 className="text-base font-bold text-foreground">
                  Activation des Moteurs IA
                </h2>
              </div>

              <ul className="space-y-2.5">
                {(
                  [
                    ["diagnostic", "Diagnostic Phytosanitaire Vision IA", "Réseau neuronal convolutif"],
                    ["prediction", "Prédictions de Rendement ML", "Modèle régression climatique"],
                    ["soilAnalysis", "Analyse & Équilibre du Sol NPK", "Calculateur d'amendements"],
                    ["planning", "Planification & Météo Open-Meteo", "Gantt et synchronisation"],
                  ] as const
                ).map(([key, label, desc]) => (
                  <li key={key}>
                    <button
                      type="button"
                      onClick={() => toggleModule(key)}
                      className="flex w-full items-center justify-between rounded-xl border border-border/60 bg-surface-subtle/50 px-4 py-3 text-xs transition-colors hover:bg-surface-subtle cursor-pointer"
                    >
                      <div className="text-left">
                        <p className="font-bold text-foreground">{label}</p>
                        <p className="text-muted">{desc}</p>
                      </div>
                      <Badge tone={modules[key] ? "success" : "neutral"} dot>
                        {modules[key] ? "Activé" : "Désactivé"}
                      </Badge>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-6 pt-3 border-t border-border/60 text-xs text-muted">
              Désactiver un module masque son accès dans la barre latérale des agriculteurs.
            </p>
          </Card>
        </div>

        {/* Legal notice */}
        <div className="lg:col-span-12">
          <Card>
            <div className="flex items-center gap-2 border-b border-border/60 pb-3 mb-3">
              <Icons.ShieldCheck className="w-5 h-5 text-emerald-800" />
              <h2 className="text-base font-bold text-foreground">
                Mentions Légales & Avertissement de Non-Responsabilité Agronomique
              </h2>
            </div>
            <textarea
              value={legal}
              onChange={(e) => setLegal(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 leading-relaxed font-sans"
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
