import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { homePathForRole, useAuth } from "@/hooks/useAuth";
import type { Role } from "@/types";

export function RoleGuard({
  allow,
  children,
}: {
  allow: Role[];
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    if (!allow.includes(user.role)) {
      navigate(homePathForRole(user.role), { replace: true });
    }
  }, [user, loading, allow, navigate]);

  if (loading || !user || !allow.includes(user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted">
        Chargement…
      </div>
    );
  }

  return <>{children}</>;
}
