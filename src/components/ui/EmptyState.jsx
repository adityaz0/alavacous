import { Inbox, Sparkles } from "lucide-react";
import Button from "./Button.jsx";

export default function EmptyState({ title, description, actionLabel, actionTo }) {
  return (
    <div className="panel-soft relative flex min-h-[260px] flex-col items-center justify-center overflow-hidden px-6 py-12 text-center">
      <div className="absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-cyan/45 to-transparent" aria-hidden="true" />
      <span className="mb-4 rounded-lg border border-white/[0.14] bg-white/[0.07] p-3 text-cyan shadow-glow">
        <Inbox size={22} />
      </span>
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/38">
        <Sparkles size={13} />
        Empty state
      </div>
      <h3 className="text-lg font-semibold tracking-[-0.01em] text-white">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-white/56">{description}</p>
      {actionLabel && actionTo ? (
        <Button as="link" to={actionTo} className="mt-6">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
