import { Outlet } from "react-router-dom";
import { RoleGuard } from "@/components/RoleGuard";
import { AppShell } from "@/components/ui";
import { Sidebar, adminNav } from "@/components/sidebar/Sidebar";

export default function AdminLayout() {
  return (
    <RoleGuard allow={["admin"]}>
      <AppShell
        sidebar={<Sidebar items={adminNav} title="Espace administrateur" />}
      >
        <Outlet />
      </AppShell>
    </RoleGuard>
  );
}
