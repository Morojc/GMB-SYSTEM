import Link from "next/link";

const commandes = [
  {
    id: "CMD-000001",
    date: "13/07/2026",
    montant: "88 DH",
    statut: "Confirmée",
  },
  {
    id: "CMD-000002",
    date: "08/07/2026",
    montant: "120 DH",
    statut: "Livrée",
  },
  {
    id: "CMD-000003",
    date: "01/07/2026",
    montant: "45 DH",
    statut: "En attente",
  },
];

export default function MesCommandesPage() {
  return (
    <main className="min-h-screen bg-gray-100 py-12">

      <div className="max-w-6xl mx-auto px-6">

        <div className="flex justify-between items-center mb-8">

          <h1 className="text-4xl font-bold">
            Mes Commandes
          </h1>

          <Link
            href="/produits"
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg"
          >
            Continuer les achats
          </Link>

        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">

          <table className="w-full">

            <thead className="bg-green-600 text-white">

              <tr>
                <th className="p-4 text-left">Commande</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Montant</th>
                <th className="p-4 text-left">Statut</th>
              </tr>

            </thead>

            <tbody>

              {commandes.map((commande) => (

                <tr
                  key={commande.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-4">{commande.id}</td>

                  <td className="p-4">{commande.date}</td>

                  <td className="p-4">{commande.montant}</td>

                  <td className="p-4">

                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">

                      {commande.statut}

                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        <div className="mt-8 flex gap-4">

          <Link
            href="/"
            className="border border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-6 py-3 rounded-lg"
          >
            Retour à l&apos;accueil
          </Link>

          <Link
            href="/produits"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
          >
            Voir les produits
          </Link>

        </div>

      </div>

    </main>
  );
}