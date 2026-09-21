import { useId, useRef, useState } from "react";
import { Button } from "@/components/ui";

interface PhotoUploadProps {
  label?: string;
  hint?: string;
  onChange?: (file: File | null, previewUrl: string | null) => void;
}

export function PhotoUpload({
  label = "Importer une photo",
  hint = "JPG ou PNG, max 10 Mo — prepare pour OpenAI Vision",
  onChange,
}: PhotoUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const clear = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFileName(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
    onChange?.(null, null);
  };

  const handleFile = (file: File | null) => {
    if (preview) URL.revokeObjectURL(preview);
    if (!file) {
      clear();
      return;
    }
    const url = URL.createObjectURL(file);
    setFileName(file.name);
    setPreview(url);
    onChange?.(file, url);
  };

  return (
    <div className="space-y-3">
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
        className="flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 px-4 py-10 text-primary transition-colors hover:bg-primary/10"
      >
        {preview ? (
          <img
            src={preview}
            alt="Apercu"
            className="mb-3 max-h-40 rounded-lg object-contain"
          />
        ) : (
          <svg
            className="mb-2 h-10 w-10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden
          >
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        )}
        <span className="font-semibold">
          {fileName ? fileName : label}
        </span>
        <span className="mt-1 text-center text-xs text-muted">{hint}</span>
      </label>

      {fileName ? (
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
            Remplacer
          </Button>
          <Button type="button" variant="ghost" onClick={clear}>
            Supprimer
          </Button>
        </div>
      ) : null}
    </div>
  );
}
