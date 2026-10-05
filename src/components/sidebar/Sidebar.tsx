import type { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import { useAuth } from "@/hooks/useAuth";
import { Icons } from "@/components/icons";

export interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
  badge?: string | number;
}

export function Sidebar({
  items,
  title,
}: {
  items: NavItem[];
  title: string;
}) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sticky top-0 z-20 flex h-screen w-64 shrink-0 flex-col overflow-hidden border-r border-border/80 bg-surface">
      {/* Brand Header */}
      <div className="flex items-center gap-3 border-b border-border/80 px-5 py-4">
        <div className="relative">
          <img
            src={logo}
            alt="AgriIntelli"
            className="h-10 w-10 object-contain drop-shadow-sm"
          />
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-surface" />
        </div>
        <div className="min-w-0">
          <p className="text-base font-bold tracking-tight leading-tight">
            <span className="text-emerald-800">Agri</span>
            <span className="text-sky-600">Intelli</span>
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted truncate">
              {title}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/app" &&
              item.href !== "/admin" &&
              pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              to={item.href}
              className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-gradient-to-r from-emerald-800 to-emerald-700 text-white shadow-sm shadow-emerald-950/20 font-semibold"
                  : "text-foreground/75 hover:bg-surface-subtle hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`shrink-0 transition-colors duration-150 ${
                    active
                      ? "text-white"
                      : "text-muted group-hover:text-emerald-700"
                  }`}
                >
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge ? (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout Footer */}
      <div className="border-t border-border/80 bg-surface-subtle/50 p-3">
        <div className="mb-2.5 flex items-center gap-2.5 rounded-xl border border-border/60 bg-surface p-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-800 text-xs font-bold text-white uppercase">
            {user?.name?.[0] ?? "A"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-foreground">
              {user?.name ?? "Agriculteur"}
            </p>
            <p className="truncate text-[10px] text-muted capitalize">
              {user?.role ?? "Session démo"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-border/80 bg-surface px-3 py-2 text-xs font-semibold text-muted transition-colors hover:border-red-200 hover:bg-red-50/60 hover:text-red-700"
        >
          <Icons.LogOut className="h-3.5 w-3.5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}

export const farmerNav: NavItem[] = [
  { href: "/app", label: "Tableau de bord", icon: <Icons.Dashboard className="w-4 h-4" /> },
  {
    href: "/app/exploitations",
    label: "Mes exploitations",
    icon: <Icons.Farm className="w-4 h-4" />,
  },
  { href: "/app/cultures", label: "Mes cultures", icon: <Icons.Sprout className="w-4 h-4" /> },
  {
    href: "/app/diagnostic",
    label: "Diagnostic IA",
    icon: <Icons.Diagnostic className="w-4 h-4" />,
    badge: "Vision",
  },
  { href: "/app/analyse-sol", label: "Analyse du sol", icon: <Icons.Soil className="w-4 h-4" /> },
  {
    href: "/app/planification",
    label: "Planification",
    icon: <Icons.Calendar className="w-4 h-4" />,
  },
  {
    href: "/app/predictions",
    label: "Prédictions",
    icon: <Icons.Prediction className="w-4 h-4" />,
  },
  {
    href: "/app/notifications",
    label: "Notifications",
    icon: <Icons.Bell className="w-4 h-4" />,
    badge: "1",
  },
  {
    href: "/app/historique",
    label: "Historique",
    icon: <Icons.History className="w-4 h-4" />,
  },
  { href: "/app/profil", label: "Mon profil", icon: <Icons.User className="w-4 h-4" /> },
];

export const adminNav: NavItem[] = [
  { href: "/admin", label: "Tableau de bord", icon: <Icons.Dashboard className="w-4 h-4" /> },
  {
    href: "/admin/utilisateurs",
    label: "Utilisateurs",
    icon: <Icons.Users className="w-4 h-4" />,
  },
  {
    href: "/admin/statistiques",
    label: "Statistiques",
    icon: <Icons.Stats className="w-4 h-4" />,
  },
  {
    href: "/admin/parametres",
    label: "Paramètres",
    icon: <Icons.Settings className="w-4 h-4" />,
  },
];
