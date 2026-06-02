export default function LoadingState({ label = "Loading workspace" }) {
  return (
    <div className="flex min-h-[45vh] items-center justify-center">
      <div className="glass-reflect flex items-center gap-3 rounded-lg border border-white/[0.14] bg-white/[0.07] px-4 py-3 text-sm text-white/70 shadow-panel backdrop-blur-2xl">
        <span className="relative h-3 w-3 rounded-full bg-mint">
          <span className="absolute inset-0 animate-ping rounded-full bg-mint/50" />
        </span>
        {label}
      </div>
    </div>
  );
}
