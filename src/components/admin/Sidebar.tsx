"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navGroups } from "@/lib/resources";
import type { Role } from "@/lib/jwt";

export default function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const groups = navGroups();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-line bg-roast text-grain">
      <div className="border-b border-white/10 px-6 py-5">
        <Link href="/dashboard" className="block text-2xl font-bold tracking-tight">
          GMB
        </Link>
        <p className="mt-0.5 text-xs text-grain/60">Grande Minoterie</p>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        <NavItem
          href="/dashboard"
          icon="🏠"
          label="Vue d'ensemble"
          active={pathname === "/dashboard"}
        />

        <div>
          <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-grain/40">
            Opérations
          </p>
          <div className="space-y-0.5">
            <NavItem
              href="/dashboard/reception"
              icon="📥"
              label="Réception achats"
              active={pathname.startsWith("/dashboard/reception")}
            />
            <NavItem
              href="/dashboard/production"
              icon="🏭"
              label="Lancer production"
              active={pathname.startsWith("/dashboard/production")}
            />
          </div>
        </div>

        {groups.map((g) => {
          const items = g.items.filter((r) => !r.adminOnly || role === "ADMIN");
          if (!items.length) return null;
          return (
            <div key={g.group}>
              <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-grain/40">
                {g.group}
              </p>
              <div className="space-y-0.5">
                {items.map((r) => (
                  <NavItem
                    key={r.key}
                    href={`/dashboard/${r.key}`}
                    icon={r.icon}
                    label={r.labelPlural}
                    active={pathname.startsWith(`/dashboard/${r.key}`)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

function NavItem({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition ${
        active
          ? "bg-wheat text-white font-semibold"
          : "text-grain/80 hover:bg-white/10"
      }`}
    >
      <span className="text-base">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
