import Link from "next/link";

export default function Navbar() {
  return (
    <header className="flex justify-between items-center bg-white shadow p-4">
      <h2 className="text-xl font-bold">Dashboard</h2>

      <Link
        href="/login"
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Déconnexion
      </Link>
    </header>
  );
}