import { prisma } from "@/lib/prisma";

export default async function EmployePage() {
  const employes = await prisma.employe.findMany({
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
            Gestion des employés
          </h1>
          <p className="text-gray-500 mt-1">
            Liste de tous les employés enregistrés.
          </p>
        </div>

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition duration-200">
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
                <th className="px-6 py-4 font-semibold">Poste</th>
                <th className="px-6 py-4 font-semibold">Présence</th>
              </tr>
            </thead>

            <tbody>
              {employes.length > 0 ? (
                employes.map((emp, index) => (
                  <tr
                    key={emp.idPersonne}
                    className={`border-t hover:bg-blue-50 transition ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4 font-medium">
                      {emp.idPersonne}
                    </td>

                    <td className="px-6 py-4">
                      {emp.personne.nom}
                    </td>

                    <td className="px-6 py-4">
                      {emp.personne.prenom}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {emp.personne.email}
                    </td>

                    <td className="px-6 py-4">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {emp.post ?? "-"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          emp.presence && emp.presence > 0
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {emp.presence ?? 0}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-10 text-gray-500"
                  >
                    Aucun employé trouvé.
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