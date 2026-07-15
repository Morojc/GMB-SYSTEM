"use client";

import { useRouter } from "next/navigation";
import type { JwtPayload } from "@/lib/jwt";

export default function Topbar({ user }: { user: JwtPayload }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="flex items-center justify-between border-b border-line bg-surface px-6 py-3">
      <div className="text-sm text-roast-soft">
        Système de gestion — <span className="font-medium text-roast">Minoterie</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-roast">{user.email}</p>
          <p className="text-xs text-roast-soft">{user.role}</p>
        </div>
        <button
          onClick={logout}
          className="rounded-md border border-line px-3 py-1.5 text-sm font-medium text-roast transition hover:bg-grain"
        >
          Déconnexion
        </button>
      </div>
    </header>
  );
}
