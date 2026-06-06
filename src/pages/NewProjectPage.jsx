import { Rocket } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectForm, { emptyProject, serializeProject, validateProject } from "../components/projects/ProjectForm.jsx";
import { useToast } from "../components/ui/ToastProvider.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { createProject, getUserProfile } from "../services/firestore.js";
import { getServiceErrorMessage } from "../utils/messages.js";

export default function NewProjectPage() {
  const { user } = useAuth();
  const [project, setProject] = useState(emptyProject);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const validationMessage = validateProject(project);
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    try {
      setSubmitting(true);
      const profile = await getUserProfile(user.uid);
      const projectId = await createProject({
        ...serializeProject(project),
        ownerId: user.uid,
        ownerName: profile?.fullName || user.displayName || user.email,
      });
      toast.success("Project published successfully.");
      navigate(`/projects/${projectId}`);
    } catch (err) {
      setError(getServiceErrorMessage(err, "Could not create project."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="page-shell page-reveal py-4 sm:py-6">
      <section className="internal-page-header">
        <p className="label text-mint">New project</p>
        <h1 className="mt-2 text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">Post a collaboration opportunity</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/56">
          Keep the scope clear so applicants can quickly understand the project, skills, team size, and current status.
        </p>
      </section>

      <ProjectForm
        project={project}
        onChange={setProject}
        onSubmit={handleSubmit}
        error={error}
        submitting={submitting}
        submitLabel="Publish Project"
        submittingLabel="Publishing..."
        icon={Rocket}
      />
    </main>
  );
}
