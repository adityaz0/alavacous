import { ArrowLeft, CalendarDays, CheckCircle2, Edit3, ExternalLink, Layers, LockKeyhole, LogOut, RotateCcw, Send, Trash2, UserCheck, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ApplicationList from "../components/applications/ApplicationList.jsx";
import TeamSection from "../components/projects/TeamSection.jsx";
import Alert from "../components/ui/Alert.jsx";
import Avatar from "../components/ui/Avatar.jsx";
import Button from "../components/ui/Button.jsx";
import ConfirmModal from "../components/ui/ConfirmModal.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import LoadingState from "../components/ui/LoadingState.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import { useToast } from "../components/ui/ToastProvider.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  closeProject,
  createApplication,
  deleteProjectWithApplications,
  getApplicationForProject,
  getProject,
  getUserProfile,
  leaveProject,
  listApplicationsByProject,
  removeProjectMember,
  reopenProject,
  updateApplicationStatus,
  withdrawApplication,
} from "../services/firestore.js";
import { formatDate } from "../utils/format.js";
import { getServiceErrorMessage } from "../utils/messages.js";

function logProjectDetailPermissionFailure(source, error) {
  if (import.meta.env.DEV && error?.code === "permission-denied") {
    console.error("Project detail permission failed:", { source, error });
  }
}

function isPermissionDenied(error) {
  return error?.code === "permission-denied";
}

