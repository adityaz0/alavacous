import { ArrowUpRight, Bell, CheckCircle, FolderKanban, Inbox, MessageCircle, Send, Sparkles, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ApplicationList from "../components/applications/ApplicationList.jsx";
import ProjectCard from "../components/projects/ProjectCard.jsx";
import Alert from "../components/ui/Alert.jsx";
import Avatar from "../components/ui/Avatar.jsx";
import Button from "../components/ui/Button.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import LoadingState from "../components/ui/LoadingState.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  getUserProfile,
  getProjectChatId,
  listApplicationsByApplicant,
  listApplicationsByOwner,
  listNotifications,
  listProjectsByOwner,
  listUserChats,
  updateApplicationStatus,
} from "../services/firestore.js";
import { formatDateTime } from "../utils/format.js";
import { getServiceErrorMessage } from "../utils/messages.js";

export default function DashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [myProjects, setMyProjects] = useState([]);
  const [sentApplications, setSentApplications] = useState([]);
  const [receivedApplications, setReceivedApplications] = useState([]);
  const [activeChats, setActiveChats] = useState([]);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    setLoading(true);
    setError("");
    try {
      const [profileData, projectsData, sentData, receivedData, chatsData, notificationsData] = await Promise.all([
        getUserProfile(user.uid),
        listProjectsByOwner(user.uid),
        listApplicationsByApplicant(user.uid),
        listApplicationsByOwner(user.uid),
        listUserChats(user.uid),
        listNotifications(user.uid),
      ]);
      setProfile(profileData);
      setMyProjects(projectsData);
      setSentApplications(sentData);
      setReceivedApplications(receivedData);
      setActiveChats(chatsData);
      setRecentNotifications(notificationsData);
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
    const result = await updateApplicationStatus(applicationId, user.uid, status);
    setReceivedApplications((current) =>
      current.map((application) =>
        application.id === applicationId ? { ...application, status, ...(result?.applicationPatch || {}) } : application
      )
    );
    if (status === "Accepted") {
      const [chatsData, notificationsData] = await Promise.all([listUserChats(user.uid), listNotifications(user.uid)]);
      setActiveChats(chatsData);
      setRecentNotifications(notificationsData);
    }
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
  const pendingSentApplications = sentApplications.filter((application) => application.status === "Pending");
  const pendingReceivedApplications = receivedApplications.filter((application) => application.status === "Pending");
  const joinedApplications = sentApplications.filter((application) => application.status === "Accepted");
  const openProjects = myProjects.filter((project) => project.status === "Open").length;

  function scrollToSection(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

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
        <Metric icon={UserRound} label="Profile completion" value={`${profileCompletion}%`} detail={profile?.username ? "Identity ready" : "Needs username"} to="/profile" />
        <Metric icon={FolderKanban} label="My projects" value={myProjects.length} detail="Owned opportunities" onClick={() => scrollToSection("my-projects")} />
        <Metric icon={Send} label="Sent" value={sentApplications.length} detail="Applications out" onClick={() => scrollToSection("applications-sent")} />
        <Metric icon={Inbox} label="Received" value={receivedApplications.length} detail="Applicant queue" onClick={() => scrollToSection("applications-received")} />
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
            <Signal label="Open projects" value={openProjects} onClick={() => scrollToSection("my-projects")} />
            <Signal label="Pending sent" value={pendingSent} onClick={() => scrollToSection("pending-actions")} />
            <Signal label="Pending received" value={pendingReceived} onClick={() => scrollToSection("pending-actions")} />
          </div>
        </article>
      </section>

      <section className="mb-10 grid gap-6 xl:grid-cols-2">
        <article className="scroll-mt-24" id="active-chats">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Active Chats</h2>
              <p className="mt-1 text-sm text-white/42">Rooms created after accepted applications.</p>
            </div>
            <Button as="link" to="/chats" variant="secondary" className="w-full sm:w-auto">
              Open Chats
            </Button>
          </div>
          {activeChats.length ? (
            <div className="grid gap-3">
              {activeChats.slice(0, 4).map((chat) => (
                <ChatPreview chat={chat} currentUserId={user.uid} key={chat.id} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No active chats"
              description="Accept an applicant or get accepted into a project to open your first collaboration room."
              actionLabel="Explore Projects"
              actionTo="/projects"
            />
          )}
        </article>

        <article className="scroll-mt-24" id="recent-notifications">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Recent Notifications</h2>
              <p className="mt-1 text-sm text-white/42">Application decisions and chat activity.</p>
            </div>
            <Button as="link" to="/notifications" variant="secondary" className="w-full sm:w-auto">
              View All
            </Button>
          </div>
          {recentNotifications.length ? (
            <div className="grid gap-3">
              {recentNotifications.slice(0, 4).map((notification) => (
                <NotificationPreview notification={notification} key={notification.id} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No notifications yet"
              description="You will see accepted applications, rejected applications, and new chat messages here."
              actionLabel="Open Dashboard"
              actionTo="/dashboard"
            />
          )}
        </article>
      </section>

      <section className="mb-10 scroll-mt-24" id="pending-actions">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-white">Pending Actions</h2>
          <p className="mt-1 text-sm text-white/42">Applications that still need attention.</p>
        </div>
        <div className="grid gap-5 xl:grid-cols-2">
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-white/46">Pending received</h3>
            <ApplicationList
              applications={pendingReceivedApplications}
              ownerView
              onStatusChange={handleStatusChange}
              emptyTitle="No received applications"
              emptyDescription="Share your project to start receiving applicants from builders."
              emptyActionLabel="Share your project"
              emptyActionTo="/projects/new"
            />
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-white/46">Pending sent</h3>
            <ApplicationList
              applications={pendingSentApplications}
              emptyTitle="No sent applications"
              emptyDescription="Explore open projects and apply to teams that fit your skills."
              emptyActionLabel="Explore Projects"
              emptyActionTo="/projects"
            />
          </div>
        </div>
      </section>

      <section className="mb-10 scroll-mt-24" id="my-projects">
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

      <section className="mb-10 scroll-mt-24" id="projects-joined">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-white">Projects I Joined</h2>
          <p className="mt-1 text-sm text-white/42">Teams where your application has been accepted.</p>
        </div>
        {joinedApplications.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {joinedApplications.map((application) => (
              <JoinedProjectCard application={application} key={application.id} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No joined projects yet"
            description="Accepted applications become active teams here, with chat access attached."
            actionLabel="Explore Projects"
            actionTo="/projects"
          />
        )}
      </section>

      <section className="mb-10 scroll-mt-24" id="applications-sent">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-white">Projects I Applied To</h2>
          <p className="mt-1 text-sm text-white/42">Teams you have asked to join.</p>
        </div>
        <ApplicationList
          applications={sentApplications}
          emptyTitle="No sent applications"
          emptyDescription="Explore open projects and apply to teams that fit your skills."
          emptyActionLabel="Explore Projects"
          emptyActionTo="/projects"
        />
      </section>

      <section className="scroll-mt-24" id="applications-received">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-white">Applications Received</h2>
          <p className="mt-1 text-sm text-white/42">Builders waiting on your decision.</p>
        </div>
        <ApplicationList
          applications={receivedApplications}
          ownerView
          onStatusChange={handleStatusChange}
          emptyTitle="No received applications"
          emptyDescription="Share your project to start receiving applicants from builders."
          emptyActionLabel="Share your project"
          emptyActionTo="/projects/new"
        />
      </section>
    </main>
  );
}

function Metric({ icon: Icon, label, value, detail, to, onClick }) {
  const content = (
    <>
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/28 to-transparent" aria-hidden="true" />
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-lg border border-cyan/20 bg-cyan/10 p-2 text-cyan shadow-[0_0_26px_rgba(103,232,249,0.08)]">
          <Icon size={18} />
        </span>
        <span className="rounded-full border border-white/[0.1] bg-white/[0.04] p-1.5 text-white/38 transition group-hover:border-cyan/25 group-hover:text-cyan">
          <ArrowUpRight size={14} />
        </span>
      </div>
      <strong className="block text-3xl font-black tracking-[-0.02em] text-white">{value}</strong>
      <span className="mt-1 block text-sm text-white/62">{label}</span>
      <span className="mt-2 block text-xs text-white/34">{detail}</span>
    </>
  );

  const classes = "panel interactive-panel group relative min-w-0 overflow-hidden p-4 text-left cursor-pointer";

  if (to) {
    return (
      <Link className={classes} to={to}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} type="button" onClick={onClick}>
      {content}
    </button>
  );
}

function Signal({ label, value, onClick }) {
  return (
    <button
      type="button"
      className="group rounded-lg border border-white/[0.1] bg-white/[0.045] p-4 text-left transition hover:-translate-y-0.5 hover:border-cyan/25 hover:bg-cyan/10"
      onClick={onClick}
    >
      <span className="mb-2 inline-flex rounded-full border border-white/[0.08] bg-white/[0.04] p-1 text-white/34 transition group-hover:border-cyan/25 group-hover:text-cyan">
        <ArrowUpRight size={13} />
      </span>
      <strong className="block text-2xl font-black text-white">{value}</strong>
      <span className="mt-1 block text-xs font-semibold uppercase tracking-[0.14em] text-white/38">{label}</span>
    </button>
  );
}

function ChatPreview({ chat, currentUserId }) {
  const peerId = chat.members?.find((memberId) => memberId !== currentUserId);
  const peerName = chat.memberNames?.[peerId] || chat.memberNames?.[chat.applicantId] || "Project teammate";

  return (
    <Link to={`/chats/${chat.id}`} className="panel interactive-panel group overflow-hidden p-4">
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan/45 to-transparent" aria-hidden="true" />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-3 inline-flex rounded-lg border border-cyan/20 bg-cyan/10 p-2 text-cyan">
            <MessageCircle size={17} />
          </div>
          <h3 className="truncate text-base font-semibold text-white transition group-hover:text-cyan">{chat.projectTitle}</h3>
          <p className="mt-1 truncate text-sm text-white/42">with {peerName}</p>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/52">
            {chat.lastMessage || "Chat room ready. Send the first project update."}
          </p>
        </div>
        <ArrowUpRight className="shrink-0 text-white/36 transition group-hover:translate-x-0.5 group-hover:text-cyan" size={18} />
      </div>
    </Link>
  );
}

function NotificationPreview({ notification }) {
  return (
    <Link to={notification.link || "/notifications"} className="panel interactive-panel group overflow-hidden p-4">
      <div className="flex items-start gap-3">
        <span className="rounded-lg border border-cyan/20 bg-cyan/10 p-2 text-cyan">
          <Bell size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="break-words text-sm font-semibold text-white transition group-hover:text-cyan">{notification.title}</h3>
            {!notification.read ? (
              <span className="rounded-full border border-mint/25 bg-mint/10 px-2 py-0.5 text-[11px] font-semibold text-mint">
                New
              </span>
            ) : null}
          </div>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-white/52">{notification.message}</p>
          <p className="mt-2 text-xs text-white/32">{formatDateTime(notification.createdAt)}</p>
        </div>
      </div>
    </Link>
  );
}

function JoinedProjectCard({ application }) {
  const chatId = application.chatId || getProjectChatId(application.projectId, application.applicantId);

  return (
    <article className="panel interactive-panel overflow-hidden p-5">
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-mint/45 to-transparent" aria-hidden="true" />
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="label text-mint">Joined team</p>
          <h3 className="mt-2 line-clamp-2 break-words text-lg font-semibold text-white">{application.projectTitle}</h3>
        </div>
        <CheckCircle className="shrink-0 text-mint" size={20} />
      </div>
      <StatusBadge status={application.status} />
      <p className="mt-4 text-sm leading-6 text-white/50">
        Accepted {formatDateTime(application.updatedAt || application.createdAt)}
      </p>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <Button as="link" to={`/projects/${application.projectId}`} variant="secondary">
          View Project
        </Button>
        <Button as="link" to={`/chats/${chatId}`} variant="secondary">
          <MessageCircle size={16} />
          Chat
        </Button>
      </div>
    </article>
  );
}
