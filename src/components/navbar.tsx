export default function Navbar() {
  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between">
      <h2 className="text-xl font-bold">
        Tableau de bord
      </h2>

      <button className="bg-red-500 text-white px-4 py-2 rounded">
        Déconnexion
      </button>
    </header>
  );
}