const styles = {
  Open: "border-white/[0.06] bg-white/[0.035] text-white/66",
  "In Progress": "border-white/[0.06] bg-white/[0.035] text-white/66",
  Closed: "border-white/[0.045] bg-white/[0.025] text-white/44",
  Pending: "border-white/[0.055] bg-white/[0.03] text-white/56",
  Accepted: "border-emerald-400/[0.12] bg-emerald-400/[0.055] text-emerald-100/70",
  Rejected: "border-red-400/[0.12] bg-red-400/[0.055] text-red-100/68",
  Removed: "border-red-400/[0.12] bg-red-400/[0.055] text-red-100/68",
  Left: "border-white/[0.045] bg-white/[0.025] text-white/44",
};

const dots = {
  Open: "bg-white/50",
  "In Progress": "bg-white/50",
  Closed: "bg-white/32",
  Pending: "bg-white/42",
  Accepted: "bg-emerald-200/60",
  Rejected: "bg-red-200/58",
  Removed: "bg-red-200/58",
  Left: "bg-white/32",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[status] || styles.Open}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dots[status] || dots.Open}`} />
      {status}
    </span>
  );
}
