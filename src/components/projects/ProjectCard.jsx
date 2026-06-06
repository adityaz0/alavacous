import { ArrowUpRight, CalendarDays, UserCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/format.js";
import Avatar from "../ui/Avatar.jsx";
import StatusBadge from "../ui/StatusBadge.jsx";

export default function ProjectCard({ project }) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="panel interactive-panel group grid overflow-hidden p-4"
    >
      <div className="relative z-10 grid h-full gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <StatusBadge status={project.status} />
              <span className="rounded-full border border-line bg-white/[0.025] px-2.5 py-1 text-xs font-medium text-white/46">
                {project.type}
              </span>
            </div>
            <h3 className="line-clamp-2 break-words text-base font-semibold tracking-[-0.01em] text-white transition sm:text-lg">
              {project.title}
            </h3>
          </div>
          <span className="rounded-lg border border-line bg-ink-700 p-1.5 text-white/42 transition group-hover:-translate-y-px group-hover:border-white/10 group-hover:bg-white/[0.025] group-hover:text-white/76">
            <ArrowUpRight size={16} />
          </span>
        </div>

        <p className="line-clamp-3 break-words text-sm leading-6 text-white/52">{project.description}</p>

        <div className="flex flex-wrap gap-2">
          {project.requiredSkills?.slice(0, 4).map((skill) => (
            <span className="chip-strong" key={skill}>
              {skill}
            </span>
          ))}
        </div>

        <div className="mt-auto border-t border-line pt-3">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar name={project.ownerName} size="sm" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white/78">{project.ownerName || "Unknown builder"}</p>
              <p className="text-xs text-white/38">Project owner</p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 items-center gap-3 border-t border-line pt-3 text-xs text-white/44">
            <span className="inline-flex items-center gap-1.5">
              <Users size={13} />
              {project.teamSize || 1}
            </span>
            <span className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/[0.05] bg-white/[0.025] px-2 py-1 font-semibold text-white/62">
              <UserCheck size={13} />
              {project.applicantCount || 0}
            </span>
            <span className="inline-flex items-center justify-end gap-1.5">
              <CalendarDays size={13} />
              {formatDate(project.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
