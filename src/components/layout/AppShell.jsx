import { Bell, Menu, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { listenNotifications } from "../../services/firestore.js";
import { getServiceErrorMessage } from "../../utils/messages.js";
import Button from "../ui/Button.jsx";
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
      <header className="app-header sticky top-0 z-40 border-b border-white/[0.09] bg-ink-950/72 shadow-[0_1px_0_rgba(255,255,255,0.04),0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
        <div className="page-shell flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white text-sm font-black text-ink-950 shadow-[0_0_38px_rgba(103,232,249,0.22)]">
              A
            </span>
            <span className="brand-wordmark text-xs font-black tracking-[0.2em] sm:text-sm sm:tracking-[0.24em]">ALAVACOUS</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {showPublicLandingNav
              ? publicLandingNavItems.map((item) =>
                  item.to ? (
                    <NavLink
                      key={item.label}
                      to={item.to}
                      className={({ isActive }) =>
                        `rounded-lg px-3 py-2 text-sm font-medium transition ${
                          isActive ? "bg-white/[0.08] text-white" : "text-white/58 hover:bg-white/[0.055] hover:text-white"
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  ) : (
                    <a
                      className="rounded-lg px-3 py-2 text-sm font-medium text-white/58 transition hover:bg-white/[0.055] hover:text-white"
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
                          isActive ? "bg-white/[0.08] text-white" : "text-white/58 hover:bg-white/[0.055] hover:text-white"
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {!firebaseConfigured ? (
              <span className="rounded-full border border-amber/30 bg-amber/10 px-3 py-1 text-xs font-semibold text-amber">
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
            className="focus-ring rounded-lg border border-line bg-white/[0.06] p-2 text-white transition hover:border-cyan/30 hover:bg-cyan/10 md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {open ? (
          <div className="mobile-nav-surface border-t border-white/[0.09] bg-ink-950/96 shadow-[0_26px_70px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:hidden">
            <div className="page-shell grid gap-2 py-4">
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
                              ? "border-cyan/20 bg-cyan/10 text-cyan"
                              : "border-transparent text-white/65 hover:border-white/[0.1] hover:bg-white/[0.055] hover:text-white"
                          }`
                        }
                      >
                        {item.label}
                      </NavLink>
                    ) : (
                      <a
                        className="rounded-lg border border-transparent px-3 py-3 text-sm font-semibold text-white/65 transition hover:border-white/[0.1] hover:bg-white/[0.055] hover:text-white"
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
                              ? "border-cyan/20 bg-cyan/10 text-cyan"
                              : "border-transparent text-white/65 hover:border-white/[0.1] hover:bg-white/[0.055] hover:text-white"
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
      className="focus-ring relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-white/[0.055] text-white/62 transition duration-200 hover:-translate-y-0.5 hover:border-cyan/30 hover:bg-cyan/10 hover:text-cyan hover:shadow-[0_0_32px_rgba(103,232,249,0.12)]"
      aria-label={unreadCount ? `${unreadCount} unread notifications` : "Notifications"}
    >
      <Bell size={18} />
      {unreadCount ? (
        <span className="absolute -right-1.5 -top-1.5 min-w-5 rounded-full border border-ink-950 bg-cyan px-1.5 py-0.5 text-center text-[10px] font-black text-ink-950">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      ) : null}
    </Link>
  );
}
