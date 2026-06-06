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
    <main className="page-shell page-reveal py-4 sm:py-6">
      <section className="internal-page-header">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="label text-mint">Activity center</p>
            <h1 className="mt-2 text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">Notifications</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/56">
              Applications, withdrawals, team changes, and chat activity stay visible without adding noisy social feeds.
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
          description="You will see applications, decisions, member changes, and chat messages here as your collaborations become active."
          actionLabel="Open Dashboard"
          actionTo="/dashboard"
        />
      ) : (
        <section className="panel overflow-hidden">
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
  const rowContent = (
    <div className="flex min-w-0 items-start gap-3">
      <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-line bg-white/[0.02] text-white/42">
        <Bell size={13} />
      </span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {!notification.read ? <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/58" /> : null}
          <h2 className="break-words text-sm font-semibold text-white">{notification.title}</h2>
        </div>
        <p className="mt-1 line-clamp-2 break-words text-sm leading-6 text-white/50">{notification.message}</p>
      </div>
    </div>
  );

  return (
    <article
      className={`border-b border-line px-3.5 py-3 last:border-b-0 sm:px-4 ${
        notification.read ? "opacity-75" : "bg-white/[0.025]"
      }`}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          {notification.link ? (
            <Link
              to={notification.link}
              className="block rounded-lg transition duration-150 hover:bg-white/[0.018]"
              onClick={() => !notification.read && onMarkRead()}
            >
              {rowContent}
            </Link>
          ) : (
            rowContent
          )}
        </div>

        <div className="grid gap-2 sm:grid-cols-[auto_auto_auto] sm:items-center lg:flex lg:shrink-0">
          <span className="text-xs text-white/32 lg:mr-2 lg:self-center">{formatDateTime(notification.createdAt)}</span>
          {notification.link ? (
            <Button
              as="link"
              to={notification.link}
              variant="secondary"
              onClick={() => !notification.read && onMarkRead()}
              className="px-2.5 py-1.5 text-xs"
            >
              <ArrowUpRight size={15} />
              Open
            </Button>
          ) : null}
          {!notification.read ? (
            <Button variant="secondary" disabled={marking} onClick={onMarkRead} className="px-2.5 py-1.5 text-xs">
              <CheckCheck size={15} />
              {marking ? "Updating..." : "Mark read"}
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
