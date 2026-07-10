import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-800 text-white p-6">
      <h1 className="text-2xl font-bold mb-8">GBM</h1>

      <nav className="flex flex-col gap-4">
        <Link href="/dashboard">🏠 Dashboard</Link>
        <Link href="/dashboard/clients">👤 Clients</Link>
        <Link href="/dashboard/employes">👷 Employés</Link>
        <Link href="/dashboard/produits">📦 Produits</Link>
        <Link href="/dashboard/commandes">🧾 Commandes</Link>
      </nav>
    </aside>
  );
}