import { AlertTriangle, X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import Button from "./Button.jsx";

const modalStyles = {
  danger: {
    icon: "border-red-300/25 bg-red-500/10 text-red-100",
    rail: "via-red-300/55",
    panel: "border-red-400/20 shadow-[0_32px_110px_rgba(0,0,0,0.72),0_0_42px_rgba(248,113,113,0.12),inset_0_1px_0_rgba(255,255,255,0.1)]",
    button: "danger",
  },
  warning: {
    icon: "border-amber/30 bg-amber/10 text-amber",
    rail: "via-amber/55",
    panel: "border-amber/20 shadow-[0_32px_110px_rgba(0,0,0,0.72),0_0_42px_rgba(248,214,109,0.1),inset_0_1px_0_rgba(255,255,255,0.1)]",
    button: "secondary",
  },
  success: {
    icon: "border-mint/30 bg-mint/10 text-mint",
    rail: "via-mint/55",
    panel: "border-mint/20 shadow-[0_32px_110px_rgba(0,0,0,0.72),0_0_42px_rgba(110,231,183,0.1),inset_0_1px_0_rgba(255,255,255,0.1)]",
    button: "success",
  },
};

export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  submittingLabel = "Working...",
  variant = "danger",
  submitting = false,
  onConfirm,
  onCancel,
}) {
  const style = modalStyles[variant] || modalStyles.danger;

  useEffect(() => {
    if (!open) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape" && !submitting) {
        onCancel();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onCancel, open, submitting]);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[130] flex min-h-svh items-center justify-center overflow-y-auto px-4 py-6 sm:py-8" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-ink-950/82 backdrop-blur-xl"
        aria-label="Close confirmation"
        disabled={submitting}
        onClick={onCancel}
      />
      <section
        className={`glass-reflect relative z-10 w-full max-w-md overflow-hidden rounded-lg border bg-ink-950/[0.97] p-5 sm:p-6 ${style.panel}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
      >
        <div className={`absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent to-transparent ${style.rail}`} aria-hidden="true" />
        <div className="flex items-start gap-4">
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border ${style.icon}`}>
            <AlertTriangle size={21} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <h2 id="confirm-title" className="text-xl font-semibold tracking-[-0.01em] text-white">
                {title}
              </h2>
              <button
                type="button"
                className="rounded-lg p-1.5 text-white/42 transition hover:bg-white/[0.07] hover:text-white"
                aria-label="Close confirmation"
                disabled={submitting}
                onClick={onCancel}
              >
                <X size={18} />
              </button>
            </div>
            <p className="mt-3 text-sm leading-6 text-white/56">{description}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <Button variant="secondary" disabled={submitting} onClick={onCancel} className="w-full">
            {cancelLabel}
          </Button>
          <Button variant={style.button} disabled={submitting} onClick={onConfirm} className="w-full">
            {submitting ? submittingLabel : confirmLabel}
          </Button>
        </div>
      </section>
    </div>,
    document.body
  );
}
