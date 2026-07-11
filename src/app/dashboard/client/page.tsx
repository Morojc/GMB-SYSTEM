import { prisma } from "@/lib/prisma";

export default async function ClientPage() {
  const clients = await prisma.client.findMany({
    include: {
      personne: true,
    },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Gestion des clients
      </h1>

      <div className="bg-white rounded-lg shadow p-6 overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Nom</th>
              <th className="border px-4 py-2">Prénom</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Type</th>
            </tr>
          </thead>

          <tbody>
            {clients.length > 0 ? (
              clients.map((client) => (
                <tr key={client.idPersonne}>
                  <td className="border px-4 py-2">{client.idPersonne}</td>
                  <td className="border px-4 py-2">{client.personne.nom}</td>
                  <td className="border px-4 py-2">{client.personne.prenom}</td>
                  <td className="border px-4 py-2">{client.personne.email}</td>
                  <td className="border px-4 py-2">{client.type ?? "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  Aucun client trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}