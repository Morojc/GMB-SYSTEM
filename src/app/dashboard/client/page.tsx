import { prisma } from "@/lib/prisma";

export default async function ClientPage() {
  const clients = await prisma.client.findMany({
    include: {
      personne: true,
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            Gestion des clients
          </h1>
          <p className="text-gray-500 mt-1">
            Liste de tous les clients enregistrés.
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
                <th className="px-6 py-4 font-semibold">Nom</th>
                <th className="px-6 py-4 font-semibold">Prénom</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Type</th>
              </tr>
            </thead>

            <tbody>
              {clients.length > 0 ? (
                clients.map((client, index) => (
                  <tr
                    key={client.idPersonne}
                    className={`border-t hover:bg-blue-50 transition ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4 font-medium">
                      {client.idPersonne}
                    </td>

                    <td className="px-6 py-4">
                      {client.personne.nom}
                    </td>

                    <td className="px-6 py-4">
                      {client.personne.prenom}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {client.personne.email}
                    </td>

                    <td className="px-6 py-4">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        {client.type ?? "-"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-10 text-gray-500"
                  >
                    Aucun client trouvé.
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