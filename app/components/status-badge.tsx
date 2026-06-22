type StatusBadgeProps = {
  status: "Paid" | "Unpaid" | "Signed" | "Not signed";
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const isPositive = status === "Paid" || status === "Signed";
  const labels = {
    Paid: "Sumokėta",
    Unpaid: "Nesumokėta",
    Signed: "Pasirašyta",
    "Not signed": "Nepasirašyta",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
        isPositive
          ? "bg-emerald-100 text-emerald-700"
          : "bg-rose-100 text-rose-700"
      }`}
    >
      {labels[status]}
    </span>
  );
}
