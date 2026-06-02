import { Link } from "react-router-dom";

const variants = {
  primary:
    "border-white/20 bg-white text-ink-950 shadow-[0_18px_48px_rgba(103,232,249,0.14),inset_0_1px_0_rgba(255,255,255,0.9)] hover:-translate-y-0.5 hover:border-cyan/40 hover:bg-mint hover:shadow-[0_22px_58px_rgba(103,232,249,0.22),inset_0_1px_0_rgba(255,255,255,0.95)] focus-visible:ring-white/30",
  secondary:
    "border-line bg-white/[0.06] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.1] hover:shadow-[0_14px_42px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.1)] focus-visible:ring-cyan/20",
  subtle:
    "border-transparent bg-transparent text-white/70 hover:bg-white/[0.06] hover:text-white focus-visible:ring-cyan/20",
  danger:
    "border-red-400/30 bg-red-500/10 text-red-100 hover:-translate-y-0.5 hover:border-red-300/40 hover:bg-red-500/20 hover:shadow-[0_14px_42px_rgba(248,113,113,0.12)] focus-visible:ring-red-400/20",
  success:
    "border-mint/30 bg-mint/10 text-mint hover:-translate-y-0.5 hover:border-mint/45 hover:bg-mint/15 hover:shadow-[0_14px_42px_rgba(110,231,183,0.12)] focus-visible:ring-mint/20",
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
  const classes = `focus-ring inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-55 ${variants[variant]} ${className}`;

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
