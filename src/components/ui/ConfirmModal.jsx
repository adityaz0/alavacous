import { AlertTriangle, X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import Button from "./Button.jsx";

const modalStyles = {
  danger: {
    icon: "border-red-500/25 bg-red-950/50 text-red-100",
    panel: "border-red-500/20",
    button: "danger",
  },
  warning: {
    icon: "border-amber/25 bg-amber/10 text-amber",
    panel: "border-amber/20",
    button: "secondary",
  },
  success: {
    icon: "border-line bg-white/[0.025] text-white/68",
    panel: "border-white/[0.03]",
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
    <div className="fixed inset-0 z-[130] flex min-h-svh items-center justify-center overflow-y-auto px-3.5 py-5 sm:py-6" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-black/72"
        aria-label="Close confirmation"
        disabled={submitting}
        onClick={onCancel}
      />
      <section
        className={`relative z-10 w-full max-w-md overflow-hidden rounded-2xl border bg-ink-800 p-4 sm:p-5 ${style.panel}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
      >
        <div className="flex items-start gap-4">
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${style.icon}`}>
            <AlertTriangle size={21} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <h2 id="confirm-title" className="text-xl font-semibold tracking-[-0.01em] text-white">
                {title}
              </h2>
              <button
                type="button"
                className="rounded-xl p-1.5 text-white/42 transition hover:bg-white/[0.05] hover:text-white"
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
