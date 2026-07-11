import { prisma } from "@/lib/prisma";

export default async function EmployePage() {
  const employes = await prisma.employe.findMany({
    include: {
      personne: true,
    },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Gestion des employés
      </h1>

      <div className="bg-white rounded-lg shadow p-6 overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Nom</th>
              <th className="border px-4 py-2">Prénom</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Poste</th>
              <th className="border px-4 py-2">Présence</th>
            </tr>
          </thead>

          <tbody>
            {employes.length > 0 ? (
              employes.map((emp) => (
                <tr key={emp.idPersonne}>
                  <td className="border px-4 py-2">{emp.idPersonne}</td>
                  <td className="border px-4 py-2">{emp.personne.nom}</td>
                  <td className="border px-4 py-2">{emp.personne.prenom}</td>
                  <td className="border px-4 py-2">{emp.personne.email}</td>
                  <td className="border px-4 py-2">
                    {emp.post ?? "-"}
                  </td>
                  <td className="border px-4 py-2">
                    {emp.presence ?? "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-4"
                >
                  Aucun employé trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}