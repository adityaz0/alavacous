import { ArrowUpRight, Bell, CheckCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Alert from "../components/ui/Alert.jsx";
import Button from "../components/ui/Button.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import LoadingState from "../components/ui/LoadingState.jsx";
import { useToast } from "../components/ui/ToastProvider.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  listenNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../services/firestore.js";
import { formatDateTime } from "../utils/format.js";
import { getServiceErrorMessage } from "../utils/messages.js";

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState("");
  const [error, setError] = useState("");
  const toast = useToast();

  useEffect(() => {
    setLoading(true);
    setError("");

    return listenNotifications(
      user.uid,
      (data) => {
        setNotifications(data);
        setLoading(false);
      },
      (err) => {
        setError(getServiceErrorMessage(err, "Could not load notifications."));
        setLoading(false);
      }
    );
  }, [user.uid]);

  async function handleMarkRead(notification) {
    setMarking(notification.id);
    setError("");

    try {
      await markNotificationRead(notification.id, user.uid);
    } catch (err) {
      const message = getServiceErrorMessage(err, "Could not update notification.");
      setError(message);
      toast.error(message);
    } finally {
      setMarking("");
    }
  }

  async function handleMarkAllRead() {
    setMarking("all");
    setError("");

    try {
      await markAllNotificationsRead(user.uid);
      toast.success("Notifications marked as read.");
    } catch (err) {
      const message = getServiceErrorMessage(err, "Could not update notifications.");
      setError(message);
      toast.error(message);
    } finally {
      setMarking("");
    }
  }

  if (loading) {
    return <LoadingState label="Loading notifications" />;
  }

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  return (
    <main className="page-shell page-reveal py-6 sm:py-10">
      <section className="panel-soft glass-reflect mb-6 overflow-hidden p-5 sm:p-6">
        <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan/55 to-transparent" aria-hidden="true" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="label text-mint">Activity center</p>
            <h1 className="mt-2 text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">Notifications</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/56">
              Application decisions and chat activity stay visible without adding noisy social feeds.
            </p>
          </div>
          <Button
            variant="secondary"
            disabled={!unreadCount || marking === "all"}
            onClick={handleMarkAllRead}
            className="w-full sm:w-auto"
          >
            <CheckCheck size={16} />
            {marking === "all" ? "Updating..." : "Mark all read"}
          </Button>
        </div>
      </section>

      {error ? (
        <Alert variant="error" className="mb-5">
          {error}
        </Alert>
      ) : null}

      {!notifications.length ? (
        <EmptyState
          title="No notifications yet"
          description="You will see application decisions and chat messages here as your collaborations become active."
          actionLabel="Open Dashboard"
          actionTo="/dashboard"
        />
      ) : (
        <section className="grid gap-3">
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              marking={marking === notification.id}
              onMarkRead={() => handleMarkRead(notification)}
            />
          ))}
        </section>
      )}
    </main>
  );
}

function NotificationCard({ notification, marking, onMarkRead }) {
  return (
    <article
      className={`panel interactive-panel overflow-hidden p-4 sm:p-5 ${
        notification.read ? "opacity-80" : "border-cyan/20 bg-cyan/[0.07]"
      }`}
    >
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan/45 to-transparent" aria-hidden="true" />
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-start gap-3">
            <span className="rounded-lg border border-cyan/20 bg-cyan/10 p-2 text-cyan">
              <Bell size={17} />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="break-words text-base font-semibold text-white">{notification.title}</h2>
                {!notification.read ? (
                  <span className="rounded-full border border-mint/25 bg-mint/10 px-2 py-0.5 text-[11px] font-semibold text-mint">
                    New
                  </span>
                ) : null}
              </div>
              <p className="mt-2 break-words text-sm leading-6 text-white/56">{notification.message}</p>
              <p className="mt-2 text-xs text-white/34">{formatDateTime(notification.createdAt)}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:w-56 lg:grid-cols-1">
          {notification.link ? (
            <Button as="link" to={notification.link} variant="secondary">
              <ArrowUpRight size={16} />
              Open
            </Button>
          ) : null}
          {!notification.read ? (
            <Button variant="secondary" disabled={marking} onClick={onMarkRead}>
              <CheckCheck size={16} />
              {marking ? "Updating..." : "Mark read"}
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
