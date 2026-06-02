import { ArrowUpRight, FolderKanban, Inbox, Send, Sparkles, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import ApplicationList from "../components/applications/ApplicationList.jsx";
import ProjectCard from "../components/projects/ProjectCard.jsx";
import Alert from "../components/ui/Alert.jsx";
import Avatar from "../components/ui/Avatar.jsx";
import Button from "../components/ui/Button.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import LoadingState from "../components/ui/LoadingState.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  getUserProfile,
  listApplicationsByApplicant,
  listApplicationsByOwner,
  listProjectsByOwner,
  updateApplicationStatus,
} from "../services/firestore.js";
import { getServiceErrorMessage } from "../utils/messages.js";

export default function DashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [myProjects, setMyProjects] = useState([]);
  const [sentApplications, setSentApplications] = useState([]);
  const [receivedApplications, setReceivedApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    setLoading(true);
    setError("");
    try {
      const [profileData, projectsData, sentData, receivedData] = await Promise.all([
        getUserProfile(user.uid),
        listProjectsByOwner(user.uid),
        listApplicationsByApplicant(user.uid),
        listApplicationsByOwner(user.uid),
      ]);
      setProfile(profileData);
      setMyProjects(projectsData);
      setSentApplications(sentData);
      setReceivedApplications(receivedData);
    } catch (err) {
      setError(getServiceErrorMessage(err, "Could not load dashboard."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, [user.uid]);

  async function handleStatusChange(applicationId, status) {
    await updateApplicationStatus(applicationId, status);
    setReceivedApplications((current) =>
      current.map((application) => (application.id === applicationId ? { ...application, status } : application))
    );
  }

  if (loading) {
    return <LoadingState label="Loading dashboard" />;
  }

  const profileChecks = [
    profile?.fullName,
    profile?.username,
    profile?.bio,
    profile?.skills?.length,
    profile?.location,
    profile?.portfolioUrl || profile?.githubUrl || profile?.linkedinUrl,
  ];
  const profileCompletion = Math.round((profileChecks.filter(Boolean).length / profileChecks.length) * 100);
  const pendingSent = sentApplications.filter((application) => application.status === "Pending").length;
  const pendingReceived = receivedApplications.filter((application) => application.status === "Pending").length;
  const openProjects = myProjects.filter((project) => project.status === "Open").length;

  return (
    <main className="page-shell page-reveal py-6 sm:py-10">
      <section className="panel-soft glass-reflect mb-6 overflow-hidden p-5 sm:p-6">
        <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan/55 to-transparent" aria-hidden="true" />
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="label text-mint">Dashboard</p>
            <h1 className="mt-2 text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">Your collaboration cockpit</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/56">
              Track your builder identity, project ownership, sent applications, and applicant review queue in one focused workspace.
            </p>
          </div>
          <Button as="link" to="/projects/new" className="w-full sm:w-auto">
            <Sparkles size={16} />
            Post Project
          </Button>
        </div>
      </section>

      {error ? (
        <Alert variant="error" className="mb-5">
          {error}
        </Alert>
      ) : null}

      <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={UserRound} label="Profile completion" value={`${profileCompletion}%`} detail={profile?.username ? "Identity ready" : "Needs username"} />
        <Metric icon={FolderKanban} label="My projects" value={myProjects.length} detail="Owned opportunities" />
        <Metric icon={Send} label="Sent" value={sentApplications.length} detail="Applications out" />
        <Metric icon={Inbox} label="Received" value={receivedApplications.length} detail="Applicant queue" />
      </section>

      <section className="mb-8 grid min-w-0 gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <article className="panel interactive-panel overflow-hidden p-5">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <Avatar name={profile?.fullName || user.displayName} email={user.email} size="lg" />
              <div className="min-w-0">
                <h2 className="break-words text-lg font-semibold text-white">{profile?.fullName || user.displayName || "Complete your profile"}</h2>
                <p className="truncate text-sm text-white/48">@{profile?.username || "username"} / {profile?.experienceLevel || "Experience level"}</p>
              </div>
            </div>
            <Button as="link" to="/profile" variant="secondary" className="w-full sm:w-auto">
              Edit Profile
            </Button>
          </div>
          <p className={`mt-5 text-sm leading-6 ${profile?.bio ? "text-white/60" : "text-white/38"}`}>
            {profile?.bio || "Add a bio so owners and applicants understand what you build."}
          </p>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/[0.08]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan to-mint shadow-[0_0_24px_rgba(103,232,249,0.28)]"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {profile?.skills?.length ? (
              profile.skills.slice(0, 8).map((skill) => (
                <span className="chip-strong" key={skill}>
                  {skill}
                </span>
              ))
            ) : (
              <span className="rounded-full border border-dashed border-white/[0.14] px-3 py-1 text-xs text-white/38">
                Add skills to sharpen your profile
              </span>
            )}
          </div>
        </article>

        <article className="panel interactive-panel overflow-hidden p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-white">Workspace signal</h2>
              <p className="mt-1 text-sm text-white/44">A quick read on your current collaboration activity.</p>
            </div>
            <span className="rounded-lg border border-cyan/20 bg-cyan/10 p-2 text-cyan">
              <ArrowUpRight size={18} />
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Signal label="Open projects" value={openProjects} />
            <Signal label="Pending sent" value={pendingSent} />
            <Signal label="Pending received" value={pendingReceived} />
          </div>
        </article>
      </section>

      <section className="mb-10">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">My projects</h2>
            <p className="mt-1 text-sm text-white/42">Projects you own and manage.</p>
          </div>
          <Button as="link" to="/projects/new" variant="secondary" className="w-full sm:w-auto">
            Post Project
          </Button>
        </div>
        {myProjects.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {myProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <EmptyState title="No projects yet" description="Post a project to start receiving applications from builders." actionLabel="Post Project" actionTo="/projects/new" />
        )}
      </section>

      <section className="mb-10">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-white">Applications I sent</h2>
          <p className="mt-1 text-sm text-white/42">Teams you have asked to join.</p>
        </div>
        <ApplicationList applications={sentApplications} />
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-white">Applications received</h2>
          <p className="mt-1 text-sm text-white/42">Builders waiting on your decision.</p>
        </div>
        <ApplicationList applications={receivedApplications} ownerView onStatusChange={handleStatusChange} />
      </section>
    </main>
  );
}

function Metric({ icon: Icon, label, value, detail }) {
  return (
    <article className="panel interactive-panel overflow-hidden p-4">
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/28 to-transparent" aria-hidden="true" />
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-lg border border-cyan/20 bg-cyan/10 p-2 text-cyan shadow-[0_0_26px_rgba(103,232,249,0.08)]">
          <Icon size={18} />
        </span>
      </div>
      <strong className="block text-3xl font-black tracking-[-0.02em] text-white">{value}</strong>
      <span className="mt-1 block text-sm text-white/62">{label}</span>
      <span className="mt-2 block text-xs text-white/34">{detail}</span>
    </article>
  );
}

function Signal({ label, value }) {
  return (
    <div className="rounded-lg border border-white/[0.1] bg-white/[0.045] p-4">
      <strong className="block text-2xl font-black text-white">{value}</strong>
      <span className="mt-1 block text-xs font-semibold uppercase tracking-[0.14em] text-white/38">{label}</span>
    </div>
  );
}
