import { Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import Button from "../ui/Button.jsx";

const navItems = [
  { to: "/projects", label: "Projects" },
  { to: "/dashboard", label: "Dashboard", protected: true },
  { to: "/profile", label: "Profile", protected: true },
];

export default function AppShell() {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const { isAuthenticated, logout, user, firebaseConfigured } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
      setOpen(false);
      navigate("/");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <div className="min-h-screen">
      <div className="app-ambient" aria-hidden="true" />
      <header className="sticky top-0 z-40 border-b border-white/[0.09] bg-ink-950/72 shadow-[0_1px_0_rgba(255,255,255,0.04),0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
        <div className="page-shell flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white text-sm font-black text-ink-950 shadow-[0_0_38px_rgba(103,232,249,0.22)]">
              A
            </span>
            <span className="brand-wordmark text-xs font-black tracking-[0.2em] sm:text-sm sm:tracking-[0.24em]">ALAVACOUS</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems
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
          <div className="border-t border-white/[0.09] bg-ink-950/96 shadow-[0_26px_70px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:hidden">
            <div className="page-shell grid gap-2 py-4">
              {navItems
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
