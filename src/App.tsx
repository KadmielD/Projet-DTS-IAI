import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import FarmerLayout from "@/layouts/FarmerLayout";
import AdminLayout from "@/layouts/AdminLayout";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import FarmerDashboardPage from "@/pages/farmer/DashboardPage";
import ExploitationsPage from "@/pages/farmer/ExploitationsPage";
import CulturesPage from "@/pages/farmer/CulturesPage";
import PlanificationPage from "@/pages/farmer/PlanificationPage";
import DiagnosticPage from "@/pages/farmer/DiagnosticPage";
import PredictionsPage from "@/pages/farmer/PredictionsPage";
import AnalyseSolPage from "@/pages/farmer/AnalyseSolPage";
import HistoriquePage from "@/pages/farmer/HistoriquePage";
import ProfilPage from "@/pages/farmer/ProfilPage";
import AdminDashboardPage from "@/pages/admin/DashboardPage";
import UtilisateursPage from "@/pages/admin/UtilisateursPage";
import StatistiquesPage from "@/pages/admin/StatistiquesPage";
import ParametresPage from "@/pages/admin/ParametresPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/app" element={<FarmerLayout />}>
          <Route index element={<FarmerDashboardPage />} />
          <Route path="exploitations" element={<ExploitationsPage />} />
          <Route path="cultures" element={<CulturesPage />} />
          <Route path="planification" element={<PlanificationPage />} />
          <Route path="diagnostic" element={<DiagnosticPage />} />
          <Route path="predictions" element={<PredictionsPage />} />
          <Route path="analyse-sol" element={<AnalyseSolPage />} />
          <Route path="historique" element={<HistoriquePage />} />
          <Route path="profil" element={<ProfilPage />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="utilisateurs" element={<UtilisateursPage />} />
          <Route path="statistiques" element={<StatistiquesPage />} />
          <Route path="parametres" element={<ParametresPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
