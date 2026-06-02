import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";

const styles = {
  error: "border-red-400/30 bg-red-500/10 text-red-100 shadow-[0_0_36px_rgba(248,113,113,0.08)]",
  success: "border-mint/30 bg-mint/10 text-mint shadow-[0_0_36px_rgba(110,231,183,0.08)]",
  warning: "border-amber/30 bg-amber/10 text-amber shadow-[0_0_36px_rgba(248,214,109,0.08)]",
  info: "border-cyan/25 bg-cyan/10 text-cyan shadow-[0_0_36px_rgba(103,232,249,0.08)]",
};

const icons = {
  error: AlertCircle,
  success: CheckCircle2,
  warning: TriangleAlert,
  info: Info,
};

export default function Alert({ variant = "info", children, className = "" }) {
  const Icon = icons[variant] || Info;

  return (
    <div
      className={`glass-reflect flex min-w-0 items-start gap-3 rounded-lg border p-3 text-sm leading-6 backdrop-blur-2xl ${styles[variant] || styles.info} ${className}`}
      role={variant === "error" ? "alert" : "status"}
    >
      <Icon className="mt-0.5 shrink-0" size={17} />
      <span className="min-w-0 whitespace-pre-wrap break-words">{children}</span>
    </div>
  );
}
