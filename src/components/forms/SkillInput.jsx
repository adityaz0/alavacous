import { Check, ChevronDown, Plus, Search, X } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { allSkills } from "../../utils/constants.js";

function normalize(value = "") {
  return value.trim().toLowerCase();
}

function uniqueSkills(skills = []) {
  const seen = new Set();

  return skills
    .map((skill) => skill.trim())
    .filter(Boolean)
    .filter((skill) => {
      const key = normalize(skill);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function skillExists(skills, skill) {
  const key = normalize(skill);
  return skills.some((item) => normalize(item) === key);
}

function getCanonicalSkill(skill, options = allSkills) {
  const match = options.find((option) => normalize(option) === normalize(skill));
  return match || skill.trim();
}

function useOutsideClose(ref, onClose) {
  useEffect(() => {
    function handleClick(event) {
      if (!ref.current?.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose, ref]);
}

function SkillMenuSurface({ id, label, mode = "popover", children }) {
  const modeClass =
    mode === "inline"
      ? "relative mt-3 w-full"
      : "absolute left-0 right-0 top-[calc(100%+0.55rem)] z-[160]";

  return (
    <div
      id={id}
      className={`skill-menu-surface glass-reflect rounded-lg p-1.5 ${modeClass}`}
      role="listbox"
      aria-label={label}
    >
      <div className="skill-menu-scroll pr-1">{children}</div>
    </div>
  );
}

export default function SkillInput({ value = [], onChange, label = "Skills", suggestions = allSkills }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const menuId = useId();
  const selectedSkills = uniqueSkills(value);
  const cleanedQuery = query.trim();

  useOutsideClose(rootRef, () => setOpen(false));

  const filteredSkills = useMemo(() => {
    const search = normalize(query);
    const options = uniqueSkills(suggestions);
    if (!search) return options;

    return options.filter((skill) => normalize(skill).includes(search));
  }, [query, suggestions]);

  const canAddCustom =
    cleanedQuery &&
    !skillExists(selectedSkills, cleanedQuery) &&
    !suggestions.some((skill) => normalize(skill) === normalize(cleanedQuery));

  function addSkill(skill) {
    const canonicalSkill = getCanonicalSkill(skill, suggestions);
    if (!canonicalSkill || skillExists(selectedSkills, canonicalSkill)) {
      setQuery("");
      setOpen(true);
      return;
    }

    onChange([...selectedSkills, canonicalSkill]);
    setQuery("");
    setOpen(true);
  }

  function removeSkill(skill) {
    onChange(selectedSkills.filter((item) => normalize(item) !== normalize(skill)));
  }

  function handleAdd(event) {
    event?.preventDefault();
    if (cleanedQuery) {
      addSkill(cleanedQuery);
    } else if (filteredSkills.length) {
      addSkill(filteredSkills[0]);
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      handleAdd(event);
    }

    if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="relative grid gap-3" ref={rootRef}>
      <span className="label">{label}</span>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-3.5 text-white/35" size={18} />
        <input
          className={`input pr-12 pl-10 ${open ? "border-cyan/55 bg-white/[0.105] ring-4 ring-cyan/10" : ""}`}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search or add a skill"
          role="combobox"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={label}
        />
        <button
          type="button"
          className="absolute right-2 top-2 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.055] text-white/50 transition hover:border-cyan/30 hover:bg-cyan/10 hover:text-cyan"
          aria-label={cleanedQuery ? `Add ${cleanedQuery}` : "Open skills"}
          onClick={cleanedQuery ? handleAdd : () => setOpen((current) => !current)}
        >
          {cleanedQuery ? <Plus size={16} /> : <ChevronDown className={`transition ${open ? "rotate-180" : ""}`} size={16} />}
        </button>

        {open ? (
          <SkillMenuSurface id={menuId} label={`${label} options`} mode="inline">
            {filteredSkills.length ? (
              filteredSkills.map((skill) => {
                const selected = skillExists(selectedSkills, skill);
                return (
                  <button
                    type="button"
                    className={`flex w-full items-center justify-between gap-3 rounded-md border px-3 py-2.5 text-left text-sm transition duration-150 ${
                      selected
                        ? "border-cyan/25 bg-cyan/15 text-cyan"
                        : "border-transparent text-white/74 hover:border-white/[0.12] hover:bg-white/[0.085] hover:text-white"
                    }`}
                    key={skill}
                    role="option"
                    aria-selected={selected}
                    onClick={() => addSkill(skill)}
                  >
                    <span className="min-w-0 truncate">{skill}</span>
                    {selected ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold">
                        Added
                        <Check size={14} />
                      </span>
                    ) : null}
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-3 text-sm text-white/45">No matching skills</div>
            )}

            {canAddCustom ? (
              <button
                type="button"
                className="mt-1 flex w-full items-center justify-between gap-3 rounded-md border border-cyan/20 bg-cyan/10 px-3 py-2.5 text-left text-sm font-semibold text-cyan transition hover:border-cyan/35 hover:bg-cyan/15"
                onClick={() => addSkill(cleanedQuery)}
              >
                <span className="min-w-0 truncate">Add custom "{cleanedQuery}"</span>
                <Plus size={15} />
              </button>
            ) : null}
          </SkillMenuSurface>
        ) : null}
      </div>

      <div className="flex min-h-8 flex-wrap gap-2">
        {selectedSkills.length ? (
          selectedSkills.map((skill) => (
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
          ))
        ) : (
          <span className="rounded-full border border-dashed border-white/[0.14] px-3 py-1 text-xs text-white/38">
            No skills selected
          </span>
        )}
      </div>
    </div>
  );
}

export function SkillFilterSelect({ value = "", onChange, label = "Skill filter" }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const menuId = useId();

  useOutsideClose(rootRef, () => setOpen(false));

  const filteredSkills = useMemo(() => {
    const search = normalize(query);
    if (!search) return allSkills;
    return allSkills.filter((skill) => normalize(skill).includes(search));
  }, [query]);

  function selectSkill(skill) {
    onChange(skill);
    setQuery("");
    setOpen(false);
  }

  function clearSkill() {
    onChange("");
    setQuery("");
    setOpen(false);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      if (filteredSkills.length) selectSkill(filteredSkills[0]);
      else if (query.trim()) selectSkill(query.trim());
    }

    if (event.key === "Escape") {
      setOpen(false);
    }
  }

  const displayValue = open ? query : value;

  return (
    <div className="relative z-[90] min-w-0" ref={rootRef}>
      <Search className="pointer-events-none absolute left-3 top-3.5 text-white/35" size={18} />
      <input
        className={`input pr-12 pl-10 ${open ? "border-cyan/55 bg-white/[0.105] ring-4 ring-cyan/10" : ""}`}
        value={displayValue}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          setQuery("");
          setOpen(true);
        }}
        onClick={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Filter by skill"
        role="combobox"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={label}
      />
      <button
        type="button"
        className="absolute right-2 top-2 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.055] text-white/50 transition hover:border-cyan/30 hover:bg-cyan/10 hover:text-cyan"
        aria-label={value ? "Clear skill filter" : "Open skill filter"}
        onClick={value ? clearSkill : () => setOpen((current) => !current)}
      >
        {value ? <X size={16} /> : <ChevronDown className={`transition ${open ? "rotate-180" : ""}`} size={16} />}
      </button>

      {open ? (
        <SkillMenuSurface id={menuId} label={`${label} options`}>
          <button
            type="button"
            className={`mb-1 flex w-full items-center justify-between gap-3 rounded-md border px-3 py-2.5 text-left text-sm transition duration-150 ${
              !value ? "border-cyan/25 bg-cyan/15 text-cyan" : "border-transparent text-white/74 hover:border-white/[0.12] hover:bg-white/[0.085] hover:text-white"
            }`}
            role="option"
            aria-selected={!value}
            onClick={clearSkill}
          >
            <span>All skills</span>
            {!value ? <Check size={14} /> : null}
          </button>

          {filteredSkills.length ? (
            filteredSkills.map((skill) => {
              const selected = normalize(skill) === normalize(value);
              return (
                <button
                  type="button"
                  className={`flex w-full items-center justify-between gap-3 rounded-md border px-3 py-2.5 text-left text-sm transition duration-150 ${
                    selected
                      ? "border-cyan/25 bg-cyan/15 text-cyan"
                      : "border-transparent text-white/74 hover:border-white/[0.12] hover:bg-white/[0.085] hover:text-white"
                  }`}
                  key={skill}
                  role="option"
                  aria-selected={selected}
                  onClick={() => selectSkill(skill)}
                >
                  <span className="min-w-0 truncate">{skill}</span>
                  {selected ? <Check size={14} /> : null}
                </button>
              );
            })
          ) : query.trim() ? (
            <button
              type="button"
              className="flex w-full items-center justify-between gap-3 rounded-md border border-cyan/20 bg-cyan/10 px-3 py-2.5 text-left text-sm font-semibold text-cyan transition hover:border-cyan/35 hover:bg-cyan/15"
              onClick={() => selectSkill(query.trim())}
            >
              <span className="min-w-0 truncate">Use "{query.trim()}"</span>
              <Plus size={15} />
            </button>
          ) : null}
        </SkillMenuSurface>
      ) : null}
    </div>
  );
}
