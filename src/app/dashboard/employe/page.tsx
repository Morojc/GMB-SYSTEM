import { prisma } from "@/lib/prisma";

export default async function EmployePage() {
  const employes = await prisma.employe.findMany({
    include: {
      personne: true,
      roleEmploye: true,
    },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Gestion des employés
      </h1>

      <div className="bg-white rounded-lg shadow p-6">

        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Poste</th>
              <th>Rôle</th>
            </tr>
          </thead>

          <tbody>
            {employes.map((emp) => (
              <tr key={emp.idPersonne} className="border-b">
                <td>{emp.personne.nom}</td>
                <td>{emp.personne.prenom}</td>
                <td>{emp.personne.email}</td>
                <td>{emp.post}</td>
                <td>{emp.role}</td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </div>
  );
}