import { CalendarDays, Crown, Users } from "lucide-react";
import { formatDate } from "../../utils/format.js";
import Avatar from "../ui/Avatar.jsx";

export default function TeamSection({ project, applications = [], visible }) {
  if (!visible) return null;

  const acceptedMembers = applications.filter((application) => application.status === "Accepted");
  const teamSize = Number(project.teamSize) || 1;
  const joinedCount = Math.min(teamSize, 1 + acceptedMembers.length);

  return (
    <article className="panel p-5 sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="label text-mint">Team workspace</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Accepted builders</h2>
          <p className="mt-1 text-sm text-white/44">Visible to the project owner and accepted team members.</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-cyan/20 bg-cyan/10 px-3 py-1.5 text-sm font-semibold text-cyan">
          <Users size={15} />
          {joinedCount}/{teamSize} members joined
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <TeamCard
          name={project.ownerName || "Project owner"}
          role="Project owner"
          skills={project.requiredSkills?.slice(0, 3)}
          joinedDate={project.createdAt}
          featured
        />
        {acceptedMembers.map((member) => (
          <TeamCard
            key={member.id}
            name={member.applicantName || "Accepted builder"}
            role={member.applicantRole || "Accepted builder"}
            skills={member.applicantSkills || []}
            joinedDate={member.updatedAt || member.createdAt}
          />
        ))}
      </div>
    </article>
  );
}

function TeamCard({ name, role, skills = [], joinedDate, featured = false }) {
  return (
    <div className="interactive-panel rounded-lg border border-white/[0.1] bg-white/[0.045] p-4">
      <div className="flex min-w-0 items-start gap-3">
        <Avatar name={name} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-white">{name}</h3>
            {featured ? <Crown className="shrink-0 text-cyan" size={14} /> : null}
          </div>
          <p className="mt-1 truncate text-xs font-semibold uppercase tracking-[0.14em] text-white/36">{role}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {skills.length ? (
          skills.slice(0, 4).map((skill) => (
            <span className="chip-strong" key={skill}>
              {skill}
            </span>
          ))
        ) : (
          <span className="rounded-full border border-dashed border-white/[0.14] px-3 py-1 text-xs text-white/38">
            Skills not listed
          </span>
        )}
      </div>

      <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-white/42">
        <CalendarDays size={13} />
        Joined {formatDate(joinedDate)}
      </p>
    </div>
  );
}
