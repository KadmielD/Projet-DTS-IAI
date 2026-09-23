import { useId, useRef, useState } from "react";
import { Button } from "@/components/ui";
import { Icons } from "./icons";

interface PhotoUploadProps {
  label?: string;
  hint?: string;
  showPresets?: boolean;
  onChange?: (file: File | null, previewUrl: string | null) => void;
}

export function PhotoUpload({
  label = "Importer une photo de la culture ou du sol",
  hint = "Formats acceptés : JPG, PNG, WEBP jusqu'à 10 Mo — Prêt pour OpenAI Vision",
  showPresets = true,
  onChange,
}: PhotoUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const clear = () => {
    if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    setFileName(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
    onChange?.(null, null);
  };

  const handleFile = (file: File | null) => {
    if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    if (!file) {
      clear();
      return;
    }
    const url = URL.createObjectURL(file);
    setFileName(file.name);
    setPreview(url);
    onChange?.(file, url);
  };

  // Sample quick presets for easy testing without needing local image files
  const selectPreset = (name: string, dataSvgUrl: string) => {
    setFileName(name);
    setPreview(dataSvgUrl);
    // Create a mock File object
    const blob = new Blob(["mock-image-data"], { type: "image/jpeg" });
    const mockFile = new File([blob], name, { type: "image/jpeg" });
    onChange?.(mockFile, dataSvgUrl);
  };

  // Inline SVG data URLs for sample leaves
  const sampleMaizeLeaf = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240"><rect width="100%" height="100%" fill="%23064e3b"/><path d="M 40,200 C 140,50 260,30 360,40 C 280,140 180,210 40,200 Z" fill="%2310b981"/><path d="M 80,180 C 160,110 240,70 320,60" stroke="%23f59e0b" stroke-width="4" stroke-linecap="round"/><circle cx="160" cy="120" r="10" fill="%23d97706" opacity="0.8"/><circle cx="210" cy="95" r="8" fill="%23d97706" opacity="0.8"/><circle cx="260" cy="75" r="12" fill="%23b45309" opacity="0.8"/><circle cx="120" cy="150" r="7" fill="%23d97706" opacity="0.8"/><text x="20" y="30" fill="%23ecfdf5" font-size="12" font-weight="bold" font-family="system-ui">Échantillon : Feuille de Maïs (Symptôme de Rouille)</text></svg>`;

  const sampleTomatoLeaf = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240"><rect width="100%" height="100%" fill="%230f172a"/><path d="M 60,180 C 120,40 280,40 340,160 C 260,200 140,200 60,180 Z" fill="%23059669"/><circle cx="150" cy="130" r="14" fill="%2378350f" opacity="0.85"/><circle cx="230" cy="110" r="18" fill="%23451a03" opacity="0.85"/><circle cx="270" cy="140" r="10" fill="%2378350f" opacity="0.85"/><text x="20" y="30" fill="%23ffffff" font-size="12" font-weight="bold" font-family="system-ui">Échantillon : Feuille de Tomate (Taches foliaires)</text></svg>`;

  const sampleSoilSample = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240"><rect width="100%" height="100%" fill="%23451a03"/><path d="M 0,100 Q 100,80 200,110 T 400,90 L 400,240 L 0,240 Z" fill="%2378350f"/><circle cx="120" cy="150" r="16" fill="%2392400e"/><circle cx="280" cy="170" r="22" fill="%23b45309"/><circle cx="200" cy="190" r="12" fill="%2392400e"/><text x="20" y="30" fill="%23fef3c7" font-size="12" font-weight="bold" font-family="system-ui">Échantillon : Carottage de sol limono-argileux</text></svg>`;

  return (
    <div className="space-y-4">
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />

      <label
        htmlFor={inputId}
        className={`group relative flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-200 ${
          preview
            ? "border-emerald-600/40 bg-slate-900 text-white p-2"
            : "border-emerald-300/80 bg-emerald-50/30 hover:border-emerald-600 hover:bg-emerald-50/70 text-foreground px-6 py-12"
        }`}
      >
        {preview ? (
          <div className="relative w-full overflow-hidden rounded-xl">
            <img
              src={preview}
              alt="Aperçu photo"
              className="max-h-64 w-full rounded-xl object-cover"
            />
            {/* Animated Laser Scanning Line */}
            <div className="pointer-events-none absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-scan-laser" />

            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between rounded-lg bg-slate-950/80 px-3 py-1.5 text-xs backdrop-blur-md">
              <span className="truncate font-medium text-emerald-300">
                {fileName ?? "Image importée"}
              </span>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                <Icons.Check className="w-3.5 h-3.5" /> Prête
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-surface text-primary transition-transform duration-200 group-hover:scale-110 shadow-sm">
              <Icons.Camera className="h-7 w-7" />
            </div>
            <p className="text-sm font-bold text-foreground">
              {label}
            </p>
            <p className="mt-1 max-w-sm text-xs text-muted leading-relaxed">
              {hint}
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-emerald-300/80 bg-surface px-3 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm group-hover:bg-emerald-50">
              <Icons.Upload className="h-3.5 w-3.5" />
              Parcourir vos fichiers
            </span>
          </div>
        )}
      </label>

      {/* Preset Test Options */}
      {showPresets && !preview ? (
        <div className="rounded-xl border border-border/70 bg-surface-subtle/50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-2 flex items-center gap-1.5">
            <Icons.Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            Ou testez immédiatement avec un échantillon type :
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => selectPreset("echantillon_feuille_mais.jpg", sampleMaizeLeaf)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-surface px-2.5 py-1.5 text-xs font-medium text-foreground hover:border-emerald-600/40 hover:bg-emerald-50/60 cursor-pointer transition-colors"
            >
              🌽 Feuille de Maïs (Rouille)
            </button>
            <button
              type="button"
              onClick={() => selectPreset("echantillon_tomate_mildiou.jpg", sampleTomatoLeaf)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-surface px-2.5 py-1.5 text-xs font-medium text-foreground hover:border-emerald-600/40 hover:bg-emerald-50/60 cursor-pointer transition-colors"
            >
              🍅 Feuille de Tomate (Taches)
            </button>
            <button
              type="button"
              onClick={() => selectPreset("echantillon_sol_ndop.jpg", sampleSoilSample)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-surface px-2.5 py-1.5 text-xs font-medium text-foreground hover:border-emerald-600/40 hover:bg-emerald-50/60 cursor-pointer transition-colors"
            >
              🌱 Échantillon de Sol
            </button>
          </div>
        </div>
      ) : null}

      {fileName ? (
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
            icon={<Icons.Upload className="w-3.5 h-3.5" />}
          >
            Remplacer la photo
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clear}
            icon={<Icons.Trash className="w-3.5 h-3.5 text-red-500" />}
          >
            Supprimer
          </Button>
        </div>
      ) : null}
    </div>
  );
}
