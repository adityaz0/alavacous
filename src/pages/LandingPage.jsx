import { useEffect, useRef } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  Code2,
  Compass,
  FileText,
  Layers3,
  LayoutDashboard,
  Lightbulb,
  Network,
  Palette,
  PenTool,
  Search,
  Sparkles,
  Target,
  UserRound,
  Users,
  Video,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const platformCards = [
  {
    id: "builder-profiles",
    icon: UserRound,
    title: "Builder Profiles",
    description: "Show skills, bio, experience, location, portfolio, GitHub, and LinkedIn in one focused identity.",
  },
  {
    id: "project-discovery",
    icon: Search,
    title: "Project Discovery",
    description: "Search and filter open projects by title, description, type, and required skills without noisy channels.",
  },
  {
    id: "skill-matching",
    icon: Target,
    title: "Skill Matching",
    description: "Skill tags help students, designers, developers, and creators find work that fits their strengths.",
  },
  {
    id: "applications",
    icon: FileText,
    title: "Applications",
    description: "Apply with context and keep every request in a structured pending, accepted, or rejected state.",
  },
  {
    id: "owner-dashboard",
    icon: LayoutDashboard,
    title: "Owner Dashboard",
    description: "Track profiles, owned projects, sent applications, received applications, and pending actions.",
  },
  {
    id: "team-formation",
    icon: Network,
    title: "Team Formation",
    description: "Move from builder identity to project opportunity to accepted collaborators in one product flow.",
  },
];

const audienceCards = [
  {
    icon: PenTool,
    title: "Students",
    description: "Find teammates for college projects, hackathons, startup experiments, and portfolio work.",
  },
  {
    icon: Code2,
    title: "Developers",
    description: "Join teams that need frontend, backend, Firebase, API, and deployment depth.",
  },
  {
    icon: Palette,
    title: "Designers",
    description: "Bring UI, UX, product thinking, brand systems, and prototypes into real builds.",
  },
  {
    icon: Video,
    title: "Creators",
    description: "Collaborate on content, editing, launch assets, storytelling, and visual systems.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Freelancers",
    description: "Build credibility through serious collaborations that match your skill stack.",
  },
  {
    icon: Lightbulb,
    title: "Founders",
    description: "Post ideas, define skill needs, review applicants, and form focused early teams.",
  },
];

const trustCards = [
  "No random DMs",
  "Structured applications",
  "Owner-controlled review",
  "Portfolio-first collaboration",
  "Skill-based discovery",
  "Built for students, startups, and creators",
];

const steps = [
  {
    icon: UserRound,
    number: "01",
    title: "Create your builder profile.",
    description: "Add your skills, bio, location, experience level, portfolio, GitHub, and LinkedIn links.",
  },
  {
    icon: Compass,
    number: "02",
    title: "Discover or post projects.",
    description: "Browse open opportunities or publish a project with type, team size, status, and required skills.",
  },
  {
    icon: BadgeCheck,
    number: "03",
    title: "Apply, review, accept, and build together.",
    description: "Send applications, manage applicants, accept the right builders, and keep project status clear.",
  },
];

const heroChips = [
  { label: "Profiles", href: "#builder-profiles" },
  { label: "Projects", href: "#project-discovery" },
  { label: "Applications", href: "#applications" },
  { label: "Dashboards", href: "#owner-dashboard" },
];

const flowNodes = [
  {
    icon: UserRound,
    title: "Profile",
    description: "Skills, links, intent",
  },
  {
    icon: BriefcaseBusiness,
    title: "Project",
    description: "Type, roles, status",
  },
  {
    icon: FileText,
    title: "Application",
    description: "Context and review",
  },
  {
    icon: Users,
    title: "Team",
    description: "Accepted builders",
  },
];

const networkNodes = [
  { label: "Students", className: "left-[9%] top-[38%]" },
  { label: "Developers", className: "right-[8%] top-[34%]" },
  { label: "Designers", className: "left-[16%] bottom-[13%]" },
  { label: "Creators", className: "right-[14%] bottom-[14%]" },
  { label: "Founders", className: "left-1/2 top-[60%] -translate-x-1/2 -translate-y-1/2" },
];

