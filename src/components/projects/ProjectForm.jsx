import { Rocket } from "lucide-react";
import Field from "../forms/Field.jsx";
import SelectMenu from "../forms/SelectMenu.jsx";
import SkillInput from "../forms/SkillInput.jsx";
import Alert from "../ui/Alert.jsx";
import Button from "../ui/Button.jsx";
import { projectStatuses, projectTypes } from "../../utils/constants.js";

export const emptyProject = {
  title: "",
  description: "",
  requiredSkills: [],
  type: "Startup",
  teamSize: 3,
  status: "Open",
};

function cleanSkills(skills = []) {
  const seen = new Set();

  return skills
    .map((skill) => skill.trim())
    .filter(Boolean)
    .filter((skill) => {
      const key = skill.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

export function serializeProject(project) {
  return {
    title: project.title.trim(),
    description: project.description.trim(),
    requiredSkills: cleanSkills(project.requiredSkills),
    type: project.type,
    teamSize: Number(project.teamSize),
    status: project.status,
  };
}

export function validateProject(project) {
  const payload = serializeProject(project);

  if (payload.title.length < 3) {
    return "Project title must be at least 3 characters.";
  }

  if (payload.description.length < 20) {
    return "Please add a clearer project description with at least 20 characters.";
  }

  if (!payload.requiredSkills.length) {
    return "Add at least one required skill.";
  }

  if (!projectTypes.includes(payload.type)) {
    return "Please choose a valid project type.";
  }

  if (!projectStatuses.includes(payload.status)) {
    return "Please choose a valid project status.";
  }

  if (!Number.isFinite(payload.teamSize) || payload.teamSize < 1 || payload.teamSize > 30) {
    return "Team size must be between 1 and 30.";
  }

  return "";
}

export default function ProjectForm({
  project,
  onChange,
  onSubmit,
  error,
  submitting,
  submitLabel,
  submittingLabel,
  icon: Icon = Rocket,
}) {
  function updateField(field, value) {
    onChange({ ...project, [field]: value });
  }

  return (
    <form className="panel grid gap-5 p-4 sm:p-5" onSubmit={onSubmit} noValidate>
      {error ? <Alert variant="error">{error}</Alert> : null}

      <Field label="Project title">
        <input
          className="input"
          value={project.title}
          onChange={(event) => updateField("title", event.target.value)}
          required
          placeholder="Project name"
        />
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
          <SelectMenu label="Project type" value={project.type} onChange={(value) => updateField("type", value)} options={projectTypes} />
        </Field>
        <Field label="Team size">
          <input
            className="input"
            type="number"
            min="1"
            max="30"
            value={project.teamSize}
            onChange={(event) => updateField("teamSize", event.target.value)}
          />
        </Field>
        <Field label="Status">
          <SelectMenu label="Project status" value={project.status} onChange={(value) => updateField("status", value)} options={projectStatuses} />
        </Field>
      </div>

      <Button type="submit" disabled={submitting} className="w-full sm:w-auto sm:justify-self-start">
        <Icon size={17} />
        {submitting ? submittingLabel : submitLabel}
      </Button>
    </form>
  );
}
