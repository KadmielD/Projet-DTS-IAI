import { Outlet } from "react-router-dom";
import { RoleGuard } from "@/components/RoleGuard";
import { AppShell } from "@/components/ui";
import { Sidebar, farmerNav } from "@/components/sidebar/Sidebar";

export default function FarmerLayout() {
  return (
    <RoleGuard allow={["agriculteur", "technicien"]}>
      <AppShell
        sidebar={<Sidebar items={farmerNav} title="Espace agriculteur" />}
      >
        <Outlet />
      </AppShell>
    </RoleGuard>
  );
}