function normalizeStatus(status) {
  return String(status || "").trim().toLowerCase();
}

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [project, setProject] = useState(null);
  const [applications, setApplications] = useState([]);
  const [myApplication, setMyApplication] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [closing, setClosing] = useState(false);
  const [reopening, setReopening] = useState(false);
  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [reopenModalOpen, setReopenModalOpen] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [removingMemberId, setRemovingMemberId] = useState("");
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  const isOwner = useMemo(() => user && project?.ownerId === user.uid, [project, user]);
  const myApplicationStatus = normalizeStatus(myApplication?.status);
  const canWithdrawApplication = myApplicationStatus === "pending";
  const hasAcceptedApplication = myApplicationStatus === "accepted";
  const canApply = project?.status === "Open" && isAuthenticated && !isOwner && !myApplication;
  const canViewTeamWorkspace = isOwner || hasAcceptedApplication;

  useEffect(() => {
    if (authLoading) return undefined;

    if (!isAuthenticated || !user) {
      setProject(null);
      setApplications([]);
      setMyApplication(null);
      setLoading(false);
      return undefined;
    }

    let mounted = true;

    async function loadProject() {
      setLoading(true);
      setLoadError("");
      setSubmitError("");
      try {
        const data = await getProject(projectId);
        if (!mounted) return;
        setProject(data);

        if (data && user) {
          const isProjectOwner = data.ownerId === user.uid;
          let existingApplication = null;

          if (!isProjectOwner) {
            if (mounted) setSubmitError("");
            try {
              existingApplication = await getApplicationForProject(data.id, user.uid);
              if (mounted) setMyApplication(existingApplication);
            } catch (err) {
              logProjectDetailPermissionFailure("my application query", err);
              if (!isPermissionDenied(err)) {
                throw err;
              }
              if (mounted) setSubmitError("");
              if (mounted) setMyApplication(null);
            }
          } else if (mounted) {
            setMyApplication(null);
          }

          const canViewTeamWorkspace = isProjectOwner || normalizeStatus(existingApplication?.status) === "accepted";

          if (canViewTeamWorkspace) {
            try {
              const applicants = await listApplicationsByProject(data.id, {
                ownerId: isProjectOwner ? user.uid : undefined,
                acceptedOnly: !isProjectOwner,
              });
              if (mounted) setApplications(applicants);
            } catch (err) {
              logProjectDetailPermissionFailure(
                isProjectOwner ? "owner applications query" : "accepted team workspace query",
                err
              );
              if (!isPermissionDenied(err)) {
                throw err;
              }
              if (mounted) setSubmitError("");
              if (mounted) setApplications([]);
            }
          }
        }
      } catch (err) {
        logProjectDetailPermissionFailure("project detail core load", err);
        if (mounted) setLoadError(getServiceErrorMessage(err, "Could not load project."));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProject();
    return () => {
      mounted = false;
    };
  }, [authLoading, isAuthenticated, projectId, user]);

  async function handleApply(event) {
    event.preventDefault();

    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/projects/${projectId}` } });
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const cleanMessage = message.trim();
      if (!cleanMessage) {
        setSubmitError("Please add a short application message.");
        return;
      }

      const profile = await getUserProfile(user.uid);
      const applicationId = await createApplication({
        projectId: project.id,
        projectTitle: project.title,
        ownerId: project.ownerId,
        applicantId: user.uid,
        applicantName: profile?.fullName || user.displayName || user.email,
        applicantEmail: user.email,
        applicantRole: profile?.roleTitle || profile?.experienceLevel || "Builder",
        applicantSkills: profile?.skills || [],
        message: cleanMessage,
      });
      setMyApplication({ id: applicationId, status: "Pending", message: cleanMessage });
      setProject((current) =>
        current ? { ...current, applicantCount: (current.applicantCount || 0) + 1 } : current
      );
      setMessage("");
      toast.success("Application submitted. The project owner can now review it.");
    } catch (err) {
      console.error("Apply submit failed:", err);
      setSubmitError(getServiceErrorMessage(err, "Could not submit application."));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusChange(applicationId, status) {
    const result = await updateApplicationStatus(applicationId, user.uid, status);
    setApplications((current) =>
      current.map((application) =>
        application.id === applicationId ? { ...application, status, ...(result?.applicationPatch || {}) } : application
      )
    );
    return result;
  }

  async function handleWithdrawApplication() {
    if (!user || !project || !myApplication) return;

    if (hasAcceptedApplication) {
      toast.info("You are already part of this project.");
      return;
    }

    if (!canWithdrawApplication) {
      toast.info("Only pending applications can be withdrawn.");
      return;
    }

    setWithdrawing(true);
    setSubmitError("");

    try {
      await withdrawApplication({ projectId: project.id, applicantId: user.uid });
      setMyApplication(null);
      setProject((current) =>
        current ? { ...current, applicantCount: Math.max(0, (current.applicantCount || 0) - 1) } : current
      );
      setWithdrawModalOpen(false);
      toast.success("Application withdrawn.");
    } catch (err) {
      console.error("Withdraw application failed:", err);
      const message = getServiceErrorMessage(err, "Could not withdraw application.");
      setSubmitError(message);
      toast.error(message);
    } finally {
      setWithdrawing(false);
    }
  }

  async function handleLeaveProject() {
    if (!user || !project || !myApplication) return;

    if (!hasAcceptedApplication) {
      toast.info("Only accepted members can leave a project.");
      return;
    }

    setLeaving(true);
    setSubmitError("");

    try {
      await leaveProject({ projectId: project.id, applicantId: user.uid });
      setMyApplication((current) => (current ? { ...current, status: "Left" } : current));
      setApplications([]);
      setLeaveModalOpen(false);
      toast.success("You left this project.");
    } catch (err) {
      const message = getServiceErrorMessage(err, "Could not leave project.");
      setSubmitError(message);
      toast.error(message);
    } finally {
      setLeaving(false);
    }
  }

  async function handleRemoveMember() {
    if (!isOwner || !user || !memberToRemove) return;

    setRemovingMemberId(memberToRemove.id);

    try {
      await removeProjectMember({ applicationId: memberToRemove.id, ownerId: user.uid });
      setApplications((current) =>
        current.map((application) =>
          application.id === memberToRemove.id ? { ...application, status: "Removed" } : application
        )
      );
      toast.success(`${memberToRemove.applicantName || "Member"} removed from the project.`);
      setMemberToRemove(null);
    } catch (err) {
      const message = getServiceErrorMessage(err, "Could not remove member.");
      toast.error(message);
    } finally {
      setRemovingMemberId("");
    }
  }

  async function handleCloseProject() {
    if (!isOwner || !user) return;

    if (project.status === "Closed") {
      toast.info("This project is already closed.");
      return;
    }

    setClosing(true);

    try {
      await closeProject(project.id, user.uid);
      setProject((current) => (current ? { ...current, status: "Closed" } : current));
      setCloseModalOpen(false);
      toast.success("Project closed. Applications were preserved.");
    } catch (err) {
      const message = getServiceErrorMessage(err, "Could not close project.");
      toast.error(message);
    } finally {
      setClosing(false);
    }
  }

  async function handleReopenProject() {
    if (!isOwner || !user) return;

    if (project.status !== "Closed") {
      toast.info("Only closed projects can be reopened.");
      return;
    }

    setReopening(true);

    try {
      await reopenProject(project.id, user.uid);
      setProject((current) => (current ? { ...current, status: "Open" } : current));
      setReopenModalOpen(false);
      toast.success("Project reopened and visible in project discovery.");
    } catch (err) {
      const message = getServiceErrorMessage(err, "Could not reopen project.");
      toast.error(message);
    } finally {
      setReopening(false);
    }
  }

  async function handleDeleteProject() {
    if (!isOwner || !user) return;

    setDeleting(true);

    try {
      await deleteProjectWithApplications(project.id, user.uid);
      setDeleteModalOpen(false);
      navigate("/projects", { state: { notice: "Project deleted." } });
    } catch (err) {
      const message = getServiceErrorMessage(err, "Could not delete project.");
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return <LoadingState label="Loading project" />;
  }

  if (!project) {
    return (
      <main className="page-shell py-10">
        <EmptyState title="Project not found" description="This project may have been removed or the link may be incorrect." actionLabel="Browse Projects" actionTo="/projects" />
      </main>
    );
  }

  return (
    <main className="page-shell page-reveal py-5 sm:py-8">
      <Link to="/projects" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-white/55 transition hover:text-white">
        <ArrowLeft size={16} />
        Back to projects
      </Link>

      {loadError ? (
        <Alert variant="error" className="mb-5">
          {loadError}
        </Alert>
      ) : null}

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px]">
        <section className="grid gap-5">
          <article className="panel-soft overflow-hidden p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <StatusBadge status={project.status} />
              <span className="rounded-full border border-line bg-white/[0.025] px-2.5 py-1 text-xs font-medium text-white/48">{project.type}</span>
            </div>
            <h1 className="break-words text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">{project.title}</h1>
            <p className="mt-4 max-w-4xl whitespace-pre-line break-words text-sm leading-7 text-white/58 sm:text-base">{project.description}</p>

            <div className="mt-5 flex min-w-0 items-center gap-3 rounded-lg border border-line bg-white/[0.02] p-3">
              <Avatar name={project.ownerName} size="md" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{project.ownerName || "Unknown builder"}</p>
                <p className="text-xs text-white/42">Project owner</p>
              </div>
            </div>
          </article>

          <article className="panel p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-white">Required skills</h2>
                <p className="mt-1 text-sm text-white/42">The capabilities this team is looking for.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.requiredSkills?.length ? (
                project.requiredSkills.map((skill) => (
                  <span className="chip-strong" key={skill}>
                    {skill}
                  </span>
                ))
              ) : (
                <span className="rounded-full border border-dashed border-line px-3 py-1 text-xs text-white/38">
                  No specific skills listed
                </span>
              )}
            </div>
          </article>

          <article className="panel p-4">
            <h2 className="mb-4 text-xl font-semibold text-white">Project details</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <DetailStat icon={Users} label="Team size" value={project.teamSize || 1} />
              <DetailStat icon={UserCheck} label="Applicants" value={project.applicantCount || 0} />
              <DetailStat icon={Layers} label="Type" value={project.type} />
              <DetailStat icon={CalendarDays} label="Posted" value={formatDate(project.createdAt)} />
            </div>
          </article>
        </section>

        <aside className="grid content-start gap-5 lg:sticky lg:top-[145px] lg:self-start">
          <section className="panel p-4">
            <h2 className="font-semibold text-white">{isOwner ? "Owner controls" : "Application"}</h2>
            <p className="mt-1 text-sm leading-6 text-white/44">
              {isOwner ? "Manage this project lifecycle and applicant access." : "Apply with a short, focused note about your fit."}
            </p>

            {isOwner ? (
              <div className="mt-4 grid gap-4">
                <div className="rounded-lg border border-line bg-white/[0.02] p-3">
                  <p className="text-sm font-semibold text-white/78">You own this project</p>
                  <p className="mt-2 text-sm leading-6 text-white/54">
                    Applicants are preserved when you close a project. Deleting removes the project and its applications.
                  </p>
                </div>

                <div className="grid gap-2">
                  <Button as="link" to={`/projects/${project.id}/edit`} variant="secondary" className="w-full">
                    <Edit3 size={16} />
                    Edit Project
                  </Button>
                  <Button
                    variant="secondary"
                    disabled={closing || project.status === "Closed"}
                    onClick={() => setCloseModalOpen(true)}
                    className="w-full border-amber/30 bg-amber/10 text-amber hover:border-amber/45 hover:bg-amber/15"
                  >
                    <LockKeyhole size={16} />
                    {closing ? "Closing..." : project.status === "Closed" ? "Project Closed" : "Close Project"}
                  </Button>
                  {project.status === "Closed" ? (
                    <Button
                      variant="success"
                      disabled={reopening}
                      onClick={() => setReopenModalOpen(true)}
                      className="w-full"
                    >
                      <RotateCcw size={16} />
                      {reopening ? "Reopening..." : "Reopen Project"}
                    </Button>
                  ) : null}
                  <Button variant="danger" disabled={deleting} onClick={() => setDeleteModalOpen(true)} className="w-full">
                    <Trash2 size={16} />
                    Delete Project
                  </Button>
                </div>
              </div>
            ) : myApplication ? (
              <div className="mt-4 rounded-lg border border-line bg-white/[0.02] p-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-semibold text-white">Your application status</p>
                  {canWithdrawApplication ? (
                    <span className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-white/[0.025] px-3 py-1 text-xs font-semibold text-white/58">
                      <CheckCircle2 size={14} />
                      Applied
                    </span>
                  ) : null}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <StatusBadge status={myApplication.status} />
                </div>
                {normalizeStatus(myApplication?.status) === "pending" ? (
                  <Button
                    variant="secondary"
                    disabled={withdrawing}
                    onClick={() => setWithdrawModalOpen(true)}
                    className="mt-4 w-full"
                  >
                    <Trash2 size={16} />
                    {withdrawing ? "Withdrawing..." : "Withdraw Application"}
                  </Button>
                ) : null}
                {myApplication.message ? (
                  <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-white/48">{myApplication.message}</p>
                ) : null}
                {hasAcceptedApplication ? (
                  <>
                    <p className="mt-4 rounded-lg border border-line bg-white/[0.02] px-3 py-2 text-sm leading-6 text-white/56">
                      You are already part of this project.
                    </p>
                    <Button
                      variant="secondary"
                      disabled={leaving}
                      onClick={() => setLeaveModalOpen(true)}
                      className="mt-4 w-full border-amber/30 bg-amber/10 text-amber hover:border-amber/45 hover:bg-amber/15"
                    >
                      <LogOut size={16} />
                      {leaving ? "Leaving..." : "Leave Project"}
                    </Button>
                  </>
                ) : null}
                {submitError ? (
                  <div className="mt-4">
                    <Alert variant="error">{submitError}</Alert>
                  </div>
                ) : null}
              </div>
            ) : project.status !== "Open" ? (
              <p className="mt-4 text-sm leading-6 text-white/56">Applications are closed because this project is {project.status.toLowerCase()}.</p>
            ) : !isAuthenticated ? (
              <Button as="link" to="/login" state={{ from: `/projects/${project.id}` }} className="mt-5 w-full">
                Login to Apply
                <ExternalLink size={16} />
              </Button>
            ) : (
              <form className="mt-4 grid gap-3" onSubmit={handleApply}>
                {submitError ? (
                  <Alert variant="error">
                    {submitError}
                  </Alert>
                ) : null}
                <textarea
                  className="input min-h-32 resize-y"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  required
                  placeholder="Tell the owner why you are a strong fit."
                />
                <Button type="submit" disabled={!canApply || submitting} className="w-full">
                  <Send size={16} />
                  {submitting ? "Applying..." : "Apply to Project"}
                </Button>
              </form>
            )}
          </section>
        </aside>
      </section>

      {canViewTeamWorkspace ? (
      <section className="mt-5">
          <TeamSection
            applications={applications}
            currentUserId={user?.uid}
            isOwner={Boolean(isOwner)}
            leaving={leaving}
            onLeaveProject={() => setLeaveModalOpen(true)}
            onRemoveMember={(member) => setMemberToRemove(member)}
            project={project}
            removingMemberId={removingMemberId}
            visible
          />
        </section>
      ) : null}

      {isOwner ? (
        <section className="mt-7">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Applicants</h2>
              <p className="mt-1 text-sm text-white/42">Review and decide who should join the team.</p>
            </div>
            <span className="rounded-full border border-line bg-white/[0.025] px-3 py-1 text-sm text-white/50">{applications.length} total</span>
          </div>
          <ApplicationList applications={applications} ownerView onStatusChange={handleStatusChange} />
        </section>
      ) : null}

      <ConfirmModal
        open={isOwner && closeModalOpen}
        title="Close project?"
        description="Closing removes this project from active discovery and prevents new applications. Existing applications and chats are preserved."
        confirmLabel="Close Project"
        submittingLabel="Closing..."
        variant="warning"
        submitting={closing}
        onCancel={() => setCloseModalOpen(false)}
        onConfirm={handleCloseProject}
      />

      <ConfirmModal
        open={isOwner && reopenModalOpen}
        title="Reopen project?"
        description="This moves the project back to Open so builders can discover it and apply again."
        confirmLabel="Reopen Project"
        submittingLabel="Reopening..."
        variant="success"
        submitting={reopening}
        onCancel={() => setReopenModalOpen(false)}
        onConfirm={handleReopenProject}
      />

      <ConfirmModal
        open={!isOwner && normalizeStatus(myApplication?.status) === "pending" && withdrawModalOpen}
        title="Withdraw your application?"
        description="This removes your application from the owner's applicant list. You can apply again later while the project is open."
        confirmLabel="Withdraw"
        submittingLabel="Withdrawing..."
        variant="warning"
        submitting={withdrawing}
        onCancel={() => setWithdrawModalOpen(false)}
        onConfirm={handleWithdrawApplication}
      />

      <ConfirmModal
        open={!isOwner && hasAcceptedApplication && leaveModalOpen}
        title="Leave project?"
        description="Leaving removes you from the team workspace and revokes your chat access. The project owner will be notified."
        confirmLabel="Leave Project"
        submittingLabel="Leaving..."
        variant="warning"
        submitting={leaving}
        onCancel={() => setLeaveModalOpen(false)}
        onConfirm={handleLeaveProject}
      />

      <ConfirmModal
        open={isOwner && Boolean(memberToRemove)}
        title="Remove member?"
        description={`Remove ${memberToRemove?.applicantName || "this member"} from the team workspace and revoke their chat access.`}
        confirmLabel="Remove Member"
        submittingLabel="Removing..."
        variant="danger"
        submitting={Boolean(removingMemberId)}
        onCancel={() => setMemberToRemove(null)}
        onConfirm={handleRemoveMember}
      />

      <ConfirmModal
        open={isOwner && deleteModalOpen}
        title="Delete project?"
        description="This permanently deletes the project and all related applications. This cannot be undone."
        confirmLabel="Delete Project"
        submittingLabel="Deleting..."
        variant="danger"
        submitting={deleting}
        onCancel={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteProject}
      />
    </main>
  );
}

function DetailStat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-line bg-white/[0.02] p-3">
      <span className="mb-3 inline-flex rounded-lg border border-line bg-ink-700 p-1.5 text-white/48">
        <Icon size={15} />
      </span>
      <strong className="block break-words text-lg font-bold text-white">{value}</strong>
      <span className="mt-1 block text-xs font-semibold uppercase tracking-[0.08em] text-white/36">{label}</span>
    </div>
  );
}
