import Link from "next/link";

export default function PageHeader({
  title,
  subtitle,
  actionHref,
  actionLabel,
}: {
  title: string;
  subtitle?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4 border-b border-line pb-5">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-roast">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-roast-soft">{subtitle}</p>}
      </div>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="shrink-0 rounded-md bg-wheat px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
