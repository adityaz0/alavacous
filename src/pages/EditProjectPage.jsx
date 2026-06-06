import { ArrowLeft, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProjectForm, { emptyProject, serializeProject, validateProject } from "../components/projects/ProjectForm.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import LoadingState from "../components/ui/LoadingState.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getProject, updateProject } from "../services/firestore.js";
import { getServiceErrorMessage } from "../utils/messages.js";

export default function EditProjectPage() {
  const { projectId } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    async function loadProject() {
      setLoading(true);
      setError("");

      try {
        const data = await getProject(projectId);
        if (!mounted) return;

        setProject(
          data
            ? {
                ...emptyProject,
                ...data,
                requiredSkills: data.requiredSkills || [],
                teamSize: data.teamSize || 3,
              }
            : null
        );
      } catch (err) {
        if (mounted) setError(getServiceErrorMessage(err, "Could not load project."));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProject();
    return () => {
      mounted = false;
    };
  }, [projectId]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const validationMessage = validateProject(project);
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setSaving(true);

    try {
      await updateProject(projectId, user.uid, serializeProject(project));
      navigate(`/projects/${projectId}`, { state: { notice: "Project updated." } });
    } catch (err) {
      setError(getServiceErrorMessage(err, "Could not update project."));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingState label="Loading project editor" />;
  }

  if (!project) {
    return (
      <main className="page-shell py-10">
        <EmptyState title="Project not found" description="This project may have been removed or the link may be incorrect." actionLabel="Browse Projects" actionTo="/projects" />
      </main>
    );
  }

  if (project.ownerId !== user.uid) {
    return (
      <main className="page-shell py-10">
        <EmptyState
          title="Owner access only"
          description="Only the project owner can edit this project."
          actionLabel="View Project"
          actionTo={`/projects/${projectId}`}
        />
      </main>
    );
  }

  return (
    <main className="page-shell page-reveal py-4 sm:py-6">
      <Link to={`/projects/${projectId}`} className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-white/55 transition hover:text-white">
        <ArrowLeft size={16} />
        Back to project
      </Link>

      <section className="internal-page-header">
        <p className="label text-mint">Owner workspace</p>
        <h1 className="mt-2 text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">Edit project</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/56">
          Update the project scope, requirements, team size, and current collaboration status.
        </p>
      </section>

      <ProjectForm
        project={project}
        onChange={setProject}
        onSubmit={handleSubmit}
        error={error}
        submitting={saving}
        submitLabel="Save Changes"
        submittingLabel="Saving..."
        icon={Save}
      />
    </main>
  );
}
