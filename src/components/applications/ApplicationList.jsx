import { CalendarDays, Check, Mail, MessageSquare, X } from "lucide-react";
import { useState } from "react";
import { formatDate } from "../../utils/format.js";
import { getServiceErrorMessage } from "../../utils/messages.js";
import Alert from "../ui/Alert.jsx";
import Avatar from "../ui/Avatar.jsx";
import Button from "../ui/Button.jsx";
import EmptyState from "../ui/EmptyState.jsx";
import StatusBadge from "../ui/StatusBadge.jsx";
import Toast from "../ui/Toast.jsx";

export default function ApplicationList({ applications, ownerView = false, onStatusChange }) {
  const [updatingId, setUpdatingId] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function handleStatusClick(application, status) {
    if (!onStatusChange) {
      setError("Application review is not available right now.");
      return;
    }

    setUpdatingId(application.id);
    setNotice("");
    setError("");

    try {
      await onStatusChange(application.id, status);
      setNotice(`${application.applicantName || "Application"} ${status.toLowerCase()}.`);
    } catch (err) {
      setError(getServiceErrorMessage(err, "Could not update application status."));
    } finally {
      setUpdatingId("");
    }
  }

  if (!applications?.length) {
    return (
      <EmptyState
        title={ownerView ? "No applicants yet" : "No applications sent"}
        description={
          ownerView
            ? "When builders apply to your projects, their profiles and messages will show up here."
            : "Explore open projects and apply to teams that fit your skills."
        }
        actionLabel={ownerView ? undefined : "Browse Projects"}
        actionTo={ownerView ? undefined : "/projects"}
      />
    );
  }

  return (
    <div className="grid gap-3">
      <Toast variant="success">{notice}</Toast>
      {error ? <Alert variant="error">{error}</Alert> : null}

      {applications.map((application) => (
        <article className="panel interactive-panel overflow-hidden p-5" key={application.id}>
          <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/26 to-transparent" aria-hidden="true" />
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar
                    name={ownerView ? application.applicantName : application.projectTitle}
                    email={application.applicantEmail}
                    size="md"
                  />
                  <div className="min-w-0">
                    <h3 className="break-words text-base font-semibold text-white">
                      {ownerView ? application.applicantName || "Applicant" : application.projectTitle}
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/42">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays size={13} />
                        {formatDate(application.createdAt)}
                      </span>
                      {ownerView && application.applicantEmail ? (
                        <span className="inline-flex min-w-0 items-center gap-1.5">
                          <Mail size={13} />
                          <span className="truncate">{application.applicantEmail}</span>
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
                <StatusBadge status={application.status} />
              </div>

              <div className="rounded-lg border border-white/[0.09] bg-white/[0.035] p-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/34">
                  <MessageSquare size={13} />
                  Message
                </div>
                <p className="whitespace-pre-wrap break-words text-sm leading-6 text-white/58">
                  {application.message || "No message provided."}
                </p>
              </div>

              {ownerView ? (
                <p className="mt-3 break-words text-xs text-white/42">Project: {application.projectTitle}</p>
              ) : null}
            </div>

            {ownerView && application.status === "Pending" ? (
              <div className="grid shrink-0 grid-cols-2 gap-2 lg:w-52 lg:grid-cols-1">
                <Button
                  variant="success"
                  disabled={updatingId === application.id}
                  onClick={() => handleStatusClick(application, "Accepted")}
                >
                  <Check size={16} />
                  {updatingId === application.id ? "Updating..." : "Accept"}
                </Button>
                <Button
                  variant="danger"
                  disabled={updatingId === application.id}
                  onClick={() => handleStatusClick(application, "Rejected")}
                >
                  <X size={16} />
                  {updatingId === application.id ? "Updating..." : "Reject"}
                </Button>
              </div>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
