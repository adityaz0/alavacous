import { ArrowUpRight, CalendarDays, UserCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/format.js";
import Avatar from "../ui/Avatar.jsx";
import StatusBadge from "../ui/StatusBadge.jsx";

export default function ProjectCard({ project }) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="panel interactive-panel group grid min-h-[292px] overflow-hidden p-5"
    >
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan/50 to-transparent opacity-0 transition group-hover:opacity-100" aria-hidden="true" />

      <div className="relative z-10 grid h-full gap-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <StatusBadge status={project.status} />
              <span className="rounded-full border border-line bg-white/[0.04] px-2.5 py-1 text-xs font-semibold text-white/52">
                {project.type}
              </span>
            </div>
            <h3 className="line-clamp-2 break-words text-xl font-semibold tracking-[-0.01em] text-white transition group-hover:text-cyan">
              {project.title}
            </h3>
          </div>
          <span className="rounded-lg border border-line bg-white/[0.055] p-2 text-white/50 transition group-hover:-translate-y-0.5 group-hover:border-cyan/40 group-hover:bg-cyan/10 group-hover:text-cyan group-hover:shadow-[0_0_28px_rgba(103,232,249,0.15)]">
            <ArrowUpRight size={18} />
          </span>
        </div>

        <p className="line-clamp-4 break-words text-sm leading-6 text-white/58">{project.description}</p>

        <div className="flex flex-wrap gap-2">
          {project.requiredSkills?.slice(0, 5).map((skill) => (
            <span className="chip-strong" key={skill}>
              {skill}
            </span>
          ))}
        </div>

        <div className="mt-auto grid gap-4 border-t border-line pt-4">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar name={project.ownerName} size="sm" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white/78">{project.ownerName || "Unknown builder"}</p>
              <p className="text-xs text-white/38">Project owner</p>
            </div>
          </div>

          <div className="grid grid-cols-3 items-center gap-2 text-xs text-white/48">
            <span className="inline-flex items-center gap-1.5">
              <Users size={14} />
              {project.teamSize || 1}
            </span>
            <span className="inline-flex items-center justify-center gap-1.5 rounded-full border border-cyan/15 bg-cyan/10 px-2 py-1 font-semibold text-cyan">
              <UserCheck size={14} />
              {project.applicantCount || 0}
            </span>
            <span className="inline-flex items-center justify-end gap-1.5">
              <CalendarDays size={14} />
              {formatDate(project.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
