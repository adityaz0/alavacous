export default function LoadingState({ label = "Loading workspace" }) {
  return (
    <div className="flex min-h-[45vh] items-center justify-center">
      <div className="flex items-center gap-3 rounded-xl border border-line bg-ink-800 px-3.5 py-3 text-sm text-white/64">
        <span className="h-2.5 w-2.5 rounded-full bg-white/50" />
        {label}
      </div>
    </div>
  );
}
