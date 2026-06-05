import LoadingState from "../components/ui/LoadingState.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import ProjectsPage from "./ProjectsPage.jsx";
import ProjectsPreviewPage from "./ProjectsPreviewPage.jsx";

export default function ProjectsGate() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingState />;
  }

  return isAuthenticated ? <ProjectsPage /> : <ProjectsPreviewPage />;
}