export default function LandingPage() {
  const heroRef = useRef(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const hero = heroRef.current;
    const supportsPointerGlow = window.matchMedia(
      "(min-width: 768px) and (pointer: fine) and (prefers-reduced-motion: no-preference)"
    );
    if (!hero || !supportsPointerGlow.matches) return undefined;

    function updateGlow(event) {
      const rect = hero.getBoundingClientRect();
      hero.style.setProperty("--hero-x", `${event.clientX - rect.left}px`);
      hero.style.setProperty("--hero-y", `${event.clientY - rect.top}px`);
    }

    hero.addEventListener("pointermove", updateGlow);
    return () => hero.removeEventListener("pointermove", updateGlow);
  }, []);

  return (
    <main className="landing-page">
      <section ref={heroRef} className="landing-hero relative isolate overflow-hidden border-b border-white/[0.09]">
        <HeroAtmosphere />
        <div className="page-shell relative z-10 grid min-h-[calc(100vh-7rem)] gap-8 py-8 sm:gap-10 sm:py-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-9">
          <div className="max-w-2xl animate-rise">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan/20 bg-cyan/10 px-3 py-1.5 text-xs font-semibold text-cyan shadow-[0_0_36px_rgba(103,232,249,0.12)] backdrop-blur">
              <Sparkles size={14} />
              Collaboration-first builder platform
            </div>
            <h1 className="brand-wordmark text-4xl font-black leading-[0.98] sm:text-5xl lg:text-5xl">
              ALAVACOUS
            </h1>
            <p className="mt-6 text-2xl font-semibold text-white sm:text-3xl">
              Find Builders. Build Together.
            </p>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/64 sm:text-lg">
              A collaboration-first platform where students, developers, designers, creators, freelancers, and founders discover projects, form teams, and build real products together.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button as="link" to="/signup" className="auth-submit-button group px-6 py-3">
                Get Started
                <ArrowRight className="transition duration-200 group-hover:translate-x-1" size={18} />
              </Button>
              <Button
                as="link"
                to="/projects"
                variant="secondary"
                className="group px-6 py-3 hover:-translate-y-1 hover:border-cyan/35 hover:shadow-[0_18px_56px_rgba(103,232,249,0.14),inset_0_1px_0_rgba(255,255,255,0.1)]"
              >
                <Search size={18} />
                Explore Projects
                <ArrowRight className="transition duration-200 group-hover:translate-x-1" size={16} />
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {heroChips.map((item) => (
                <a
                  className="chip-strong transition duration-200 hover:-translate-y-0.5 hover:border-cyan/35 hover:bg-cyan/15 hover:text-white hover:shadow-[0_0_30px_rgba(103,232,249,0.14)]"
                  href={item.href}
                  key={item.label}
                >
                  <CheckCircle2 size={13} />
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <HeroProductVisual />
        </div>
      </section>

      <CorePlatformSection />
      <HowItWorks />
      <BuilderTypesSection />
      <Footer isAuthenticated={isAuthenticated} />
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
        {Array.from({ length: 12 }).map((_, index) => (
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

function HeroProductVisual() {
  return (
    <div className="relative mx-auto w-full max-w-2xl animate-rise [animation-delay:140ms]">
      <div className="absolute -inset-8 rounded-[2rem] bg-[radial-gradient(circle_at_50%_0%,rgba(103,232,249,0.18),transparent_56%)] blur-2xl" aria-hidden="true" />
      <div className="glass-reflect relative rounded-lg border border-white/[0.14] bg-white/[0.075] p-3.5 shadow-auth backdrop-blur-2xl sm:p-5">
        <div className="mb-4 flex flex-col gap-3 border-b border-white/[0.1] pb-3.5 sm:mb-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan/25 bg-cyan/10 text-cyan">
              <Layers3 size={20} />
            </span>
            <div>
              <p className="text-sm font-semibold text-white">Builder operating layer</p>
              <p className="text-xs text-white/45">Profile to team formation</p>
            </div>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-mint/25 bg-mint/10 px-3 py-1 text-xs font-bold text-mint">
            <Zap size={13} />
            Active workflow
          </span>
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <BuilderNetworkGraph />
          <TeamFormationFlow />
        </div>
      </div>
    </div>
  );
}

function BuilderNetworkGraph() {
  return (
    <div className="landing-float-card glass-reflect relative min-h-[19.5rem] overflow-hidden rounded-lg border border-white/[0.12] bg-ink-900/70 p-3.5 shadow-[0_24px_80px_rgba(0,0,0,0.36)] sm:min-h-[21rem] sm:p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(103,232,249,0.15),transparent_48%)]" aria-hidden="true" />
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/42">Builder network</p>
          <h3 className="mt-2 text-lg font-semibold text-white">Roles connect around intent.</h3>
        </div>
        <Network className="text-cyan" size={22} />
      </div>

      <svg className="absolute inset-0 h-full w-full opacity-80" viewBox="0 0 420 340" aria-hidden="true">
        <defs>
          <linearGradient id="networkLine" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(103,232,249,0.12)" />
            <stop offset="55%" stopColor="rgba(103,232,249,0.5)" />
            <stop offset="100%" stopColor="rgba(110,231,183,0.18)" />
          </linearGradient>
        </defs>
        <path d="M92 82 C152 94 172 132 210 170 C255 122 294 92 340 76" fill="none" stroke="url(#networkLine)" strokeWidth="2" />
        <path d="M92 82 C92 170 126 244 142 270 C172 240 184 210 210 170" fill="none" stroke="url(#networkLine)" strokeWidth="2" />
        <path d="M210 170 C260 210 292 244 338 266 C352 202 350 134 340 76" fill="none" stroke="url(#networkLine)" strokeWidth="2" />
        <path d="M142 270 C202 242 260 246 338 266" fill="none" stroke="url(#networkLine)" strokeWidth="2" />
      </svg>

      {networkNodes.map((node, index) => (
        <div
          className={`absolute z-10 ${node.className} rounded-lg border border-cyan/20 bg-ink-950/85 px-3 py-2 text-xs font-semibold text-white shadow-[0_18px_52px_rgba(0,0,0,0.45),0_0_26px_rgba(103,232,249,0.08)] backdrop-blur-2xl`}
          key={node.label}
          style={{ animation: `premium-float ${7 + index * 0.4}s ease-in-out infinite`, animationDelay: `${index * 0.2}s` }}
        >
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-cyan shadow-[0_0_18px_rgba(103,232,249,0.8)]" />
          {node.label}
        </div>
      ))}
    </div>
  );
}

function TeamFormationFlow() {
  return (
    <div className="grid gap-2.5 sm:gap-3">
      {flowNodes.map((node, index) => (
        <div
          className="landing-float-card glass-reflect rounded-lg border border-white/[0.12] bg-white/[0.065] p-3.5 shadow-[0_20px_70px_rgba(0,0,0,0.34)] sm:p-4"
          style={{ animationDelay: `${index * 0.16}s` }}
          key={node.title}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-cyan/25 bg-cyan/10 text-cyan sm:h-11 sm:w-11">
              <node.icon size={20} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-white">{node.title}</h3>
                {index < flowNodes.length - 1 ? <ArrowRight className="text-white/36" size={16} /> : <CheckCircle2 className="text-mint" size={16} />}
              </div>
              <p className="mt-1 text-xs leading-5 text-white/54">{node.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CorePlatformSection() {
  return (
    <section className="page-shell scroll-mt-24 py-14 sm:py-16" id="features">
      <div className="mb-8 grid gap-5 lg:grid-cols-[0.72fr_1fr] lg:items-end">
        <div>
          <p className="label text-mint">Core platform</p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Why ALAVACOUS exists for serious builders.
          </h2>
        </div>
        <p className="max-w-2xl text-sm leading-7 text-white/58 lg:justify-self-end">
          Student builders do not need another noisy channel. They need a focused product layer for profiles, project discovery, applications, owner review, and team formation.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {platformCards.map((card) => (
          <article
            className="glass-reflect panel group scroll-mt-24 p-4 transition duration-300 hover:-translate-y-1.5 hover:border-cyan/30 hover:bg-white/[0.085] hover:shadow-[0_34px_100px_rgba(0,0,0,0.48),0_0_54px_rgba(103,232,249,0.09),inset_0_1px_0_rgba(255,255,255,0.12)] sm:p-5"
            id={card.id}
            key={card.title}
          >
            <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-cyan/20 bg-cyan/10 text-cyan transition group-hover:shadow-glow sm:mb-5 sm:h-11 sm:w-11">
              <card.icon size={21} />
            </span>
            <h3 className="text-lg font-semibold text-white">{card.title}</h3>
            <p className="mt-3 text-sm leading-6 text-white/56">{card.description}</p>
          </article>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch">
        <div className="glass-reflect panel p-4 sm:p-5">
          <p className="label text-cyan">Trust by design</p>
          <h3 className="mt-3 text-2xl font-bold text-white">
            Built on better collaboration principles.
          </h3>
          <p className="mt-3 text-sm leading-6 text-white/56">
            The landing page stays honest: no invented projects, users, or inflated metrics. Just the product workflows ALAVACOUS actually supports.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {trustCards.map((card) => (
            <div
              className="glass-reflect rounded-lg border border-white/[0.1] bg-white/[0.055] p-3.5 transition duration-300 hover:-translate-y-1 hover:border-cyan/25 hover:bg-white/[0.075] hover:shadow-[0_20px_60px_rgba(103,232,249,0.08)] sm:p-4"
              key={card}
            >
              <div className="flex items-center gap-3 text-sm font-semibold text-white/76">
                <CheckCircle2 className="shrink-0 text-cyan" size={17} />
                {card}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="scroll-mt-24 border-y border-white/[0.08] bg-white/[0.025] py-14 sm:py-16" id="how-it-works">
      <div className="page-shell">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <p className="label text-cyan">How it works</p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            From builder identity to a working team.
          </h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {steps.map((step, index) => (
            <article
              className="glass-reflect panel group p-4 transition duration-300 hover:-translate-y-1.5 hover:border-cyan/30 hover:bg-white/[0.08] hover:shadow-[0_34px_100px_rgba(0,0,0,0.48),0_0_54px_rgba(103,232,249,0.09),inset_0_1px_0_rgba(255,255,255,0.12)] sm:p-5"
              style={{ animationDelay: `${index * 100}ms` }}
              key={step.title}
            >
              <div className="mb-5 flex items-center justify-between sm:mb-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-cyan/20 bg-cyan/10 text-cyan transition group-hover:shadow-glow sm:h-12 sm:w-12">
                  <step.icon size={22} />
                </span>
                <span className="text-xs font-black tracking-[0.18em] text-white/28">{step.number}</span>
              </div>
              <h3 className="text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/56">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function BuilderTypesSection() {
  return (
    <section className="page-shell scroll-mt-24 pb-12 pt-14 sm:pb-14 sm:pt-16" id="builder-types">
      <div className="mb-8 grid gap-5 lg:grid-cols-[0.72fr_1fr] lg:items-end">
        <div>
          <p className="label text-mint">Builder Types</p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Built for people who actually build.
          </h2>
        </div>
        <p className="max-w-2xl text-sm leading-7 text-white/58 lg:justify-self-end">
          ALAVACOUS supports the people a real product team needs, while the platform layer keeps profiles, projects, applications, and reviews connected.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {audienceCards.map((card) => (
          <article className="glass-reflect panel-soft group p-3.5 transition duration-300 hover:-translate-y-1.5 hover:border-cyan/30 hover:bg-white/[0.08] hover:shadow-[0_30px_90px_rgba(0,0,0,0.44),0_0_44px_rgba(103,232,249,0.08)] sm:p-4" key={card.title}>
            <div className="mb-3 flex items-center justify-between sm:mb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.12] bg-white/[0.06] text-cyan transition group-hover:border-cyan/25 group-hover:bg-cyan/10 sm:h-11 sm:w-11">
                <card.icon size={21} />
              </span>
              <ArrowRight className="text-white/22 transition group-hover:translate-x-1 group-hover:text-cyan" size={18} />
            </div>
            <h3 className="text-lg font-semibold text-white">{card.title}</h3>
            <p className="mt-2.5 text-sm leading-6 text-white/56 sm:mt-3">{card.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Footer({ isAuthenticated }) {
  const protectedDestination = (destination) => ({
    to: isAuthenticated ? destination : "/login",
    state: isAuthenticated ? undefined : { from: destination },
  });

  return (
    <footer className="landing-footer border-t border-white/[0.09] bg-ink-950/90 py-5 backdrop-blur-2xl sm:py-10" id="footer">
      <div className="page-shell">
        <div className="landing-footer-surface glass-reflect rounded-lg border border-white/[0.1] bg-white/[0.04] p-3.5 shadow-panel sm:p-6">
          <div className="grid grid-cols-2 gap-x-4 gap-y-5 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.7fr_0.7fr] lg:gap-8">
            <div className="col-span-2 lg:col-span-1">
              <Link className="inline-flex items-center gap-3" to="/">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white text-sm font-black text-ink-950 shadow-[0_0_38px_rgba(103,232,249,0.22)] sm:h-10 sm:w-10">
                  A
                </span>
                <span className="brand-wordmark text-sm font-black tracking-[0.24em]">ALAVACOUS</span>
              </Link>
              <p className="mt-3 text-sm font-semibold text-white sm:mt-4">Find Builders. Build Together.</p>
              <p className="mt-2 max-w-lg text-xs leading-5 text-white/52 sm:mt-3 sm:max-w-sm sm:text-sm sm:leading-6">
                A collaboration-first platform where students, developers, designers, creators, freelancers, and founders build real products together.
              </p>
            </div>

            <FooterColumn
              title="Product"
              links={[
                { label: "Features", href: "#features" },
                { label: "How It Works", href: "#how-it-works" },
                { label: "Projects", to: "/projects" },
                { label: "Get Started", to: "/signup" },
              ]}
            />
            <FooterColumn
              title="Platform"
              links={[
                { label: "Dashboard", ...protectedDestination("/dashboard") },
                { label: "Profile", ...protectedDestination("/profile") },
                { label: "Post Project", ...protectedDestination("/post-project") },
              ]}
            />
            <FooterColumn
              title="Legal"
              links={[
                { label: "Privacy", to: "/privacy" },
                { label: "Terms", to: "/terms" },
              ]}
            />
            <FooterColumn
              title="Connect"
              links={[
                { label: "GitHub", href: "https://github.com/adityaz0/alavacous", external: true },
                { label: "LinkedIn", href: "https://www.linkedin.com/", external: true },
              ]}
            />
          </div>

          <div className="mt-5 flex flex-col gap-1.5 border-t border-white/[0.08] pt-3 text-xs text-white/42 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:pt-5">
            <span>&copy; 2026 ALAVACOUS. All rights reserved.</span>
            <span className="footer-built-copy text-cyan/70">Built for focused student collaboration.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan/75">{title}</h3>
      <div className="mt-2 grid gap-0.5 sm:mt-4 sm:gap-1">
        {links.map((link) => {
          const classes =
            "-mx-2 inline-flex min-h-7 w-fit items-center rounded-md px-2 text-sm text-white/54 transition duration-200 hover:bg-white/[0.06] hover:text-white active:bg-cyan/10 active:text-cyan focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan/30";

          if (link.to) {
            return (
              <Link className={classes} key={link.label} state={link.state} to={link.to}>
                {link.label}
              </Link>
            );
          }

          if (link.href) {
            return (
              <a
                className={classes}
                href={link.href}
                key={link.label}
                rel={link.external ? "noreferrer" : undefined}
                target={link.external ? "_blank" : undefined}
              >
                {link.label}
              </a>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
