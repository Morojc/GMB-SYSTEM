import { prisma } from "@/lib/prisma";

export default async function ProduitPage() {
  const produits = await prisma.produit.findMany();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Gestion des produits
      </h1>

      <div className="bg-white rounded-lg shadow p-6 overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Nom</th>
              <th className="border p-2">Type</th>
            </tr>
          </thead>

          <tbody>
            {produits.map((produit) => (
              <tr key={produit.idProduit}>
                <td className="border p-2">{produit.idProduit}</td>
                <td className="border p-2">{produit.nom}</td>
                <td className="border p-2">{produit.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}