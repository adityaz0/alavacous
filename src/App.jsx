import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/layout/AppShell.jsx";
import ProtectedRoute from "./components/layout/ProtectedRoute.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import EditProjectPage from "./pages/EditProjectPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import LegalPlaceholderPage from "./pages/LegalPlaceholderPage.jsx";
import NewProjectPage from "./pages/NewProjectPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ProjectDetailPage from "./pages/ProjectDetailPage.jsx";
import ProjectsGate from "./pages/ProjectsGate.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<LandingPage />} />
        <Route path="projects" element={<ProjectsGate />} />
        <Route path="login" element={<AuthPage mode="login" />} />
        <Route path="signup" element={<AuthPage mode="signup" />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="privacy" element={<LegalPlaceholderPage type="Privacy" />} />
        <Route path="terms" element={<LegalPlaceholderPage type="Terms" />} />

        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="chats" element={<ChatPage />} />
          <Route path="chats/:chatId" element={<ChatPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="projects/new" element={<NewProjectPage />} />
          <Route path="post-project" element={<Navigate to="/projects/new" replace />} />
          <Route path="projects/:projectId" element={<ProjectDetailPage />} />
          <Route path="project/:projectId" element={<ProjectDetailPage />} />
          <Route path="projects/:projectId/edit" element={<EditProjectPage />} />
        </Route>

        <Route path="home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
