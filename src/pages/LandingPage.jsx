import { useEffect, useRef } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  Compass,
  GitBranch,
  Layers3,
  MessageSquareQuote,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Zap,
} from "lucide-react";
import Button from "../components/ui/Button.jsx";

const features = [
  {
    icon: Users,
    title: "Builder Profiles",
    description: "Show skills, links, experience, and collaboration intent in one premium identity.",
  },
  {
    icon: ClipboardList,
    title: "Project Rooms",
    description: "Post serious opportunities with type, status, team size, and required skills.",
  },
  {
    icon: Compass,
    title: "Project Discovery",
    description: "Search by title, description, project type, and skills without noisy chat channels.",
  },
  {
    icon: ShieldCheck,
    title: "Application Review",
    description: "Owners review applicants with simple pending, accepted, and rejected states.",
  },
];

const stats = [
  ["Active Builders", "1,240+"],
  ["Projects Posted", "380+"],
  ["Teams Formed", "96+"],
];

const proof = ["Developers", "Designers", "Editors", "Freelancers", "Founders", "Creators"];

const steps = [
  {
    number: "01",
    title: "Create your builder profile",
    description: "Add your skills, portfolio, GitHub, LinkedIn, experience level, and collaboration focus.",
  },
  {
    number: "02",
    title: "Discover serious projects",
    description: "Browse open teams by category, role demand, required skills, and project maturity.",
  },
  {
    number: "03",
    title: "Apply with context",
    description: "Send a focused application and let owners review candidates from one clean dashboard.",
  },
];

const featuredProjects = [
  {
    title: "Launchbase CRM",
    type: "Startup",
    status: "Open",
    description: "A founder CRM for tracking interviews, MVP experiments, and early customer signals.",
    skills: ["React", "Firebase", "Product"],
  },
  {
    title: "Campus API Kit",
    type: "Open Source",
    status: "Open",
    description: "Reusable APIs for clubs, event boards, attendance flows, and student directories.",
    skills: ["Node.js", "Docs", "Firestore"],
  },
  {
    title: "Creator Sprint Studio",
    type: "Content Creation",
    status: "In Progress",
    description: "A content team producing short dev explainers, thumbnails, and launch reels.",
    skills: ["Editing", "Motion", "Writing"],
  },
];

const testimonials = [
  {
    quote: "ALAVACOUS feels like the missing layer between portfolio pages and actual project teams.",
    name: "Riya Sharma",
    role: "Student founder",
  },
  {
    quote: "The flow is focused: find a project, understand the ask, apply, and keep moving.",
    name: "Kabir Mehta",
    role: "Open-source maintainer",
  },
  {
    quote: "It makes student collaboration feel structured and premium instead of scattered.",
    name: "Naina Rao",
    role: "Design collaborator",
  },
];

