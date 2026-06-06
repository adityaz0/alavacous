import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";

const styles = {
  error: "border-red-400/[0.12] bg-red-400/[0.055] text-red-100/86",
  success: "border-line bg-ink-800 text-white/78",
  warning: "border-line bg-ink-800 text-white/78",
  info: "border-line bg-ink-800 text-white/78",
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
      className={`flex min-w-0 items-start gap-3 rounded-xl border p-3 text-sm leading-6 ${styles[variant] || styles.info} ${className}`}
      role={variant === "error" ? "alert" : "status"}
    >
      <Icon className="mt-0.5 shrink-0" size={17} />
      <span className="min-w-0 whitespace-pre-wrap break-words">{children}</span>
    </div>
  );
}
