import { Link } from "react-router-dom";

const variants = {
  primary:
    "border-white bg-white text-ink-950 hover:-translate-y-px hover:border-white hover:brightness-[1.03] focus-visible:ring-white/20",
  secondary:
    "border-white/[0.03] bg-transparent text-white/84 hover:-translate-y-px hover:border-white/[0.08] hover:bg-white/[0.025] hover:text-white hover:brightness-[1.02] focus-visible:ring-white/12",
  subtle:
    "border-transparent bg-transparent text-white/62 hover:bg-white/[0.025] hover:text-white hover:brightness-[1.02] focus-visible:ring-white/12",
  danger:
    "border-red-950/60 bg-red-950/70 text-red-100 hover:-translate-y-px hover:border-red-800/80 hover:bg-red-900/70 hover:brightness-[1.02] focus-visible:ring-red-400/20",
  success:
    "border-white/[0.03] bg-white/[0.035] text-white/84 hover:-translate-y-px hover:border-white/[0.08] hover:bg-white/[0.045] hover:brightness-[1.02] focus-visible:ring-white/12",
};

export default function Button({
  as = "button",
  to,
  type = "button",
  variant = "primary",
  className = "",
  children,
  ...props
}) {
  const classes = `focus-ring inline-flex items-center justify-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-semibold transition duration-150 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-55 ${variants[variant]} ${className}`;

  if (as === "link") {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} type={type} {...props}>
      {children}
    </button>
  );
}
