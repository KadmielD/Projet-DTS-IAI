import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Icons } from "./icons";

export function PageHeader({
  title,
  subtitle,
  actions,
  badge,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  badge?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          {badge}
        </div>
        {subtitle ? (
          <p className="mt-1.5 text-sm text-muted font-normal leading-relaxed max-w-2xl">
            {subtitle}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">{actions}</div>
      ) : null}
    </div>
  );
}

export function Card({
  children,
  className = "",
  hover = false,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border border-border/80 bg-surface p-5 sm:p-6 shadow-[0_2px_8px_-2px_rgba(6,95,70,0.04),0_1px_3px_rgba(0,0,0,0.02)] transition-all duration-200 ${
        hover
          ? "hover:border-primary/30 hover:shadow-[0_8px_20px_-4px_rgba(6,95,70,0.08)] hover:-translate-y-0.5 cursor-pointer"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function KpiCard({
  label,
  value,
  hint,
  trend,
  icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  trend?: { value: string; positive?: boolean };
  icon?: ReactNode;
}) {
  return (
    <Card className="relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            {label}
          </p>
          <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl tabular-nums">
            {value}
          </p>
        </div>
        {icon ? (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-surface text-primary transition-transform duration-200 group-hover:scale-105">
            {icon}
          </div>
        ) : null}
      </div>

      <div className="mt-3.5 flex items-center gap-2 pt-2 border-t border-border/50 text-xs">
        {trend ? (
          <span
            className={`inline-flex items-center gap-1 font-semibold ${
              trend.positive !== false ? "text-emerald-600" : "text-amber-600"
            }`}
          >
            <Icons.TrendingUp className="w-3.5 h-3.5" />
            {trend.value}
          </span>
        ) : null}
        {hint ? <span className="text-muted truncate">{hint}</span> : null}
      </div>
    </Card>
  );
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  onClick,
  disabled,
  icon,
}: {
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost" | "danger" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  icon?: ReactNode;
}) {
  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5 rounded-lg",
    md: "px-4 py-2.5 text-sm gap-2 rounded-xl",
    lg: "px-5 py-3 text-base gap-2.5 rounded-xl",
  }[size];

  const variants = {
    primary:
      "bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white shadow-sm shadow-emerald-950/20 border border-emerald-900/20 active:scale-[0.98]",
    secondary:
      "bg-emerald-50 text-emerald-800 hover:bg-emerald-100/80 border border-emerald-200/60 active:scale-[0.98]",
    outline:
      "border border-border bg-surface text-foreground hover:bg-surface-subtle hover:border-emerald-600/30 active:scale-[0.98]",
    ghost:
      "text-foreground/80 hover:bg-surface-subtle hover:text-foreground active:scale-[0.98]",
    danger:
      "bg-red-600 text-white hover:bg-red-700 shadow-sm shadow-red-900/20 active:scale-[0.98]",
  }[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center font-medium transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${sizes} ${variants} ${className}`}
    >
      {icon ? <span className="shrink-0">{icon}</span> : null}
      {children}
    </button>
  );
}

export function Badge({
  children,
  tone = "neutral",
  dot = false,
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
  dot?: boolean;
}) {
  const tones = {
    neutral: "bg-slate-100 text-slate-700 border-slate-200/60",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200/60",
    warning: "bg-amber-50 text-amber-800 border-amber-200/60",
    danger: "bg-red-50 text-red-700 border-red-200/60",
    info: "bg-sky-50 text-sky-800 border-sky-200/60",
  }[tone];

  const dotTones = {
    neutral: "bg-slate-400",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
    info: "bg-sky-500",
  }[tone];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${tones}`}
    >
      {dot ? (
        <span className={`h-1.5 w-1.5 rounded-full ${dotTones}`} />
      ) : null}
      {children}
    </span>
  );
}

export function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  icon,
  hint,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  icon?: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block space-y-1.5 text-left">
      <span className="flex items-center justify-between text-xs font-semibold text-foreground/90 uppercase tracking-wide">
        <span>{label} {required ? <span className="text-emerald-700">*</span> : null}</span>
        {hint ? <span className="text-[11px] normal-case text-muted font-normal">{hint}</span> : null}
      </span>
      <div className="relative">
        {icon ? (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
            {icon}
          </div>
        ) : null}
        <input
          type={type}
          value={value}
          required={required}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-xl border border-border bg-surface py-2.5 text-sm text-foreground placeholder:text-muted/60 outline-none transition-all duration-150 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 ${
            icon ? "pl-10 pr-3.5" : "px-3.5"
          }`}
        />
      </div>
    </label>
  );
}

export function AppShell({
  sidebar,
  children,
}: {
  sidebar: ReactNode;
  children: ReactNode;
}) {
  const { user } = useAuth();
  const { pathname } = useLocation();

  // Compute page friendly name
  const getPageTitle = () => {
    if (pathname === "/app") return "Tableau de bord";
    if (pathname.startsWith("/app/exploitations")) return "Exploitations";
    if (pathname.startsWith("/app/cultures")) return "Cultures";
    if (pathname.startsWith("/app/planification")) return "Planification";
    if (pathname.startsWith("/app/diagnostic")) return "Diagnostic IA";
    if (pathname.startsWith("/app/predictions")) return "Prédictions";
    if (pathname.startsWith("/app/analyse-sol")) return "Analyse Sol";
    if (pathname.startsWith("/app/notifications")) return "Notifications";
    if (pathname.startsWith("/app/historique")) return "Historique";
    if (pathname.startsWith("/app/profil")) return "Profil";
    if (pathname === "/admin") return "Tableau de bord Admin";
    if (pathname.startsWith("/admin/utilisateurs")) return "Gestion Utilisateurs";
    if (pathname.startsWith("/admin/statistiques")) return "Statistiques Plateforme";
    if (pathname.startsWith("/admin/parametres")) return "Paramètres Plateforme";
    return "AgriIntelli";
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {sidebar}

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {/* Modern Topbar */}
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-border/80 bg-surface/90 px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted hidden sm:inline">
              AgriIntelli
            </span>
            <span className="text-muted/40 hidden sm:inline">/</span>
            <span className="text-sm font-semibold text-foreground">
              {getPageTitle()}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Context farm pill */}
            <div className="hidden md:flex items-center gap-2 rounded-full border border-emerald-200/60 bg-emerald-50/60 px-3 py-1 text-xs font-medium text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Ferme de Ndop (Cameroun)</span>
            </div>

            {/* Live Weather pill */}
            <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-border/70 bg-surface px-3 py-1 text-xs text-muted font-medium">
              <Icons.Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>26°C · Soleil partiel</span>
            </div>

            {/* Notifications Shortcut */}
            <Link
              to="/app/notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border/70 text-muted transition-colors hover:border-emerald-600/30 hover:bg-surface-subtle hover:text-foreground"
              title="Notifications"
            >
              <Icons.Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-surface" />
            </Link>

            {/* User chip */}
            <Link
              to="/app/profil"
              className="flex items-center gap-2.5 rounded-xl border border-border/70 bg-surface p-1.5 pr-3 transition-colors hover:border-emerald-600/30 hover:bg-surface-subtle"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-800 text-xs font-bold text-white uppercase">
                {user?.name?.[0] ?? "U"}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-xs font-semibold leading-none text-foreground">
                  {user?.name ?? "Utilisateur"}
                </p>
                <p className="text-[10px] text-muted capitalize leading-tight mt-0.5">
                  {user?.role ?? "Visiteur"}
                </p>
              </div>
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="min-h-0 flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
