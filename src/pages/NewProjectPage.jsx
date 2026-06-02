import { Rocket } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Field from "../components/forms/Field.jsx";
import SkillInput from "../components/forms/SkillInput.jsx";
import Alert from "../components/ui/Alert.jsx";
import Button from "../components/ui/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { createProject, getUserProfile } from "../services/firestore.js";
import { projectStatuses, projectTypes } from "../utils/constants.js";
import { getServiceErrorMessage } from "../utils/messages.js";

const initialProject = {
  title: "",
  description: "",
  requiredSkills: [],
  type: "Startup",
  teamSize: 3,
  status: "Open",
};

export default function NewProjectPage() {
  const { user } = useAuth();
  const [project, setProject] = useState(initialProject);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  function updateField(field, value) {
    setProject((current) => ({ ...current, [field]: value }));
  }

  function validateProject() {
    if (project.title.trim().length < 3) {
      return "Project title must be at least 3 characters.";
    }

    if (project.description.trim().length < 20) {
      return "Please add a clearer project description with at least 20 characters.";
    }

    if (!project.requiredSkills.length) {
      return "Add at least one required skill.";
    }

    const teamSize = Number(project.teamSize);
    if (!Number.isFinite(teamSize) || teamSize < 1 || teamSize > 30) {
      return "Team size must be between 1 and 30.";
    }

    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const validationMessage = validateProject();
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    try {
      setSubmitting(true);
      const profile = await getUserProfile(user.uid);
      const projectId = await createProject({
        ...project,
        title: project.title.trim(),
        description: project.description.trim(),
        teamSize: Number(project.teamSize),
        ownerId: user.uid,
        ownerName: profile?.fullName || user.displayName || user.email,
      });
      navigate(`/projects/${projectId}`, { state: { notice: "Project published successfully." } });
    } catch (err) {
      setError(getServiceErrorMessage(err, "Could not create project."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="page-shell page-reveal py-6 sm:py-10">
      <section className="panel-soft glass-reflect mb-6 overflow-hidden p-5 sm:p-6">
        <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan/55 to-transparent" aria-hidden="true" />
        <p className="label text-mint">New project</p>
        <h1 className="mt-2 text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">Post a collaboration opportunity</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/56">
          Keep the scope clear so applicants can quickly understand the project, skills, team size, and current status.
        </p>
      </section>

      <form className="panel grid gap-5 p-5 sm:p-6" onSubmit={handleSubmit} noValidate>
        {error ? <Alert variant="error">{error}</Alert> : null}

        <Field label="Project title">
          <input className="input" value={project.title} onChange={(event) => updateField("title", event.target.value)} required placeholder="Project name" />
        </Field>

        <Field label="Description">
          <textarea
            className="input min-h-36 resize-y"
            value={project.description}
            onChange={(event) => updateField("description", event.target.value)}
            required
            placeholder="Explain the idea, current progress, who you need, and what success looks like."
          />
        </Field>

        <SkillInput value={project.requiredSkills} onChange={(skills) => updateField("requiredSkills", skills)} label="Required skills" />

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Project type">
            <select className="input" value={project.type} onChange={(event) => updateField("type", event.target.value)}>
              {projectTypes.map((type) => (
                <option className="bg-ink-900" key={type}>
                  {type}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Team size">
            <input className="input" type="number" min="1" max="30" value={project.teamSize} onChange={(event) => updateField("teamSize", event.target.value)} />
          </Field>
          <Field label="Status">
            <select className="input" value={project.status} onChange={(event) => updateField("status", event.target.value)}>
              {projectStatuses.map((status) => (
                <option className="bg-ink-900" key={status}>
                  {status}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Button type="submit" disabled={submitting} className="w-full sm:w-auto sm:justify-self-start">
          <Rocket size={17} />
          {submitting ? "Publishing..." : "Publish Project"}
        </Button>
      </form>
    </main>
  );
}