export default function LandingPage() {
  const heroRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return undefined;

    function updateGlow(event) {
      const rect = hero.getBoundingClientRect();
      hero.style.setProperty("--hero-x", `${event.clientX - rect.left}px`);
      hero.style.setProperty("--hero-y", `${event.clientY - rect.top}px`);
    }

    hero.addEventListener("pointermove", updateGlow);
    return () => hero.removeEventListener("pointermove", updateGlow);
  }, []);

  return (
    <main>
      <section
        ref={heroRef}
        className="landing-hero relative isolate overflow-hidden border-b border-white/[0.09]"
      >
        <HeroAtmosphere />
        <div className="page-shell relative z-10 grid min-h-[calc(100vh-8rem)] gap-10 py-10 sm:py-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-8">
          <div className="max-w-2xl animate-rise">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan/20 bg-cyan/10 px-3 py-1.5 text-xs font-semibold text-cyan shadow-[0_0_36px_rgba(103,232,249,0.12)] backdrop-blur">
              <Sparkles size={14} />
              Premium team-building workspace
            </div>
            <h1 className="brand-wordmark text-4xl font-black leading-[0.98] tracking-[-0.02em] sm:text-5xl lg:text-6xl">
              ALAVACOUS
            </h1>
            <p className="mt-6 text-2xl font-semibold text-white sm:text-3xl">
              Find Builders. Build Together.
            </p>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/64 sm:text-lg">
              A high-signal collaboration platform where students, developers, designers, editors,
              freelancers, and founders discover serious projects and form teams with intent.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button as="link" to="/signup" className="auth-submit-button px-6 py-3">
                Get Started
                <ArrowRight size={18} />
              </Button>
              <Button as="link" to="/projects" variant="secondary" className="px-6 py-3 hover:-translate-y-0.5">
                <Search size={18} />
                Explore Projects
              </Button>
            </div>
            <div className="mt-9 grid grid-cols-3 gap-3">
              {stats.map(([label, value]) => (
                <div className="glass-reflect rounded-lg border border-white/[0.12] bg-white/[0.055] p-4" key={label}>
                  <strong className="block text-2xl font-black text-white">{value}</strong>
                  <span className="mt-1 block text-xs leading-5 text-white/50">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block">
            <HeroCommandCenter />
          </div>
        </div>
      </section>

      <SocialProof />
      <FeatureSection />
      <HowItWorks />
      <FeaturedProjects />
      <Testimonials />
      <FinalCta />
    </main>
  );
}

function HeroAtmosphere() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="hero-mouse-glow" />
      <div className="absolute inset-0 bg-[radial-gradient(70%_70%_at_45%_18%,rgba(103,232,249,0.16),transparent_58%),linear-gradient(to_bottom,rgba(5,6,8,0.05),#050608_92%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:58px_58px] opacity-55 [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />
      <div className="landing-particles">
        {Array.from({ length: 22 }).map((_, index) => (
          <span
            key={index}
            style={{
              "--x": `${(index * 37) % 100}%`,
              "--y": `${12 + ((index * 23) % 76)}%`,
              "--delay": `${index * 0.28}s`,
              "--duration": `${7 + (index % 5)}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function HeroCommandCenter() {
  return (
    <div className="relative mx-auto w-full max-w-2xl animate-rise [animation-delay:140ms]">
      <div className="absolute -inset-8 rounded-[2rem] bg-[radial-gradient(circle_at_50%_0%,rgba(103,232,249,0.16),transparent_56%)] blur-2xl" aria-hidden="true" />
      <div className="glass-reflect relative rounded-lg border border-white/[0.14] bg-white/[0.075] p-4 shadow-auth backdrop-blur-2xl sm:p-5">
        <div className="mb-5 flex items-center justify-between border-b border-white/[0.1] pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan/25 bg-cyan/10 text-cyan">
              <Layers3 size={20} />
            </span>
            <div>
              <p className="text-sm font-semibold text-white">Project command center</p>
              <p className="text-xs text-white/45">Live team pipeline</p>
            </div>
          </div>
          <span className="rounded-full border border-mint/25 bg-mint/10 px-3 py-1 text-xs font-bold text-mint">
            Open
          </span>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-3">
            {featuredProjects.map((project, index) => (
              <article
                className="landing-float-card glass-reflect rounded-lg border border-white/[0.12] bg-ink-900/60 p-4 shadow-[0_20px_70px_rgba(0,0,0,0.34)]"
                style={{ animationDelay: `${index * 0.18}s` }}
                key={project.title}
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-white">{project.title}</h3>
                    <p className="mt-1 text-xs text-white/45">{project.type}</p>
                  </div>
                  <span className="rounded-full border border-cyan/25 bg-cyan/10 px-2.5 py-1 text-xs font-semibold text-cyan">
                    {project.status}
                  </span>
                </div>
                <p className="text-xs leading-5 text-white/56">{project.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.skills.map((skill) => (
                    <span className="rounded-full border border-white/[0.1] bg-white/[0.06] px-2.5 py-1 text-[11px] text-white/62" key={skill}>
                      {skill}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="grid gap-4">
            <div className="landing-float-card glass-reflect rounded-lg border border-white/[0.12] bg-white/[0.06] p-4">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
                <BadgeCheck size={18} className="text-mint" />
                Applicant review
              </div>
              {["Frontend dev", "Motion editor", "Product designer"].map((role) => (
                <div className="mb-2 flex items-center justify-between rounded-lg border border-white/[0.09] bg-white/[0.045] px-3 py-2 text-xs text-white/66" key={role}>
                  <span>{role}</span>
                  <span className="text-mint">Pending</span>
                </div>
              ))}
            </div>

            <div className="landing-float-card glass-reflect rounded-lg border border-white/[0.12] bg-white/[0.06] p-4 [animation-delay:240ms]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/42">Builder match</p>
                  <p className="mt-2 text-sm font-semibold text-white">Design + code + launch</p>
                </div>
                <Zap size={20} className="text-cyan" />
              </div>
              <div className="mt-5 flex -space-x-3">
                {["RS", "KM", "AR", "NV"].map((name) => (
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-ink-950 bg-white text-xs font-black text-ink-950 shadow-[0_12px_32px_rgba(0,0,0,0.34)]" key={name}>
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialProof() {
  return (
    <section className="border-b border-white/[0.08] bg-white/[0.025] py-8">
      <div className="page-shell">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-white/42">
          Built for serious student builders across disciplines
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {proof.map((item) => (
            <div className="glass-reflect rounded-lg border border-white/[0.1] bg-white/[0.045] px-4 py-3 text-center text-sm font-semibold text-white/66 transition hover:-translate-y-0.5 hover:border-cyan/25 hover:text-white" key={item}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureSection() {
  return (
    <section className="page-shell py-20">
      <div className="mb-10 grid gap-5 lg:grid-cols-[0.75fr_1fr] lg:items-end">
        <div>
          <p className="label text-mint">Why teams use it</p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">
            Serious collaboration without the noise.
          </h2>
        </div>
        <p className="max-w-2xl text-sm leading-7 text-white/58 lg:justify-self-end">
          ALAVACOUS gives builders a structured place to present themselves, discover active work,
          and move from interest to team formation with clarity.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <article className="glass-reflect panel group p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan/25 hover:bg-white/[0.085]" key={feature.title}>
            <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg border border-cyan/20 bg-cyan/10 text-cyan transition group-hover:shadow-glow">
              <feature.icon size={22} />
            </span>
            <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
            <p className="mt-3 text-sm leading-6 text-white/56">{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="border-y border-white/[0.08] bg-white/[0.025] py-20">
      <div className="page-shell grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
        <div>
          <p className="label text-cyan">How it works</p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">
            From profile to project team in one focused loop.
          </h2>
        </div>
        <div className="grid gap-4">
          {steps.map((step) => (
            <article className="glass-reflect panel flex gap-5 p-5 transition hover:-translate-y-0.5 hover:border-cyan/20" key={step.title}>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-cyan/20 bg-cyan/10 text-sm font-black text-cyan">
                {step.number}
              </span>
              <div>
                <h3 className="font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/56">{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedProjects() {
  return (
    <section className="page-shell py-20">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="label text-mint">Featured projects</p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">
            Discover teams with real momentum.
          </h2>
        </div>
        <Button as="link" to="/projects" variant="secondary">
          Browse all
          <ArrowRight size={16} />
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {featuredProjects.map((project) => (
          <article className="glass-reflect panel p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan/25 hover:bg-white/[0.085]" key={project.title}>
            <div className="mb-5 flex items-center justify-between gap-3">
              <span className="rounded-full border border-white/[0.11] bg-white/[0.055] px-3 py-1 text-xs font-semibold text-white/60">
                {project.type}
              </span>
              <span className="rounded-full border border-mint/25 bg-mint/10 px-3 py-1 text-xs font-semibold text-mint">
                {project.status}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-white">{project.title}</h3>
            <p className="mt-3 text-sm leading-6 text-white/56">{project.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.skills.map((skill) => (
                <span className="chip" key={skill}>
                  {skill}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="border-y border-white/[0.08] bg-white/[0.025] py-20">
      <div className="page-shell">
        <div className="mb-10 max-w-2xl">
          <p className="label text-cyan">Builder signal</p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">
            A sharper way to find people who actually want to build.
          </h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article className="glass-reflect panel p-5 transition hover:-translate-y-1 hover:border-cyan/25" key={testimonial.name}>
              <MessageSquareQuote className="text-cyan" size={22} />
              <p className="mt-5 text-sm leading-7 text-white/66">"{testimonial.quote}"</p>
              <div className="mt-6 flex items-center justify-between border-t border-white/[0.09] pt-4">
                <div>
                  <h3 className="text-sm font-semibold text-white">{testimonial.name}</h3>
                  <p className="text-xs text-white/45">{testimonial.role}</p>
                </div>
                <div className="flex gap-1 text-amber">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star size={13} fill="currentColor" key={index} />
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="page-shell py-20">
      <div className="glass-reflect panel overflow-hidden p-6 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <p className="label text-cyan">Ready for resumes</p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.02em] text-white">
              A full-stack platform that feels portfolio-worthy.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/58">
              ALAVACOUS includes authenticated users, Firestore collections, protected routes,
              project workflows, application review, empty states, loading states, and a responsive premium UI.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button as="link" to="/signup" className="auth-submit-button px-5 py-3">
                Start building
                <ArrowRight size={17} />
              </Button>
              <Button as="link" to="/projects" variant="secondary">
                Explore projects
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              [GitBranch, "3", "Collections"],
              [BriefcaseBusiness, "6", "Core flows"],
              [CheckCircle2, "100%", "Phase 1"],
            ].map(([Icon, metric, label]) => (
              <div className="glass-reflect rounded-lg border border-white/[0.11] bg-white/[0.055] p-4" key={label}>
                <Icon className="mx-auto mb-3 text-cyan" size={19} />
                <strong className="block text-2xl font-black text-white">{metric}</strong>
                <span className="text-xs text-white/45">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
