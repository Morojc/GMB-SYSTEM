export default function StatCard({
  label,
  value,
  icon,
  accent = "wheat",
}: {
  label: string;
  value: string | number;
  icon?: string;
  accent?: "wheat" | "olive" | "amber" | "clay";
}) {
  const border: Record<string, string> = {
    wheat: "border-l-wheat",
    olive: "border-l-olive",
    amber: "border-l-amber",
    clay: "border-l-clay",
  };
  return (
    <div
      className={`rounded-lg border border-line ${border[accent]} border-l-4 bg-surface p-5 shadow-sm`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-roast-soft">
          {label}
        </span>
        {icon && <span className="text-lg">{icon}</span>}
      </div>
      <p className="mt-3 text-3xl font-bold text-roast">{value}</p>
    </div>
  );
}
