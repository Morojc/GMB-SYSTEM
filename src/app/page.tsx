"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Connexion impossible.");
        return;
      }

      // Administration only — reject any non-admin account.
      if (data.user?.role !== "ADMIN") {
        setError("Accès réservé à l'administration.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Erreur réseau. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-grain px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-line bg-surface p-8 shadow-sm"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-roast">GMB</h1>
          <p className="mt-1 text-sm text-roast-soft">
            Grande Minoterie — Administration
          </p>
        </div>

        {error && (
          <p className="mb-4 rounded-md bg-clay/10 px-3 py-2 text-sm text-clay">{error}</p>
        )}

        <label className="mb-1 block text-sm font-medium text-roast">Email</label>
        <input
          type="email"
          placeholder="admin@gmb.local"
          className="mb-4 w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-wheat"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="mb-1 block text-sm font-medium text-roast">Mot de passe</label>
        <input
          type="password"
          placeholder="••••••••"
          className="mb-6 w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-wheat"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-wheat py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 disabled:opacity-50"
        >
          {loading ? "Connexion…" : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
