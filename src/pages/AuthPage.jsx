import { ArrowRight, BadgeCheck, LoaderCircle, LockKeyhole, Mail, Sparkles, User, Users } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Field from "../components/forms/Field.jsx";
import Alert from "../components/ui/Alert.jsx";
import Button from "../components/ui/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getAuthErrorMessage, isValidEmail } from "../utils/messages.js";

export default function AuthPage({ mode }) {
  const isSignup = mode === "signup";
  const { login, signup, isAuthenticated, loading, firebaseConfigured } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || (isSignup ? "/profile" : "/dashboard");

  if (!loading && isAuthenticated && !submitting) {
    return <Navigate to={redirectTo} replace />;
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function validateForm() {
    const email = form.email.trim();

    if (!firebaseConfigured) {
      return "Firebase is not configured yet. Add your Firebase environment variables and restart the app.";
    }

    if (isSignup && form.name.trim().length < 2) {
      return "Please enter your full name.";
    }

    if (!email) {
      return "Please enter your email address.";
    }

    if (!isValidEmail(email)) {
      return "Please enter a valid email address.";
    }

    if (!form.password) {
      return "Please enter your password.";
    }

    if (form.password.length < 6) {
      return "Password must be at least 6 characters.";
    }

    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const validationMessage = validateForm();
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setSubmitting(true);

    try {
      const email = form.email.trim();
      if (isSignup) {
        await signup({ ...form, name: form.name.trim(), email });
        navigate("/profile", { state: { notice: "Account created. Complete your profile." } });
      } else {
        await login(email, form.password);
        navigate(redirectTo, { state: { notice: "Welcome back to ALAVACOUS." } });
      }
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="page-shell page-reveal relative grid min-h-[calc(100vh-4rem)] items-start justify-items-center overflow-hidden py-4 sm:py-6 lg:place-items-center lg:py-14">
      <section className="glass-reflect grid w-full max-w-6xl overflow-hidden rounded-lg border border-white/[0.14] bg-white/[0.065] shadow-auth backdrop-blur-2xl lg:grid-cols-[0.95fr_1fr]">
        <aside className="relative hidden min-h-[650px] overflow-hidden border-r border-white/[0.1] bg-ink-900/48 p-8 lg:block">
          <div className="auth-panel-grid absolute inset-0 opacity-70" aria-hidden="true" />
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan/70 to-transparent" aria-hidden="true" />
          <div className="absolute -right-24 top-16 h-72 w-72 rounded-full bg-cyan/10 blur-3xl" aria-hidden="true" />
          <div className="absolute bottom-0 left-0 h-72 w-full bg-gradient-to-t from-cyan/10 via-transparent to-transparent" aria-hidden="true" />

          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan/20 bg-cyan/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-cyan">
                <Sparkles size={14} />
                ALAVACOUS ACCESS
              </span>
              <h1 className="brand-wordmark mt-7 text-5xl font-black leading-none tracking-[-0.02em]">
                ALAVACOUS
              </h1>
              <p className="mt-4 text-xl font-semibold text-white">Find Builders. Build Together.</p>
              <p className="mt-5 max-w-md text-sm leading-7 text-white/62">
                A focused collaboration layer for profiles, projects, applications, and serious student teams.
              </p>
              <div className="mt-8 grid gap-3">
                {[
                  ["Live team graph", "Profiles, projects, and applications stay connected."],
                  ["Owner workflow", "Review applicants with clear pending, accepted, and rejected states."],
                  ["Builder identity", "Show your skills, portfolio, GitHub, and LinkedIn in one place."],
                ].map(([title, copy]) => (
                  <div className="glass-reflect rounded-lg border border-white/[0.11] bg-white/[0.055] p-4" key={title}>
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
                      <BadgeCheck size={16} className="text-mint" />
                      {title}
                    </div>
                    <p className="text-xs leading-5 text-white/52">{copy}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-reflect rounded-lg border border-white/[0.12] bg-white/[0.06] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/42">Phase 1 signal</p>
                  <strong className="mt-1 block text-2xl font-black text-white">Full-stack MVP</strong>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-cyan/20 bg-cyan/10 text-cyan">
                  <Users size={20} />
                </span>
              </div>
            </div>
          </div>
        </aside>

        <div className="relative p-5 sm:p-8 lg:p-10">
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" aria-hidden="true" />
          <div className="mx-auto w-full max-w-md">
            <div className="mb-6 lg:hidden">
              <span className="brand-wordmark text-3xl font-black tracking-[0.16em]">ALAVACOUS</span>
              <p className="mt-2 text-sm font-semibold text-white/68">Find Builders. Build Together.</p>
            </div>

            <div className="mb-6">
              <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.12] bg-white/[0.07] text-cyan shadow-glow">
                {isSignup ? <User size={20} /> : <LockKeyhole size={20} />}
              </span>
              <h2 className="text-3xl font-bold tracking-[-0.02em] text-white">{isSignup ? "Create account" : "Welcome back"}</h2>
              <p className="mt-2 text-sm leading-6 text-white/55">
                {isSignup ? "Create your builder identity." : "Welcome back to your team workspace."}
              </p>
            </div>

            {!firebaseConfigured ? (
              <Alert variant="warning" className="mb-4">
                Firebase is not configured yet. Add `.env.local` values from `.env.example` to enable authentication.
              </Alert>
            ) : null}

            {error ? (
              <Alert variant="error" className="mb-5">
                {error}
              </Alert>
            ) : null}

            <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
              {isSignup ? (
                <Field label="Full name">
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-3.5 text-white/35" size={18} />
                    <input
                      className="input pl-10"
                      value={form.name}
                      onChange={(event) => updateField("name", event.target.value)}
                      required
                      minLength={2}
                      placeholder="Your full name"
                    />
                  </div>
                </Field>
              ) : null}

              <Field label="Email">
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-3.5 text-white/35" size={18} />
                  <input
                    className="input pl-10"
                    type="email"
                    value={form.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    required
                    placeholder="you@college.edu"
                  />
                </div>
              </Field>

              <Field label="Password">
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-3.5 text-white/35" size={18} />
                  <input
                    className="input pl-10"
                    type="password"
                    value={form.password}
                    onChange={(event) => updateField("password", event.target.value)}
                    required
                    minLength={6}
                    placeholder="Minimum 6 characters"
                  />
                </div>
              </Field>

              {!isSignup ? (
                <Link to="/forgot-password" className="justify-self-start text-sm font-semibold text-cyan hover:text-white">
                  Forgot password?
                </Link>
              ) : null}

              <Button type="submit" disabled={submitting || !firebaseConfigured} className="auth-submit-button mt-1 py-3">
                {submitting ? (
                  <>
                    <LoaderCircle className="animate-spin" size={18} />
                    {isSignup ? "Creating account..." : "Logging in..."}
                  </>
                ) : (
                  <>
                    {isSignup ? "Create Account" : "Login"}
                    <ArrowRight size={18} />
                  </>
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-white/50">
              {isSignup ? "Already have an account?" : "New to ALAVACOUS?"}{" "}
              <Link className="font-semibold text-white hover:text-mint" to={isSignup ? "/login" : "/signup"}>
                {isSignup ? "Log in" : "Create account"}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
