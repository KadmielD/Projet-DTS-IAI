import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface px-6 py-14 text-center">
      <p className="text-lg font-semibold text-foreground">{title}</p>
      {description ? (
        <p className="mt-2 max-w-md text-sm text-muted">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function Stepper({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) {
  return (
    <ol className="mb-6 flex flex-wrap items-center gap-2">
      {steps.map((label, index) => {
        const step = index + 1;
        const active = step <= current;
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                active ? "bg-primary text-white" : "bg-background text-muted"
              }`}
            >
              {step}
            </span>
            <span
              className={`text-sm ${active ? "font-medium text-foreground" : "text-muted"}`}
            >
              {label}
            </span>
            {step < steps.length ? (
              <span className="mx-1 hidden h-px w-6 bg-border sm:block" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

export function MapPlaceholder({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-[#e8f0e9]">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(#c8dcc9 1px, transparent 1px), linear-gradient(90deg, #c8dcc9 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative flex min-h-[160px] flex-col items-center justify-center p-6 text-center">
        <span className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
            <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
          </svg>
        </span>
        <p className="font-semibold text-primary">{title}</p>
        <p className="mt-1 text-xs text-muted">
          {subtitle ?? "Emplacement reserve pour Google Maps API"}
        </p>
      </div>
    </div>
  );
}

export function WeatherStrip({
  days,
}: {
  days: {
    label: string;
    tempMax: number;
    tempMin: number;
    precipMm: number;
    condition: string;
  }[];
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
      {days.map((d) => (
        <div
          key={d.label}
          className="rounded-lg border border-border bg-surface px-3 py-3 text-center"
        >
          <p className="text-xs font-medium text-muted">{d.label}</p>
          <p className="my-1 text-xs font-semibold uppercase tracking-wide text-accent">
            {d.condition}
          </p>
          <p className="text-sm font-semibold">
            {d.tempMax}° / {d.tempMin}°
          </p>
          <p className="text-xs text-muted">{d.precipMm} mm</p>
        </div>
      ))}
    </div>
  );
}
