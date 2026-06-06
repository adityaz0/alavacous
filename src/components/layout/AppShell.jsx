import { Bell, Menu, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { listenNotifications } from "../../services/firestore.js";
import { getServiceErrorMessage } from "../../utils/messages.js";
import Button from "../ui/Button.jsx";
import Avatar from "../ui/Avatar.jsx";
import { useToast } from "../ui/ToastProvider.jsx";

const navItems = [
  { to: "/projects", label: "Projects" },
  { to: "/dashboard", label: "Dashboard", protected: true },
  { to: "/chats", label: "Chats", protected: true },
  { to: "/profile", label: "Profile", protected: true },
];

const publicLandingNavItems = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#builder-types", label: "Builder Types" },
  { to: "/projects", label: "Projects" },
];

export default function AppShell() {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { isAuthenticated, logout, user, firebaseConfigured } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const showPublicLandingNav = !isAuthenticated && location.pathname === "/";

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setUnreadCount(0);
      return undefined;
    }

    return listenNotifications(
      user.uid,
      (notifications) => {
        setUnreadCount(notifications.filter((notification) => !notification.read).length);
      },
      () => {
        setUnreadCount(0);
      }
    );
  }, [isAuthenticated, user]);

  useEffect(() => {
    const notice = location.state?.notice;
    if (!notice) return;

    toast.success(notice);

    const { notice: _notice, ...restState } = location.state;
    const hasRestState = Object.keys(restState).length > 0;
    navigate(`${location.pathname}${location.search}${location.hash}`, {
      replace: true,
      state: hasRestState ? restState : null,
    });
  }, [location.hash, location.pathname, location.search, location.state, navigate, toast]);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
      setOpen(false);
      navigate("/");
    } catch (error) {
      toast.error(getServiceErrorMessage(error, "Could not log out. Please try again."));
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <div className={`relative isolate min-h-screen ${location.pathname === "/" ? "landing-shell" : ""}`}>
      <div className="app-ambient" aria-hidden="true" />
      <header className="app-header sticky top-0 z-40 border-b border-white/[0.045] bg-ink-950">
        <div className="page-shell flex h-16 items-center justify-between gap-3">
          <Link to="/" className="flex min-w-0 items-center gap-2.5" onClick={() => setOpen(false)}>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white bg-white text-xs font-black text-ink-950">
              A
            </span>
            <span className="brand-wordmark truncate text-xs font-black tracking-[0.2em] sm:text-sm sm:tracking-[0.24em]">ALAVACOUS</span>
          </Link>

          <nav className="hidden items-center gap-0.5 md:flex">
            {showPublicLandingNav
              ? publicLandingNavItems.map((item) =>
                  item.to ? (
                    <NavLink
                      key={item.label}
                      to={item.to}
                      className={({ isActive }) =>
                        `rounded-lg px-3 py-2 text-sm font-medium transition ${
                          isActive ? "nav-pill-active bg-white/[0.055] text-white" : "text-white/58 hover:bg-white/[0.025] hover:text-white"
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  ) : (
                    <a
                      className="rounded-lg px-3 py-2 text-sm font-medium text-white/58 transition hover:bg-white/[0.025] hover:text-white"
                      href={item.href}
                      key={item.label}
                    >
                      {item.label}
                    </a>
                  )
                )
              : navItems
                  .filter((item) => !item.protected || isAuthenticated)
                  .map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `rounded-lg px-3 py-2 text-sm font-medium transition ${
                          isActive ? "nav-pill-active bg-white/[0.055] text-white" : "text-white/58 hover:bg-white/[0.025] hover:text-white"
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {!firebaseConfigured ? (
            <span className="rounded-full border border-amber/20 bg-amber/10 px-2.5 py-1 text-xs font-semibold text-amber">
                Firebase env needed
              </span>
            ) : null}
            {isAuthenticated ? (
              <>
                <NotificationBell unreadCount={unreadCount} />
                <Button as="link" to="/projects/new" variant="secondary">
                  <Sparkles size={16} />
                  Post Project
                </Button>
                <Button variant="subtle" disabled={loggingOut} onClick={handleLogout}>
                  {loggingOut ? "Logging out..." : "Logout"}
                </Button>
                <Link to="/profile" aria-label="Profile">
                  <Avatar name={user?.displayName} email={user?.email} size="sm" />
                </Link>
              </>
            ) : (
              <>
                <Button as="link" to="/login" variant="subtle">
                  Login
                </Button>
                <Button as="link" to="/signup">
                  Get Started
                </Button>
              </>
            )}
          </div>

          <button
            type="button"
            className="focus-ring rounded-xl border border-line bg-ink-800 p-2 text-white transition hover:border-white/[0.08] hover:bg-white/[0.025] md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {open ? (
          <div className="mobile-nav-surface border-t border-white/[0.045] bg-ink-950 md:hidden">
            <div className="page-shell grid gap-2 py-3">
              {showPublicLandingNav
                ? publicLandingNavItems.map((item) =>
                    item.to ? (
                      <NavLink
                        key={item.label}
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className={({ isActive }) =>
                          `rounded-lg border px-3 py-3 text-sm font-semibold transition ${
                            isActive
                              ? "nav-pill-active border-white/[0.08] bg-white/[0.04] text-white"
                              : "border-transparent text-white/65 hover:border-white/[0.08] hover:bg-white/[0.025] hover:text-white"
                          }`
                        }
                      >
                        {item.label}
                      </NavLink>
                    ) : (
                      <a
                        className="rounded-lg border border-transparent px-3 py-2.5 text-sm font-semibold text-white/65 transition hover:border-white/[0.08] hover:bg-white/[0.025] hover:text-white"
                        href={item.href}
                        key={item.label}
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                      </a>
                    )
                  )
                : navItems
                    .filter((item) => !item.protected || isAuthenticated)
                    .map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className={({ isActive }) =>
                          `rounded-lg border px-3 py-3 text-sm font-semibold transition ${
                            isActive
                              ? "nav-pill-active border-white/[0.08] bg-white/[0.04] text-white"
                              : "border-transparent text-white/65 hover:border-white/[0.08] hover:bg-white/[0.025] hover:text-white"
                          }`
                        }
                      >
                        {item.label}
                      </NavLink>
                    ))}
              {isAuthenticated ? (
                <>
                  <div className="grid gap-2">
                    <Button as="link" to="/notifications" onClick={() => setOpen(false)} variant="secondary">
                      <Bell size={16} />
                      {unreadCount ? `${unreadCount} new` : "Notifications"}
                    </Button>
                  </div>
                  <Button as="link" to="/projects/new" onClick={() => setOpen(false)} variant="secondary" className="w-full">
                    Post Project
                  </Button>
                  <Button variant="subtle" disabled={loggingOut} onClick={handleLogout} className="w-full">
                    {loggingOut ? "Logging out..." : `Logout ${user?.displayName ? `(${user.displayName})` : ""}`}
                  </Button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Button as="link" to="/login" onClick={() => setOpen(false)} variant="secondary">
                    Login
                  </Button>
                  <Button as="link" to="/signup" onClick={() => setOpen(false)}>
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </header>

      <Outlet />
    </div>
  );
}

function NotificationBell({ unreadCount }) {
  return (
    <Link
      to="/notifications"
      className="focus-ring relative inline-flex h-8 w-8 items-center justify-center rounded-xl border border-line bg-ink-800 text-white/62 transition duration-150 hover:-translate-y-px hover:border-white/[0.08] hover:bg-white/[0.025] hover:text-white"
      aria-label={unreadCount ? `${unreadCount} unread notifications` : "Notifications"}
    >
      <Bell size={18} />
      {unreadCount ? (
        <span className="absolute -right-1.5 -top-1.5 min-w-5 rounded-full border border-ink-950 bg-white px-1.5 py-0.5 text-center text-[10px] font-black text-ink-950">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      ) : null}
    </Link>
  );
}
