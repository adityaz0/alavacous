import { ArrowLeft, CalendarDays, ExternalLink, Layers, Send, UserCheck, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import ApplicationList from "../components/applications/ApplicationList.jsx";
import Alert from "../components/ui/Alert.jsx";
import Avatar from "../components/ui/Avatar.jsx";
import Button from "../components/ui/Button.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import LoadingState from "../components/ui/LoadingState.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import Toast from "../components/ui/Toast.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  createApplication,
  getApplicationForProject,
  getProject,
  getUserProfile,
  listApplicationsByProject,
  updateApplicationStatus,
} from "../services/firestore.js";
import { formatDate } from "../utils/format.js";
import { getServiceErrorMessage } from "../utils/messages.js";

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [project, setProject] = useState(null);
  const [applications, setApplications] = useState([]);
  const [myApplication, setMyApplication] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(location.state?.notice || "");

  const isOwner = useMemo(() => user && project?.ownerId === user.uid, [project, user]);
  const canApply = project?.status === "Open" && isAuthenticated && !isOwner && !myApplication;

  useEffect(() => {
    let mounted = true;

    async function loadProject() {
      setLoading(true);
      try {
        const data = await getProject(projectId);
        if (!mounted) return;
        setProject(data);

        if (data && user) {
          const existingApplication = await getApplicationForProject(data.id, user.uid);
          if (mounted) setMyApplication(existingApplication);

          if (data.ownerId === user.uid) {
            const applicants = await listApplicationsByProject(data.id);
            if (mounted) setApplications(applicants);
          }
        }
      } catch (err) {
        if (mounted) setError(getServiceErrorMessage(err, "Could not load project."));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProject();
    return () => {
      mounted = false;
    };
  }, [projectId, user]);

  async function handleApply(event) {
    event.preventDefault();

    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/projects/${projectId}` } });
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const cleanMessage = message.trim();
      if (!cleanMessage) {
        setError("Please add a short application message.");
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
        message: cleanMessage,
      });
      setMyApplication({ id: applicationId, status: "Pending", message: cleanMessage });
      setProject((current) =>
        current ? { ...current, applicantCount: (current.applicantCount || 0) + 1 } : current
      );
      setMessage("");
      setSuccess("Application submitted. The project owner can now review it.");
    } catch (err) {
      setError(getServiceErrorMessage(err, "Could not submit application."));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusChange(applicationId, status) {
    await updateApplicationStatus(applicationId, status);
    setApplications((current) =>
      current.map((application) => (application.id === applicationId ? { ...application, status } : application))
    );
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
    <main className="page-shell page-reveal py-6 sm:py-10">
      <Toast variant="success">{success}</Toast>

      <Link to="/projects" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-white/55 transition hover:text-white">
        <ArrowLeft size={16} />
        Back to projects
      </Link>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="grid gap-6">
          <article className="panel-soft glass-reflect overflow-hidden p-5 sm:p-7">
            <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan/55 to-transparent" aria-hidden="true" />
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <StatusBadge status={project.status} />
              <span className="rounded-full border border-line bg-white/[0.04] px-2.5 py-1 text-xs font-semibold text-white/52">{project.type}</span>
            </div>
            <h1 className="break-words text-3xl font-bold tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">{project.title}</h1>
            <p className="mt-5 max-w-4xl whitespace-pre-line break-words text-base leading-8 text-white/64">{project.description}</p>

            <div className="mt-7 flex min-w-0 items-center gap-3 rounded-lg border border-white/[0.1] bg-white/[0.04] p-3">
              <Avatar name={project.ownerName} size="md" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{project.ownerName || "Unknown builder"}</p>
                <p className="text-xs text-white/42">Project owner</p>
              </div>
            </div>
          </article>

          <article className="panel p-5 sm:p-6">
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
                <span className="rounded-full border border-dashed border-white/[0.14] px-3 py-1 text-xs text-white/38">
                  No specific skills listed
                </span>
              )}
            </div>
          </article>

          <article className="panel p-5 sm:p-6">
            <h2 className="mb-4 text-xl font-semibold text-white">Project details</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <DetailStat icon={Users} label="Team size" value={project.teamSize || 1} />
              <DetailStat icon={UserCheck} label="Applicants" value={project.applicantCount || 0} />
              <DetailStat icon={Layers} label="Type" value={project.type} />
              <DetailStat icon={CalendarDays} label="Posted" value={formatDate(project.createdAt)} />
            </div>
          </article>
        </section>

        <aside className="grid content-start gap-6">
          <section className="panel sticky top-24 p-5">
            <h2 className="font-semibold text-white">Application</h2>
            <p className="mt-1 text-sm leading-6 text-white/44">Apply with a short, focused note about your fit.</p>

            {error ? (
              <Alert variant="error" className="mt-4">
                {error}
              </Alert>
            ) : null}

            {isOwner ? (
              <div className="mt-4 rounded-lg border border-cyan/15 bg-cyan/10 p-4">
                <p className="text-sm font-semibold text-cyan">You own this project</p>
                <p className="mt-2 text-sm leading-6 text-white/54">Applicants are listed below with review actions.</p>
              </div>
            ) : myApplication ? (
              <div className="mt-4 rounded-lg border border-line bg-white/[0.045] p-4">
                <p className="text-sm font-semibold text-white">Your application status</p>
                <div className="mt-3">
                  <StatusBadge status={myApplication.status} />
                </div>
                {myApplication.message ? (
                  <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-white/48">{myApplication.message}</p>
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
      </div>

      {isOwner ? (
        <section className="mt-8">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Applicants</h2>
              <p className="mt-1 text-sm text-white/42">Review and decide who should join the team.</p>
            </div>
            <span className="rounded-full border border-line bg-white/[0.045] px-3 py-1 text-sm text-white/52">{applications.length} total</span>
          </div>
          <ApplicationList applications={applications} ownerView onStatusChange={handleStatusChange} />
        </section>
      ) : null}
    </main>
  );
}

function DetailStat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-white/[0.1] bg-white/[0.04] p-4">
      <span className="mb-3 inline-flex rounded-lg border border-cyan/20 bg-cyan/10 p-2 text-cyan">
        <Icon size={17} />
      </span>
      <strong className="block break-words text-lg font-bold text-white">{value}</strong>
      <span className="mt-1 block text-xs font-semibold uppercase tracking-[0.14em] text-white/38">{label}</span>
    </div>
  );
}
