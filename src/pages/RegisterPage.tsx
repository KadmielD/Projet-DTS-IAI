import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import { useAuth } from "@/hooks/useAuth";
import { Button, Input } from "@/components/ui";

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
      setError(result.error ?? "Erreur");
      return;
    }
    navigate("/app");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <img src={logo} alt="AgriIntelli" width={72} height={72} />
          <h1 className="mt-3 text-xl font-bold">Créer un compte</h1>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label="Nom complet"
            value={name}
            onChange={setName}
            required
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
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
            S&apos;inscrire
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted">
          Déjà inscrit ?{" "}
          <Link to="/login" className="font-semibold text-primary">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
