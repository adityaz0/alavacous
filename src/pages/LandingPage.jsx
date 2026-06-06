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
  const { isAuthenticated } = useAuth();

  return (
    <main className="landing-page">
      <section className="landing-hero relative isolate overflow-hidden border-b border-white/[0.08]">
        <div className="page-shell relative z-10 grid min-h-[calc(100vh-7rem)] gap-8 py-6 sm:gap-10 sm:py-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-9">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/70">
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
              <Button as="link" to="/signup" className="group px-5 py-3">
                Get Started
                <ArrowRight className="transition duration-150 group-hover:translate-x-1" size={18} />
              </Button>
              <Button
                as="link"
                to="/projects"
                variant="secondary"
                className="group px-5 py-3"
              >
                <Search size={18} />
                Explore Projects
                <ArrowRight className="transition duration-150 group-hover:translate-x-1" size={16} />
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {heroChips.map((item) => (
                <a
                  className="chip-strong transition duration-150 hover:-translate-y-px hover:border-white/16 hover:bg-white/[0.05] hover:text-white"
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

function HeroProductVisual() {
  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <div className="relative rounded-[18px] border border-white/[0.08] bg-ink-800 p-3.5 sm:p-4">
        <div className="mb-4 flex flex-col gap-3 border-b border-white/[0.1] pb-3.5 sm:mb-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.04] text-white/70">
              <Layers3 size={20} />
            </span>
            <div>
              <p className="text-sm font-semibold text-white">Builder operating layer</p>
              <p className="text-xs text-white/45">Profile to team formation</p>
            </div>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-3 py-1 text-xs font-bold text-white/70">
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
    <div className="interactive-panel relative min-h-[19.5rem] overflow-hidden rounded-[18px] border border-white/[0.08] bg-ink-900 p-3.5 sm:min-h-[21rem] sm:p-4">
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/42">Builder network</p>
          <h3 className="mt-2 text-lg font-semibold text-white">Roles connect around intent.</h3>
        </div>
        <Network className="text-white/58" size={22} />
      </div>

      <svg className="absolute inset-0 h-full w-full opacity-70" viewBox="0 0 420 340" aria-hidden="true">
        <g fill="none" stroke="rgba(255,255,255,0.13)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25">
          <path d="M98 116 L210 190 L336 116" />
          <path d="M142 268 L210 190 L338 268" />
          <path d="M210 190 V116" />
        </g>
        <g fill="rgba(255,255,255,0.22)">
          <circle cx="98" cy="116" r="3" />
          <circle cx="210" cy="190" r="3" />
          <circle cx="336" cy="116" r="3" />
          <circle cx="142" cy="268" r="3" />
          <circle cx="338" cy="268" r="3" />
        </g>
      </svg>

      {networkNodes.map((node) => (
        <div
          className={`absolute z-10 ${node.className} rounded-xl border border-white/[0.1] bg-ink-800 px-3 py-2 text-xs font-semibold text-white`}
          key={node.label}
        >
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-white/55" />
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
          className="interactive-panel rounded-[18px] border border-white/[0.08] bg-ink-900 p-3.5 sm:p-4"
          key={node.title}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.04] text-white/70 sm:h-10 sm:w-10">
              <node.icon size={20} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-white">{node.title}</h3>
                {index < flowNodes.length - 1 ? <ArrowRight className="text-white/36" size={16} /> : <CheckCircle2 className="text-white/60" size={16} />}
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
            className="panel interactive-panel group scroll-mt-24 p-4 sm:p-4"
            id={card.id}
            key={card.title}
          >
            <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.04] text-white/70 transition sm:mb-5 sm:h-10 sm:w-10">
              <card.icon size={21} />
            </span>
            <h3 className="text-lg font-semibold text-white">{card.title}</h3>
            <p className="mt-3 text-sm leading-6 text-white/56">{card.description}</p>
          </article>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch">
        <div className="panel p-4 sm:p-4">
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
              className="interactive-panel rounded-[18px] border border-white/[0.08] bg-ink-800 p-3.5 sm:p-4"
              key={card}
            >
              <div className="flex items-center gap-3 text-sm font-semibold text-white/76">
                <CheckCircle2 className="shrink-0 text-white/58" size={17} />
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
    <section className="scroll-mt-24 border-y border-white/[0.08] bg-ink-950 py-14 sm:py-16" id="how-it-works">
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
              className="panel interactive-panel group p-4 sm:p-4"
              key={step.title}
            >
              <div className="mb-5 flex items-center justify-between sm:mb-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.04] text-white/70 transition sm:h-11 sm:w-11">
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
          <article className="panel-soft interactive-panel group p-3.5 sm:p-4" key={card.title}>
            <div className="mb-3 flex items-center justify-between sm:mb-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.04] text-white/70 transition group-hover:border-white/16 group-hover:bg-white/[0.05] sm:h-10 sm:w-10">
                <card.icon size={21} />
              </span>
              <ArrowRight className="text-white/22 transition group-hover:translate-x-1 group-hover:text-white" size={18} />
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
    <footer className="landing-footer border-t border-white/[0.08] bg-ink-950 py-4 sm:py-8" id="footer">
      <div className="page-shell">
        <div className="landing-footer-surface rounded-[18px] border border-white/[0.08] bg-ink-800 p-3.5 sm:p-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.7fr_0.7fr] lg:gap-6">
            <div className="col-span-2 lg:col-span-1">
              <Link className="inline-flex items-center gap-3" to="/">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-white bg-white text-sm font-black text-ink-950 sm:h-9 sm:w-9">
                  A
                </span>
                <span className="brand-wordmark text-sm font-black tracking-[0.24em]">ALAVACOUS</span>
              </Link>
              <p className="mt-3 text-sm font-semibold text-white">Find Builders. Build Together.</p>
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

          <div className="mt-4 flex flex-col gap-1.5 border-t border-white/[0.08] pt-3 text-xs text-white/42 sm:mt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:pt-4">
            <span>&copy; 2026 ALAVACOUS. All rights reserved.</span>
            <span className="footer-built-copy text-white/44">Built for focused student collaboration.</span>
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
      <div className="mt-2 grid gap-0.5 sm:mt-3 sm:gap-0.5">
        {links.map((link) => {
          const classes =
            "-mx-2 inline-flex min-h-7 w-fit items-center rounded-md px-2 text-sm text-white/54 transition duration-150 hover:bg-white/[0.04] hover:text-white active:bg-white/[0.06] active:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/18";

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
