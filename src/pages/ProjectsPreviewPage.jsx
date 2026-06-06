import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";
import Button from "../components/ui/Button.jsx";

const placeholders = Array.from({ length: 3 });

export default function ProjectsPreviewPage() {
  return (
    <main className="page-shell page-reveal py-5 sm:py-8">
      <section className="panel-soft mb-6 overflow-hidden p-4 sm:p-6">
        <div className="relative z-10 grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
          <div>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/70">
              <LockKeyhole size={14} />
              Protected project discovery
            </span>
            <h1 className="text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">
              Sign in to explore real collaboration teams.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/58">
              The collaboration directory contains real builder and team data. Create an account or log in to browse teams, view details, and apply.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button as="link" to="/signup" className="group px-4 py-3 transition duration-150 ease-out">
                Get Started
                <ArrowRight className="transition duration-150 group-hover:translate-x-1" size={17} />
              </Button>
              <Button
                as="link"
                to="/login"
                variant="secondary"
                className="group transition duration-150 ease-out"
              >
                Login
                <ArrowRight className="transition duration-150 group-hover:translate-x-1" size={16} />
              </Button>
            </div>
          </div>

          <div className="grid gap-3">
            {["Authenticated browsing", "Protected project details", "Application access"].map((item) => (
              <div
                className="rounded-[18px] border border-white/[0.08] bg-ink-800 p-4 transition duration-150 ease-out hover:-translate-y-px hover:border-white/14 hover:bg-ink-700"
                key={item}
              >
                <div className="flex items-center gap-3 text-sm font-semibold leading-none text-white/74">
                  <ShieldCheck className="shrink-0 text-white/56" size={18} />
                  {item}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="Locked project previews">
        {placeholders.map((_, index) => (
          <article
            className="panel relative min-h-[18rem] overflow-hidden p-4 opacity-90 transition duration-150 hover:-translate-y-px hover:border-white/14 hover:bg-ink-700"
            key={index}
          >
            <div className="relative" aria-hidden="true">
              <div className="mb-5 flex items-center justify-between">
                <span className="h-7 w-24 rounded-full border border-white/[0.1] bg-white/[0.08]" />
                <span className="h-7 w-16 rounded-full border border-white/[0.1] bg-white/[0.04]" />
              </div>
              <div className="h-7 w-4/5 rounded-lg bg-white/[0.14]" />
              <div className="mt-4 grid gap-2">
                <div className="h-3 w-full rounded-full bg-white/[0.09]" />
                <div className="h-3 w-11/12 rounded-full bg-white/[0.08]" />
                <div className="h-3 w-3/5 rounded-full bg-white/[0.08]" />
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="h-7 w-16 rounded-full bg-white/[0.1]" />
                <span className="h-7 w-20 rounded-full bg-white/[0.1]" />
                <span className="h-7 w-14 rounded-full bg-white/[0.1]" />
              </div>
              <div className="mt-8 h-11 rounded-lg border border-white/[0.1] bg-white/[0.075]" />
            </div>

            <div className="absolute inset-0 z-10 flex items-center justify-center bg-ink-950/80 p-4">
              <div className="rounded-[18px] border border-white/[0.12] bg-ink-800 px-3.5 py-4 text-center">
                <LockKeyhole className="mx-auto mb-2 text-white/60" size={18} />
                <p className="text-sm font-semibold text-white">Real projects are locked</p>
                <p className="mt-1 text-xs text-white/48">Sign in to browse teams.</p>
                <Button
                  as="link"
                  to="/signup"
                  variant="secondary"
                  className="group mt-3 min-h-0 px-3 py-2 text-xs transition duration-150 ease-out"
                >
                  Unlock Access
                  <ArrowRight className="transition duration-150 ease-out group-hover:translate-x-0.5" size={14} />
                </Button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
