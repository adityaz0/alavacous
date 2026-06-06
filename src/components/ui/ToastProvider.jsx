import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import Alert from "./Alert.jsx";

const ToastContext = createContext(null);
const DISMISS_MS = 3800;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback((message, variant = "info") => {
    const text = String(message || "").trim();
    if (!text) return null;

    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((current) => [...current, { id, message: text, variant }]);
    return id;
  }, []);

  const api = useMemo(
    () => ({
      show: ({ message, variant = "info" }) => push(message, variant),
      success: (message) => push(message, "success"),
      error: (message) => push(message, "error"),
      warning: (message) => push(message, "warning"),
      info: (message) => push(message, "info"),
      dismiss,
    }),
    [dismiss, push]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 top-20 z-[100] flex justify-center sm:inset-x-auto sm:right-4 sm:w-[360px]">
        <div className="grid w-full max-w-[360px] gap-2">
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }) {
  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(toast.id), DISMISS_MS);
    return () => window.clearTimeout(timer);
  }, [onDismiss, toast.id]);

  return (
    <button
      type="button"
      className="toast-motion pointer-events-auto min-w-0 text-left"
      onClick={() => onDismiss(toast.id)}
      aria-label="Dismiss notification"
    >
      <Alert variant={toast.variant} className="bg-ink-800 text-xs shadow-none">
        {toast.message}
      </Alert>
    </button>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
