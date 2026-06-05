import { Filter, Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import SelectMenu from "../components/forms/SelectMenu.jsx";
import { SkillFilterSelect } from "../components/forms/SkillInput.jsx";
import ProjectCard from "../components/projects/ProjectCard.jsx";
import Alert from "../components/ui/Alert.jsx";
import Button from "../components/ui/Button.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import LoadingState from "../components/ui/LoadingState.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { listProjects } from "../services/firestore.js";
import { projectTypes } from "../utils/constants.js";
import { getServiceErrorMessage } from "../utils/messages.js";

export default function ProjectsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [skill, setSkill] = useState("");

  useEffect(() => {
    if (authLoading) return undefined;

    if (!isAuthenticated) {
      setProjects([]);
      setLoading(false);
      return undefined;
    }

    let mounted = true;

    async function loadProjects() {
      setLoading(true);
      try {
        const data = await listProjects();
        if (mounted) setProjects(data);
      } catch (err) {
        if (mounted) setError(getServiceErrorMessage(err, "Could not load projects."));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProjects();
    return () => {
      mounted = false;
    };
  }, [authLoading, isAuthenticated]);

  const activeProjects = useMemo(() => projects.filter((project) => project.status !== "Closed"), [projects]);

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();
    const skillQuery = skill.trim().toLowerCase();

    return activeProjects.filter((project) => {
      const matchesSearch =
        !query ||
        project.title?.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query);
      const matchesType = type === "All" || project.type === type;
      const matchesSkill =
        !skillQuery ||
        project.requiredSkills?.some((item) => item.toLowerCase().includes(skillQuery));
      return matchesSearch && matchesType && matchesSkill;
    });
  }, [activeProjects, search, type, skill]);

  if (loading) {
    return <LoadingState label="Loading projects" />;
  }

  return (
    <main className="page-shell page-reveal py-6 sm:py-10">
      <section className="panel-soft glass-reflect mb-6 overflow-hidden p-5 sm:p-6">
        <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan/55 to-transparent" aria-hidden="true" />
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="label text-mint">Project discovery</p>
            <h1 className="mt-2 text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">Browse collaboration teams</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/56">
              Search projects by title, description, type, and required skills.
            </p>
          </div>
          <div className="rounded-lg border border-white/[0.1] bg-white/[0.04] px-4 py-3 text-sm text-white/54">
            <strong className="text-white">{filteredProjects.length}</strong> visible / {activeProjects.length} active
          </div>
        </div>
      </section>

      <div className="mb-6 flex justify-end">
        {isAuthenticated ? (
          <Button as="link" to="/projects/new" className="w-full sm:w-auto">
            <Plus size={17} />
            Post Project
          </Button>
        ) : (
          <Button as="link" to="/signup" className="w-full sm:w-auto">
            Get Started
          </Button>
        )}
      </div>

      <section className="panel relative z-[70] mb-6 grid gap-3 overflow-visible p-4 lg:grid-cols-[1fr_220px_220px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-3.5 text-white/35" size={18} />
          <input
            className="input pl-10"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search title or description"
          />
        </div>
        <SelectMenu label="Project type" value={type} onChange={setType} options={["All", ...projectTypes]} icon={Filter} />
        <SkillFilterSelect value={skill} onChange={setSkill} label="Project skill filter" />
      </section>

      {error ? (
        <Alert variant="error" className="mb-5">
          {error}
        </Alert>
      ) : null}

      {projects.length === 0 ? (
        <EmptyState
          title="No projects posted yet"
          description="There are no projects yet. Post the first collaboration opportunity and start building your team."
          actionLabel={isAuthenticated ? "Post Project" : "Create Account"}
          actionTo={isAuthenticated ? "/projects/new" : "/signup"}
        />
      ) : activeProjects.length === 0 ? (
        <EmptyState
          title="No open projects right now"
          description="All posted projects are currently closed. Post a new opportunity to make it visible in discovery."
          actionLabel={isAuthenticated ? "Post Project" : "Create Account"}
          actionTo={isAuthenticated ? "/projects/new" : "/signup"}
        />
      ) : filteredProjects.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard project={project} key={project.id} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No matching projects"
          description="Try a broader search, clear filters, or post a project in this category."
          actionLabel={isAuthenticated ? "Post Project" : "Create Account"}
          actionTo={isAuthenticated ? "/projects/new" : "/signup"}
        />
      )}
    </main>
  );
}
