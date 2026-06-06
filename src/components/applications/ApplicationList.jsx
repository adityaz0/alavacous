import { ArrowUpRight, CalendarDays, Check, Mail, MessageSquare, X } from "lucide-react";
import { useState } from "react";
import { getProjectChatId } from "../../services/firestore.js";
import { formatDate } from "../../utils/format.js";
import { getServiceErrorMessage } from "../../utils/messages.js";
import Alert from "../ui/Alert.jsx";
import Avatar from "../ui/Avatar.jsx";
import Button from "../ui/Button.jsx";
import EmptyState from "../ui/EmptyState.jsx";
import StatusBadge from "../ui/StatusBadge.jsx";
import { useToast } from "../ui/ToastProvider.jsx";

export default function ApplicationList({
  applications,
  ownerView = false,
  onStatusChange,
  emptyTitle,
  emptyDescription,
  emptyActionLabel,
  emptyActionTo,
}) {
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");
  const toast = useToast();

  async function handleStatusClick(application, status) {
    if (!onStatusChange) {
      toast.error("Application review is not available right now.");
      return;
    }

    setUpdatingId(application.id);
    setError("");

    try {
      await onStatusChange(application.id, status);
      toast.success(`${application.applicantName || "Application"} ${status.toLowerCase()}.`);
    } catch (err) {
      const message = getServiceErrorMessage(err, "Could not update application status.");
      setError(message);
      toast.error(message);
    } finally {
      setUpdatingId("");
    }
  }

  if (!applications?.length) {
    return (
      <EmptyState
        title={emptyTitle || (ownerView ? "No applicants yet" : "No applications sent")}
        description={
          emptyDescription ||
          (ownerView
            ? "When builders apply to your projects, their profiles and messages will show up here."
            : "Explore open projects and apply to teams that fit your skills.")
        }
        actionLabel={emptyActionLabel ?? (ownerView ? undefined : "Browse Projects")}
        actionTo={emptyActionTo ?? (ownerView ? undefined : "/projects")}
      />
    );
  }

  return (
    <div className="grid gap-3">
      {error ? <Alert variant="error">{error}</Alert> : null}

      <div className="panel overflow-hidden">
        {applications.map((application) => (
          <article className="border-b border-line px-3.5 py-3 last:border-b-0 sm:px-4" key={application.id}>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 items-start gap-3">
                  <Avatar
                    name={ownerView ? application.applicantName : application.projectTitle}
                    email={application.applicantEmail}
                    size="sm"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="break-words text-sm font-semibold text-white">
                        {ownerView ? application.applicantName || "Applicant" : application.projectTitle}
                      </h3>
                      <StatusBadge status={application.status} />
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/38">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays size={12} />
                        {formatDate(application.createdAt)}
                      </span>
                      {ownerView && application.applicantEmail ? (
                        <span className="inline-flex min-w-0 items-center gap-1.5">
                          <Mail size={12} />
                          <span className="truncate">{application.applicantEmail}</span>
                        </span>
                      ) : null}
                      {ownerView ? <span className="break-words">Project: {application.projectTitle}</span> : null}
                    </div>

                    {ownerView && application.applicantSkills?.length ? (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {application.applicantSkills.slice(0, 5).map((skill) => (
                          <span className="chip" key={skill}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-3 rounded-lg border border-line bg-white/[0.02] px-3 py-2">
                      <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/30">
                        <MessageSquare size={12} />
                        Message
                      </div>
                      <p className="whitespace-pre-wrap break-words text-sm leading-6 text-white/52">
                        {application.message || "No message provided."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid shrink-0 gap-2 sm:grid-cols-3 lg:w-40 lg:grid-cols-1">
                <Button as="link" to={`/projects/${application.projectId}`} variant="secondary">
                  <ArrowUpRight size={15} />
                  View
                </Button>
                {ownerView && application.status === "Pending" ? (
                  <>
                    <Button
                      variant="success"
                      disabled={updatingId === application.id}
                      onClick={() => handleStatusClick(application, "Accepted")}
                    >
                      <Check size={15} />
                      {updatingId === application.id ? "Updating..." : "Accept"}
                    </Button>
                    <Button
                      variant="danger"
                      disabled={updatingId === application.id}
                      onClick={() => handleStatusClick(application, "Rejected")}
                    >
                      <X size={15} />
                      {updatingId === application.id ? "Updating..." : "Reject"}
                    </Button>
                  </>
                ) : null}
                {application.status === "Accepted" ? (
                  <Button as="link" to={`/chats/${application.chatId || getProjectChatId(application.projectId, application.applicantId)}`} variant="secondary">
                    <MessageSquare size={15} />
                    Chat
                  </Button>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
