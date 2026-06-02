function initialsFrom(value = "") {
  const cleaned = value.trim();
  if (!cleaned) return "A";

  const parts = cleaned.split(/[\s@._-]+/).filter(Boolean);
  const initials = parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : cleaned.slice(0, 2);
  return initials.toUpperCase();
}

const sizes = {
  sm: "h-10 w-10 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-16 w-16 text-lg",
  xl: "h-20 w-20 text-2xl",
};

export default function Avatar({ name = "", email = "", size = "md", className = "" }) {
  const label = name || email || "ALAVACOUS builder";

  return (
    <span
      className={`avatar-surface inline-flex shrink-0 items-center justify-center rounded-lg font-black text-white ${sizes[size] || sizes.md} ${className}`}
      aria-label={label}
    >
      {initialsFrom(label)}
    </span>
  );
}
