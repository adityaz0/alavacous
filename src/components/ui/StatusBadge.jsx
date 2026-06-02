const styles = {
  Open: "border-mint/35 bg-mint/10 text-mint shadow-[0_0_28px_rgba(110,231,183,0.1)]",
  "In Progress": "border-cyan/35 bg-cyan/10 text-cyan shadow-[0_0_28px_rgba(103,232,249,0.1)]",
  Closed: "border-white/15 bg-white/[0.07] text-white/55",
  Pending: "border-amber/40 bg-amber/10 text-amber shadow-[0_0_28px_rgba(248,214,109,0.08)]",
  Accepted: "border-mint/35 bg-mint/10 text-mint shadow-[0_0_28px_rgba(110,231,183,0.1)]",
  Rejected: "border-red-400/35 bg-red-500/10 text-red-200 shadow-[0_0_28px_rgba(248,113,113,0.1)]",
};

const dots = {
  Open: "bg-mint",
  "In Progress": "bg-cyan",
  Closed: "bg-white/45",
  Pending: "bg-amber",
  Accepted: "bg-mint",
  Rejected: "bg-red-300",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[status] || styles.Open}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dots[status] || dots.Open}`} />
      {status}
    </span>
  );
}
