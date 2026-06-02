export default function Field({ label, hint, children }) {
  return (
    <label className="grid gap-2">
      <span className="label">{label}</span>
      {children}
      {hint ? <span className="text-xs leading-5 text-white/45">{hint}</span> : null}
    </label>
  );
}
