 import { prisma } from "@/lib/prisma";

export default async function ProduitPage() {
  const produits = await prisma.produit.findMany({
    include: {
      typeProduit: true,
    },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Gestion des produits
      </h1>

      <div className="bg-white rounded-lg shadow p-6 overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Nom</th>
              <th className="border px-4 py-2">Type</th>
            </tr>
          </thead>

          <tbody>
            {produits.length > 0 ? (
              produits.map((produit) => (
                <tr key={produit.idProduit}>
                  <td className="border px-4 py-2">{produit.idProduit}</td>
                  <td className="border px-4 py-2">{produit.nom}</td>
                  <td className="border px-4 py-2">{produit.type}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-4">
                  Aucun produit trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}