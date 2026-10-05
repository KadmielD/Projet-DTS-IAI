import type { MouseEvent, ReactNode } from "react";
import { Icons } from "./icons";

export function Modal({
  open,
  title,
  onClose,
  children,
  footer,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-lg rounded-2xl border border-border/80 bg-surface p-6 shadow-2xl transition-all duration-200"
      >
        <div className="mb-5 flex items-center justify-between gap-3 border-b border-border/60 pb-3">
          <h2 className="text-lg font-bold tracking-tight text-foreground">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-subtle hover:text-foreground"
            aria-label="Fermer"
          >
            <Icons.X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">{children}</div>

        {footer ? (
          <div className="mt-6 flex justify-end gap-2.5 border-t border-border/60 pt-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function IconButton({
  label,
  variant = "neutral",
  onClick,
  children,
}: {
  label: string;
  variant?: "neutral" | "danger" | "primary";
  onClick: (e: MouseEvent) => void;
  children: ReactNode;
}) {
  const styles = {
    neutral:
      "border-border/80 text-foreground hover:bg-surface-subtle hover:border-emerald-600/30",
    primary:
      "border-emerald-200 bg-emerald-50/70 text-emerald-800 hover:bg-emerald-100",
    danger:
      "border-red-200 bg-red-50/70 text-red-600 hover:bg-red-100/80 hover:text-red-700",
  }[variant];

  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border text-sm transition-all duration-150 cursor-pointer ${styles}`}
    >
      {children}
    </button>
  );
}

export function EditIcon() {
  return <Icons.Edit className="h-4 w-4" />;
}

export function TrashIcon() {
  return <Icons.Trash className="h-4 w-4" />;
}
