import { CalendarDays, Crown, LogOut, Trash2, Users } from "lucide-react";
import { formatDate } from "../../utils/format.js";
import Avatar from "../ui/Avatar.jsx";
import Button from "../ui/Button.jsx";

function normalizeStatus(status) {
  return String(status || "").trim().toLowerCase();
}

export default function TeamSection({
  project,
  applications = [],
  visible,
  isOwner = false,
  currentUserId = "",
  removingMemberId = "",
  leaving = false,
  onRemoveMember,
  onLeaveProject,
}) {
  if (!visible) return null;

  const acceptedMembers = applications.filter((application) => normalizeStatus(application.status) === "accepted");
  const teamSize = Number(project.teamSize) || 1;
  const joinedCount = Math.min(teamSize, 1 + acceptedMembers.length);

  return (
    <article className="panel p-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="label text-mint">Team workspace</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Accepted builders</h2>
          <p className="mt-1 text-sm text-white/44">Visible to the project owner and accepted team members.</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.025] px-3 py-1.5 text-sm font-semibold text-white/58">
          <Users size={15} />
          {joinedCount}/{teamSize} members joined
        </span>
      </div>

      <div className="overflow-hidden rounded-lg border border-line">
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
            action={
              isOwner ? (
                <Button
                  variant="danger"
                  disabled={removingMemberId === member.id}
                  onClick={() => onRemoveMember?.(member)}
                  className="w-full lg:w-auto"
                >
                  <Trash2 size={16} />
                  {removingMemberId === member.id ? "Removing..." : "Remove Member"}
                </Button>
              ) : currentUserId === member.applicantId ? (
                <Button
                  variant="secondary"
                  disabled={leaving}
                  onClick={onLeaveProject}
                  className="w-full lg:w-auto"
                >
                  <LogOut size={16} />
                  {leaving ? "Leaving..." : "Leave Project"}
                </Button>
              ) : null
            }
          />
        ))}
      </div>
    </article>
  );
}

function TeamCard({ name, role, skills = [], joinedDate, featured = false, action = null }) {
  return (
    <div className="border-b border-line bg-white/[0.015] p-3 last:border-b-0 sm:p-3.5">
      <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <Avatar name={name} size="sm" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-sm font-semibold text-white">{name}</h3>
              {featured ? <Crown className="shrink-0 text-white/58" size={13} /> : null}
            </div>
            <p className="mt-1 truncate text-xs font-semibold uppercase tracking-[0.08em] text-white/34">{role}</p>
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-white/38">
              <CalendarDays size={12} />
              Joined {formatDate(joinedDate)}
            </p>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-1.5 lg:justify-end">
            {skills.length ? (
              skills.slice(0, 4).map((skill) => (
                <span className="chip" key={skill}>
                  {skill}
                </span>
              ))
            ) : (
              <span className="rounded-full border border-dashed border-line px-3 py-1 text-xs text-white/34">
                Skills not listed
              </span>
            )}
          </div>
          {action ? <div className="mt-3 lg:flex lg:justify-end">{action}</div> : null}
        </div>
      </div>
    </div>
  );
}
