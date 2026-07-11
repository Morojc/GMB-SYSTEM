import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-800 text-white p-6">
      <h1 className="text-2xl font-bold mb-8">GMB</h1>

      <nav className="flex flex-col gap-4">
        <Link href="/dashboard">🏠 Dashboard</Link>
        <Link href="/dashboard/client">👤 Clients</Link>
        <Link href="/dashboard/employe">👷 Employés</Link>
        <Link href="/dashboard/produit">📦 Produits</Link>
        <Link href="/dashboard/commande">🧾 Commandes</Link>
      </nav>
    </aside>
  );
}