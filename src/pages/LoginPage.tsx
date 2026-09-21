import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import { homePathForRole, useAuth } from "@/hooks/useAuth";
import { Button, Input } from "@/components/ui";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = login(email, password);
    if (!result.ok || !result.user) {
      setError(result.error ?? "Erreur de connexion");
      return;
    }
    navigate(homePathForRole(result.user.role));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <img src={logo} alt="AgriIntelli" width={72} height={72} />
          <h1 className="mt-3 text-xl font-bold">
            <span className="text-primary">Agri</span>
            <span className="text-accent">Intelli</span>
          </h1>
          <p className="mt-1 text-sm text-muted">Connexion</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="vous@exemple.cm"
            required
          />
          <Input
            label="Mot de passe"
            type="password"
            value={password}
            onChange={setPassword}
            required
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button type="submit" className="w-full">
            Se connecter
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted">
          Pas de compte ?{" "}
          <Link to="/register" className="font-semibold text-primary">
            S&apos;inscrire
          </Link>
        </p>

        <div className="mt-6 rounded-lg bg-background p-3 text-xs text-muted">
          <p className="font-semibold text-foreground">Comptes démo</p>
          <p>Agriculteur : jean.mbarga@ferme.cm / farmer123</p>
          <p>Admin : admin@agriintelli.cm / admin123</p>
        </div>
      </div>
    </div>
  );
}
