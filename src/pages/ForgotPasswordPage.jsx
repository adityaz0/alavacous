import { LoaderCircle, MailCheck } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Field from "../components/forms/Field.jsx";
import Alert from "../components/ui/Alert.jsx";
import Button from "../components/ui/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getAuthErrorMessage, isValidEmail } from "../utils/messages.js";

export default function ForgotPasswordPage() {
  const { resetPassword, firebaseConfigured } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!firebaseConfigured) {
      setError("Firebase is not configured yet. Add your Firebase environment variables and restart the app.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);

    try {
      await resetPassword(email.trim());
      setMessage("Password reset email sent. Check your inbox.");
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="page-shell page-reveal grid min-h-[calc(100vh-4rem)] place-items-center py-8 sm:py-12">
      <section className="panel glass-reflect w-full max-w-md overflow-hidden p-6 sm:p-8">
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan/45 to-transparent" aria-hidden="true" />
        <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg border border-line bg-white/[0.06] text-cyan">
          <MailCheck size={23} />
        </span>
        <h1 className="text-2xl font-bold text-white">Reset password</h1>
        <p className="mt-2 text-sm leading-6 text-white/55">
          Enter your account email and Firebase will send a secure reset link.
        </p>

        {!firebaseConfigured ? (
          <Alert variant="warning" className="mt-5">
            Firebase env variables are required before reset emails can be sent.
          </Alert>
        ) : null}

        {message ? (
          <Alert variant="success" className="mt-5">
            {message}
          </Alert>
        ) : null}
        {error ? (
          <Alert variant="error" className="mt-5">
            {error}
          </Alert>
        ) : null}

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit} noValidate>
          <Field label="Email">
            <input
              className="input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="you@college.edu"
            />
          </Field>
          <Button type="submit" disabled={submitting || !firebaseConfigured} className="w-full">
            {submitting ? (
              <>
                <LoaderCircle className="animate-spin" size={17} />
                Sending reset link...
              </>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </form>

        <Link className="mt-6 inline-flex text-sm font-semibold text-white/60 hover:text-white" to="/login">
          Back to login
        </Link>
      </section>
    </main>
  );
}
