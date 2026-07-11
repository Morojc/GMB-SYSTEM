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
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Gestion des commandes
      </h1>

      <div className="bg-white rounded-lg shadow p-6 overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Client</th>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Validation</th>
            </tr>
          </thead>

          <tbody>
            {commandes.length > 0 ? (
              commandes.map((commande) => (
                <tr key={commande.idCommande}>
                  <td className="border px-4 py-2">{commande.idCommande}</td>
                  <td className="border px-4 py-2">
                    {commande.client.personne.nom} {commande.client.personne.prenom}
                  </td>
                  <td className="border px-4 py-2">
                    {commande.date.toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2">
                    {commande.validation ? "Oui" : "Non"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  Aucune commande trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}