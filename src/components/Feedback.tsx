import type { ReactNode } from "react";
import { Icons } from "./icons";

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/90 bg-surface px-6 py-14 text-center">
      <div className="mb-3.5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-surface text-primary">
        {icon ?? <Icons.Sprout className="h-6 w-6" />}
      </div>
      <p className="text-base font-bold text-foreground">{title}</p>
      {description ? (
        <p className="mt-1.5 max-w-sm text-sm text-muted leading-relaxed">{description}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
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
    <div className="mb-8 overflow-x-auto pb-2">
      <ol className="flex items-center gap-3 min-w-max">
        {steps.map((label, index) => {
          const step = index + 1;
          const isDone = step < current;
          const isCurrent = step === current;

          return (
            <li key={label} className="flex items-center gap-3">
              <div
                className={`flex items-center gap-2.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-150 ${
                  isCurrent
                    ? "bg-emerald-800 text-white shadow-sm shadow-emerald-950/20"
                    : isDone
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200/60"
                      : "bg-surface text-muted border border-border/80"
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                    isCurrent
                      ? "bg-white text-emerald-800"
                      : isDone
                        ? "bg-emerald-600 text-white"
                        : "bg-muted/20 text-muted"
                  }`}
                >
                  {isDone ? <Icons.Check className="w-3 h-3 stroke-[3]" /> : step}
                </span>
                <span>{label}</span>
              </div>
              {step < steps.length ? (
                <div className="h-0.5 w-6 rounded-full bg-border" />
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function MapPlaceholder({
  title,
  subtitle,
  areaHa = 12.5,
}: {
  title: string;
  subtitle?: string;
  areaHa?: number;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-slate-900 text-white shadow-inner">
      {/* Simulated Satellite Terrain Base */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(#10b981 0.75px, transparent 0.75px), radial-gradient(#059669 0.75px, #0f172a 0.75px)",
          backgroundSize: "28px 28px",
          backgroundPosition: "0 0, 14px 14px",
        }}
      />

      {/* SVG Vector Parcels Simulation */}
      <svg
        className="absolute inset-0 h-full w-full pointer-events-none opacity-85"
        viewBox="0 0 600 300"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="parcelMaize" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="parcelBeans" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="parcelCassava" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Contour lines */}
        <path d="M 0,90 Q 200,60 400,120 T 600,100" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3,3" />
        <path d="M 0,180 Q 250,140 450,220 T 600,190" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3,3" />

        {/* Parcels */}
        <polygon points="40,40 220,50 250,190 70,170" fill="url(#parcelMaize)" stroke="#10b981" strokeWidth="1.5" />
        <polygon points="260,55 460,70 430,195 270,190" fill="url(#parcelBeans)" stroke="#38bdf8" strokeWidth="1.5" />
        <polygon points="120,200 380,210 340,280 90,270" fill="url(#parcelCassava)" stroke="#f59e0b" strokeWidth="1.5" />

        {/* Centroid labels */}
        <text x="130" y="115" fill="#ecfdf5" fontSize="11" fontWeight="bold" fontFamily="system-ui">
          Parcelle A — Maïs (6.2 ha)
        </text>
        <text x="310" y="125" fill="#f0f9ff" fontSize="11" fontWeight="bold" fontFamily="system-ui">
          Parcelle B — Haricot (4.1 ha)
        </text>
        <text x="210" y="245" fill="#fffbeb" fontSize="11" fontWeight="bold" fontFamily="system-ui">
          Parcelle C — Manioc (2.2 ha)
        </text>
      </svg>

      {/* Floating HUD info */}
      <div className="relative z-10 flex min-h-[240px] flex-col justify-between p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <p className="text-xs font-bold text-white tracking-wide">{title}</p>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">{subtitle}</p>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-900/80 px-2.5 py-1 text-[11px] font-mono text-emerald-400 backdrop-blur-md">
            <Icons.MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>NDVI Santé : 0.82 (Excellente)</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="inline-block h-2 w-2 rounded-sm bg-emerald-500" />
            <span>Végétation optimale</span>
            <span className="inline-block h-2 w-2 rounded-sm bg-amber-500 ml-2" />
            <span>Stress hydrique modéré</span>
          </div>

          <div className="rounded-md bg-white/10 px-2.5 py-1 text-[10px] font-mono text-slate-300">
            Superficie totale cartographiée : <strong className="text-white">{areaHa} ha</strong>
          </div>
        </div>
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
  const getIcon = (condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes("pluie") || c.includes("orage")) {
      return <Icons.CloudRain className="w-5 h-5 text-sky-500" />;
    }
    if (c.includes("soleil") || c.includes("clair")) {
      return <Icons.Sun className="w-5 h-5 text-amber-500" />;
    }
    return <Icons.Sun className="w-5 h-5 text-amber-400" />;
  };

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
      {days.map((d) => (
        <div
          key={d.label}
          className="flex flex-col items-center justify-between rounded-xl border border-border/80 bg-surface p-3 text-center transition-all duration-150 hover:border-emerald-600/30 hover:bg-surface-subtle"
        >
          <p className="text-xs font-semibold text-muted">{d.label}</p>
          <div className="my-2.5">{getIcon(d.condition)}</div>
          <p className="text-xs font-bold text-foreground">
            {d.tempMax}° <span className="text-muted font-normal">/ {d.tempMin}°</span>
          </p>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-sky-700">
            <Icons.Droplet className="w-3 h-3 text-sky-500" />
            <span>{d.precipMm} mm</span>
          </div>
        </div>
      ))}
    </div>
  );
}
