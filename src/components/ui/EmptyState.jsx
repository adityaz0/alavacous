import { Inbox, Sparkles } from "lucide-react";
import Button from "./Button.jsx";

export default function EmptyState({ title, description, actionLabel, actionTo }) {
  return (
    <div className="panel-soft relative flex min-h-[220px] flex-col items-center justify-center overflow-hidden px-5 py-8 text-center">
      <span className="mb-4 rounded-xl border border-line bg-ink-700 p-2.5 text-white/56">
        <Inbox size={20} />
      </span>
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-white/34">
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
