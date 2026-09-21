import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  adminCredentials,
  farmerCredentials,
  mockUsers,
} from "@/api/mock";
import type { Role, User } from "@/types";

const STORAGE_KEY = "agriintelli_session";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (
    email: string,
    password: string,
  ) => { ok: boolean; error?: string; user?: User };
  logout: () => void;
  register: (name: string, email: string, password: string) => {
    ok: boolean;
    error?: string;
  };
}

const AuthContext = createContext<AuthContextValue | null>(null);

function resolveUser(email: string, password: string): User | null {
  const normalized = email.trim().toLowerCase();
  if (
    normalized === farmerCredentials.email &&
    password === farmerCredentials.password
  ) {
    return mockUsers.find((u) => u.email === farmerCredentials.email) ?? null;
  }
  if (
    normalized === adminCredentials.email &&
    password === adminCredentials.password
  ) {
    return mockUsers.find((u) => u.email === adminCredentials.email) ?? null;
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setUser(JSON.parse(raw) as User);
      }
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, []);

  const persist = useCallback((next: User | null) => {
    setUser(next);
    if (next) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const login = useCallback(
    (email: string, password: string) => {
      const found = resolveUser(email, password);
      if (!found) {
        return { ok: false, error: "Email ou mot de passe incorrect." };
      }
      if (found.status === "inactif") {
        return { ok: false, error: "Ce compte est inactif." };
      }
      persist(found);
      return { ok: true, user: found };
    },
    [persist],
  );

  const logout = useCallback(() => {
    persist(null);
  }, [persist]);

  const register = useCallback(
    (name: string, email: string, _password: string) => {
      if (!name.trim() || !email.trim()) {
        return { ok: false, error: "Veuillez remplir tous les champs." };
      }
      const newUser: User = {
        id: `u-${Date.now()}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: "agriculteur" as Role,
        status: "actif",
        createdAt: new Date().toISOString().slice(0, 10),
      };
      persist(newUser);
      return { ok: true };
    },
    [persist],
  );

  const value = useMemo(
    () => ({ user, loading, login, logout, register }),
    [user, loading, login, logout, register],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

export function homePathForRole(role: Role): string {
  if (role === "admin") return "/admin";
  return "/app";
}
