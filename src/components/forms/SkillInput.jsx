import { Plus, X } from "lucide-react";
import { useState } from "react";
import { popularSkills } from "../../utils/constants.js";
import Button from "../ui/Button.jsx";

export default function SkillInput({ value = [], onChange, label = "Skills", suggestions = popularSkills }) {
  const [draft, setDraft] = useState("");

  function addSkill(skill) {
    const cleaned = skill.trim();
    if (!cleaned) return;
    const exists = value.some((item) => item.toLowerCase() === cleaned.toLowerCase());
    if (!exists) {
      onChange([...value, cleaned]);
    }
    setDraft("");
  }

  function removeSkill(skill) {
    onChange(value.filter((item) => item !== skill));
  }

  function handleAdd(event) {
    event?.preventDefault();
    addSkill(draft);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      handleAdd(event);
    }
  }

  return (
    <div className="grid gap-3">
      <span className="label">{label}</span>
      <div className="flex gap-2">
        <input
          className="input"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a skill"
        />
        <Button type="button" variant="secondary" aria-label="Add skill" onClick={handleAdd}>
          <Plus size={17} />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {value.map((skill) => (
          <span className="chip" key={skill}>
            {skill}
            <button
              type="button"
              className="rounded-full text-white/45 transition hover:text-white"
              onClick={() => removeSkill(skill)}
              aria-label={`Remove ${skill}`}
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {suggestions
          .filter((skill) => !value.some((item) => item.toLowerCase() === skill.toLowerCase()))
          .slice(0, 8)
          .map((skill) => (
            <button
              type="button"
              key={skill}
              onClick={() => addSkill(skill)}
              className="rounded-full border border-line px-3 py-1 text-xs text-white/55 transition hover:border-white/25 hover:text-white"
            >
              {skill}
            </button>
          ))}
      </div>
    </div>
  );
}
