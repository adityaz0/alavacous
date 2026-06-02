import Alert from "./Alert.jsx";

export default function Toast({ variant = "info", children }) {
  if (!children) return null;

  return (
    <div className="pointer-events-none fixed inset-x-4 top-20 z-50 flex justify-center sm:justify-end">
      <Alert variant={variant} className="pointer-events-auto w-full max-w-sm shadow-auth">
        {children}
      </Alert>
    </div>
  );
}
