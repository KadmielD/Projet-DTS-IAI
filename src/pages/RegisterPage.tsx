import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import { useAuth } from "@/hooks/useAuth";
import { Button, Input } from "@/components/ui";
import { Icons } from "@/components/icons";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = register(name, email, password);
    if (!result.ok) {
      setError(result.error ?? "Erreur lors de l'inscription");
      return;
    }
    navigate("/app");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-12 antialiased">
      <div className="pointer-events-none absolute inset-0 bg-gradient-radial-subtle opacity-70" />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-border/80 bg-surface/95 p-8 shadow-[0_12px_40px_-8px_rgba(6,95,70,0.08)] backdrop-blur-xl">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link to="/" className="inline-block transition-transform hover:scale-105">
            <img src={logo} alt="AgriIntelli" className="h-14 w-14 object-contain drop-shadow-sm" />
          </Link>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
            Créer votre compte
          </h1>
          <p className="mt-1.5 text-xs text-muted">
            Rejoignez le réseau des agriculteurs augmentés par l&apos;IA
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label="Nom complet"
            value={name}
            onChange={setName}
            placeholder="Ex : Samuel Eto'o"
            required
            icon={<Icons.User className="w-4 h-4" />}
          />
          <Input
            label="Adresse Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="samuel@ferme.cm"
            required
            icon={<Icons.User className="w-4 h-4" />}
          />
          <Input
            label="Mot de passe"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="Minimum 6 caractères"
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
            Créer mon exploitation
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-muted">
          Déjà inscrit ?{" "}
          <Link to="/login" className="font-semibold text-emerald-800 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
