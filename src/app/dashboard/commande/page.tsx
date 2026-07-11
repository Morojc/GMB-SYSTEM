import { prisma } from "@/lib/prisma";

export default async function CommandePage() {
  const commandes = await prisma.commande.findMany({
    include: {
      client: {
        include: {
          personne: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            Gestion des commandes
          </h1>
          <p className="text-gray-500 mt-1">
            Liste de toutes les commandes enregistrées.
          </p>
        </div>

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition">
          + Ajouter
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">

            <thead className="bg-gray-100">
              <tr className="text-left text-gray-700">
                <th className="px-6 py-4 font-semibold">ID</th>
                <th className="px-6 py-4 font-semibold">Client</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Validation</th>
              </tr>
            </thead>

            <tbody>
              {commandes.length > 0 ? (
                commandes.map((commande, index) => (
                  <tr
                    key={commande.idCommande}
                    className={`border-t hover:bg-blue-50 transition ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4 font-medium">
                      #{commande.idCommande}
                    </td>

                    <td className="px-6 py-4">
                      {commande.client.personne.nom}{" "}
                      {commande.client.personne.prenom}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {commande.date.toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          commande.validation
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {commande.validation ? "Validée" : "En attente"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-10 text-gray-500"
                  >
                    Aucune commande trouvée.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}