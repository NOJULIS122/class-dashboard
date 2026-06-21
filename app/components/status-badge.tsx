type StatusBadgeProps = {
  status: "Paid" | "Unpaid" | "Signed" | "Not signed";
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const isPositive = status === "Paid" || status === "Signed";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        isPositive
          ? "bg-emerald-100 text-emerald-700"
          : "bg-rose-100 text-rose-700"
      }`}
    >
      {status}
    </span>
  );
}
