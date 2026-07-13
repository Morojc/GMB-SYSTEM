import Link from "next/link";

const panier = [
  {
    id: 1,
    nom: "Farine",
    prix: 25,
    quantite: 2,
  },
  {
    id: 2,
    nom: "Semoule",
    prix: 18,
    quantite: 1,
  },
];

export default function PanierPage() {
  const total = panier.reduce(
    (sum, produit) => sum + produit.prix * produit.quantite,
    0
  );

  return (
    <main className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-6">

        <h1 className="text-4xl font-bold mb-8">
          Mon Panier
        </h1>

        {panier.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center">
            <h2 className="text-2xl font-semibold">
              Votre panier est vide
            </h2>

            <Link
              href="/produits"
              className="inline-block mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
            >
              Voir les produits
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">

            <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">

              <table className="w-full">

                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">Produit</th>
                    <th className="text-center py-3">Quantité</th>
                    <th className="text-right py-3">Prix</th>
                  </tr>
                </thead>

                <tbody>
                  {panier.map((produit) => (
                    <tr key={produit.id} className="border-b">

                      <td className="py-5">
                        {produit.nom}
                      </td>

                      <td className="text-center">
                        {produit.quantite}
                      </td>

                      <td className="text-right font-semibold">
                        {produit.prix * produit.quantite} DH
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>

            </div>

            <div className="bg-white rounded-xl shadow p-6 h-fit">

              <h2 className="text-2xl font-bold mb-6">
                Résumé
              </h2>

              <div className="flex justify-between mb-4">
                <span>Total :</span>

                <span className="font-bold text-green-600 text-xl">
                  {total} DH
                </span>
              </div>

              <Link
                href="/commande"
                className="block text-center bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg mt-6"
              >
                Passer la commande
              </Link>

              <Link
                href="/produits"
                className="block text-center border border-green-600 text-green-600 hover:bg-green-600 hover:text-white py-3 rounded-lg mt-4"
              >
                Continuer les achats
              </Link>

            </div>

          </div>
        )}

      </div>
    </main>
  );
}