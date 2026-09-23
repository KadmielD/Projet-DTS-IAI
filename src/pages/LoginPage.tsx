import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import { homePathForRole, useAuth } from "@/hooks/useAuth";
import { Button, Input } from "@/components/ui";
import { Icons } from "@/components/icons";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const performLogin = (targetEmail: string, targetPass: string) => {
    const result = login(targetEmail, targetPass);
    if (!result.ok || !result.user) {
      setError(result.error ?? "Erreur d'authentification");
      return;
    }
    navigate(homePathForRole(result.user.role));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    performLogin(email, password);
  };

  const loginDemoFarmer = () => {
    setEmail("jean.mbarga@ferme.cm");
    setPassword("farmer123");
    performLogin("jean.mbarga@ferme.cm", "farmer123");
  };

  const loginDemoAdmin = () => {
    setEmail("admin@agriintelli.cm");
    setPassword("admin123");
    performLogin("admin@agriintelli.cm", "admin123");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-12 antialiased">
      {/* Background Subtle Mesh */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-radial-subtle opacity-70" />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-border/80 bg-surface/95 p-8 shadow-[0_12px_40px_-8px_rgba(6,95,70,0.08)] backdrop-blur-xl">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link to="/" className="inline-block transition-transform hover:scale-105">
            <img src={logo} alt="AgriIntelli" className="h-14 w-14 object-contain drop-shadow-sm" />
          </Link>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
            Bienvenue sur <span className="text-emerald-800">Agri</span>
            <span className="text-sky-600">Intelli</span>
          </h1>
          <p className="mt-1.5 text-xs text-muted">
            Connectez-vous pour accéder à vos parcelles et modèles agronomiques
          </p>
        </div>

        {/* 1-Click Fast Demo Logins for Judges/Reviewers */}
        <div className="mb-6 rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-2.5">
            <Icons.Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            Accès Démo Immédiat (1 Clic)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={loginDemoFarmer}
              className="flex flex-col items-center justify-center rounded-xl border border-emerald-300/80 bg-surface p-2.5 text-xs font-semibold text-emerald-900 shadow-sm transition-all hover:bg-emerald-100/70 hover:scale-[1.02] cursor-pointer"
            >
              <span>🌾 Agriculteur</span>
              <span className="text-[10px] text-muted font-normal">Jean Mbarga</span>
            </button>
            <button
              type="button"
              onClick={loginDemoAdmin}
              className="flex flex-col items-center justify-center rounded-xl border border-sky-300/80 bg-surface p-2.5 text-xs font-semibold text-sky-900 shadow-sm transition-all hover:bg-sky-100/70 hover:scale-[1.02] cursor-pointer"
            >
              <span>🛡️ Administrateur</span>
              <span className="text-[10px] text-muted font-normal">AgriIntelli HQ</span>
            </button>
          </div>
        </div>

        <div className="relative mb-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/80" />
          </div>
          <span className="relative bg-surface px-3 text-xs font-medium text-muted">
            ou saisie manuelle
          </span>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label="Adresse Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="vous@ferme.cm"
            required
            icon={<Icons.User className="w-4 h-4" />}
          />
          <Input
            label="Mot de passe"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            required
            icon={<Icons.ShieldCheck className="w-4 h-4" />}
          />

          {error ? (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
              <Icons.AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          ) : null}

          <Button type="submit" size="lg" className="w-full mt-2">
            Se connecter
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-muted">
          Pas encore de compte ?{" "}
          <Link to="/register" className="font-semibold text-emerald-800 hover:underline">
            Créer une exploitation
          </Link>
        </p>
      </div>
    </div>
  );
}
