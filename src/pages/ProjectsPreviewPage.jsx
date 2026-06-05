import { ArrowRight, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import Button from "../components/ui/Button.jsx";

const placeholders = Array.from({ length: 3 });
const particles = Array.from({ length: 8 });

export default function ProjectsPreviewPage() {
  return (
    <main className="page-shell page-reveal py-6 sm:py-10">
      <section className="glass-reflect panel-soft mb-6 overflow-hidden p-5 sm:p-7">
        <div className="absolute inset-x-10 top-0 z-10 h-px bg-gradient-to-r from-transparent via-cyan/60 to-transparent" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-35" aria-hidden="true">
          {particles.map((_, index) => (
            <span
              className="absolute h-1 w-1 rounded-full bg-cyan shadow-[0_0_18px_rgba(103,232,249,0.55)]"
              key={index}
              style={{
                animation: `particle-drift ${15 + index * 0.7}s ease-in-out ${index * 0.45}s infinite`,
                left: `${10 + ((index * 23) % 78)}%`,
                top: `${14 + ((index * 17) % 64)}%`,
              }}
            />
          ))}
        </div>
        <div className="relative z-10 grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
          <div>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan/20 bg-cyan/10 px-3 py-1.5 text-xs font-semibold text-cyan shadow-[0_0_28px_rgba(103,232,249,0.1)]">
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
              <Button as="link" to="/signup" className="auth-submit-button group px-5 py-3 transition duration-200 ease-out">
                Get Started
                <ArrowRight className="transition duration-200 group-hover:translate-x-1" size={17} />
              </Button>
              <Button
                as="link"
                to="/login"
                variant="secondary"
                className="group transition duration-200 ease-out hover:-translate-y-[3px] hover:border-cyan/35 hover:shadow-[0_18px_56px_rgba(103,232,249,0.12),0_12px_34px_rgba(0,0,0,0.28)]"
              >
                Login
                <ArrowRight className="transition duration-200 group-hover:translate-x-1" size={16} />
              </Button>
            </div>
          </div>

          <div className="grid gap-3">
            {["Authenticated browsing", "Protected project details", "Application access"].map((item) => (
              <div
                className="glass-reflect rounded-lg border border-white/[0.1] bg-white/[0.055] p-4 transition duration-200 ease-out hover:-translate-y-[3px] hover:border-cyan/30 hover:bg-white/[0.075] hover:shadow-[0_18px_54px_rgba(0,0,0,0.34),0_0_28px_rgba(103,232,249,0.1)]"
                key={item}
              >
                <div className="flex items-center gap-3 text-sm font-semibold leading-none text-white/74">
                  <ShieldCheck className="shrink-0 text-cyan" size={18} />
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
            className="glass-reflect panel relative min-h-[18rem] overflow-hidden p-5 opacity-90 transition duration-300 hover:-translate-y-1 hover:border-cyan/25 hover:bg-white/[0.08]"
            key={index}
          >
            <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_0%,rgba(103,232,249,0.12),transparent_58%)]" aria-hidden="true" />
            <div className="relative blur-[5px]" aria-hidden="true">
              <div className="mb-5 flex items-center justify-between">
                <span className="h-7 w-24 rounded-full border border-white/[0.1] bg-white/[0.08]" />
                <span className="h-7 w-16 rounded-full border border-cyan/20 bg-cyan/10" />
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

            <div className="absolute inset-0 z-10 flex items-center justify-center bg-ink-950/42 p-5 backdrop-blur-[2px]">
              <div className="glass-reflect rounded-lg border border-cyan/25 bg-ink-950/88 px-4 py-4 text-center shadow-[0_22px_70px_rgba(0,0,0,0.48),0_0_38px_rgba(103,232,249,0.12)] backdrop-blur-2xl">
                <Sparkles className="mx-auto mb-2 text-cyan" size={18} />
                <p className="text-sm font-semibold text-white">Real projects are locked</p>
                <p className="mt-1 text-xs text-white/48">Sign in to browse teams.</p>
                <Button
                  as="link"
                  to="/signup"
                  variant="secondary"
                  className="group mt-3 min-h-0 px-3 py-2 text-xs transition duration-200 ease-out hover:-translate-y-0.5 hover:border-cyan/35 hover:bg-cyan/10 hover:shadow-[0_14px_40px_rgba(103,232,249,0.14),0_8px_24px_rgba(0,0,0,0.3)]"
                >
                  Unlock Access
                  <ArrowRight className="transition duration-200 ease-out group-hover:translate-x-0.5" size={14} />
                </Button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
