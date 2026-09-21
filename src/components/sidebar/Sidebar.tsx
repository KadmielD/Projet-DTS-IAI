import type { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import { useAuth } from "@/hooks/useAuth";

export interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
}

function Icon({
  children,
  className = "h-5 w-5",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}

export const farmerIcons = {
  dashboard: (
    <Icon>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </Icon>
  ),
  exploitations: (
    <Icon>
      <path d="M3 21h18" />
      <path d="M5 21V10l7-5 7 5v11" />
      <path d="M9 21v-6h6v6" />
    </Icon>
  ),
  cultures: (
    <Icon>
      <path d="M12 22V10" />
      <path d="M12 10c-3-4-8-4-8-4s1 6 8 8" />
      <path d="M12 10c3-4 8-4 8-4s-1 6-8 8" />
    </Icon>
  ),
  planification: (
    <Icon>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </Icon>
  ),
  diagnostic: (
    <Icon>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
      <path d="m4.9 4.9 2.1 2.1M17 17l2.1 2.1M17 7l2.1-2.1M4.9 19.1 7 17" />
    </Icon>
  ),
  predictions: (
    <Icon>
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="m7 14 3-4 3 2 4-6" />
    </Icon>
  ),
  sol: (
    <Icon>
      <path d="M3 17c3-2 6-2 9 0s6 2 9 0" />
      <path d="M3 12c3-2 6-2 9 0s6 2 9 0" />
      <path d="M12 3v6" />
      <path d="M9 7c1.5-2 4.5-2 6 0" />
    </Icon>
  ),
  historique: (
    <Icon>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Icon>
  ),
  profil: (
    <Icon>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" />
    </Icon>
  ),
  logout: (
    <Icon>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </Icon>
  ),
  users: (
    <Icon>
      <circle cx="9" cy="8" r="3" />
      <path d="M2 20c1-3.5 3.5-5 7-5s6 1.5 7 5" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M19 20c.5-2 1.5-3 3-3.5" />
    </Icon>
  ),
  stats: (
    <Icon>
      <path d="M4 19V9" />
      <path d="M10 19V5" />
      <path d="M16 19v-7" />
      <path d="M22 19V8" />
    </Icon>
  ),
  settings: (
    <Icon>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </Icon>
  ),
};

export function Sidebar({ items, title }: { items: NavItem[]; title: string }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex items-center gap-3 border-b border-border px-4 py-4">
        <img src={logo} alt="AgriIntelli" className="h-10 w-10 object-contain" />
        <div>
          <p className="text-sm font-bold leading-tight">
            <span className="text-primary">Agri</span>
            <span className="text-accent">Intelli</span>
          </p>
          <p className="text-[10px] uppercase tracking-wide text-muted">
            {title}
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
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
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-primary text-white"
                  : "text-foreground/80 hover:bg-background"
              }`}
            >
              <span className={active ? "text-white" : "text-primary"}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <div className="mb-2 truncate px-3 text-xs text-muted">{user?.name}</div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-background"
        >
          <span className="text-primary">{farmerIcons.logout}</span>
          Déconnexion
        </button>
      </div>
    </aside>
  );
}

export const farmerNav: NavItem[] = [
  { href: "/app", label: "Tableau de bord", icon: farmerIcons.dashboard },
  {
    href: "/app/exploitations",
    label: "Mes exploitations",
    icon: farmerIcons.exploitations,
  },
  { href: "/app/cultures", label: "Mes cultures", icon: farmerIcons.cultures },
  {
    href: "/app/planification",
    label: "Planification",
    icon: farmerIcons.planification,
  },
  {
    href: "/app/diagnostic",
    label: "Diagnostic IA",
    icon: farmerIcons.diagnostic,
  },
  {
    href: "/app/predictions",
    label: "Prédictions",
    icon: farmerIcons.predictions,
  },
  { href: "/app/analyse-sol", label: "Analyse sol", icon: farmerIcons.sol },
  {
    href: "/app/historique",
    label: "Historique",
    icon: farmerIcons.historique,
  },
  { href: "/app/profil", label: "Profil", icon: farmerIcons.profil },
];

export const adminNav: NavItem[] = [
  { href: "/admin", label: "Tableau de bord", icon: farmerIcons.dashboard },
  {
    href: "/admin/utilisateurs",
    label: "Utilisateurs",
    icon: farmerIcons.users,
  },
  {
    href: "/admin/statistiques",
    label: "Statistiques",
    icon: farmerIcons.stats,
  },
  {
    href: "/admin/parametres",
    label: "Paramètres",
    icon: farmerIcons.settings,
  },
];
