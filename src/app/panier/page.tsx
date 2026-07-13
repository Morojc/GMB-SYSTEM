import Link from "next/link";

export default function PanierPage() {
  const panier = [
    {
      id: 1,
      nom: "Farine Premium",
      type: "Farine",
      quantite: 2,
    },
    {
      id: 2,
      nom: "Semoule Fine",
      type: "Semoule",
      quantite: 1,
    },
  ];

  return (
    <main className="min-h-screen bg-gray-100 py-10">

      <div className="max-w-7xl mx-auto px-6">

        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Mon Panier
        </h1>

        {panier.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Liste Produits */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">

              {panier.map((produit) => (

                <div
                  key={produit.id}
                  className="flex justify-between items-center border-b py-6"
                >

                  <div className="flex gap-4 items-center">

                    <img
                      src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300"
                      alt={produit.nom}
                      className="w-24 h-24 rounded-xl object-cover"
                    />

                    <div>

                      <h2 className="text-xl font-semibold">
                        {produit.nom}
                      </h2>

                      <p className="text-gray-500">
                        {produit.type}
                      </p>

                    </div>

                  </div>

                  <div className="flex items-center gap-4">

                    <button className="w-9 h-9 rounded-full bg-gray-200 hover:bg-gray-300">
                      -
                    </button>

                    <span className="font-bold">
                      {produit.quantite}
                    </span>

                    <button className="w-9 h-9 rounded-full bg-green-600 text-white hover:bg-green-700">
                      +
                    </button>

                  </div>

                </div>

              ))}

            </div>

            {/* Résumé */}
            <div className="bg-white rounded-2xl shadow-lg p-6 h-fit">

              <h2 className="text-2xl font-bold mb-6">
                Résumé
              </h2>

              <div className="flex justify-between mb-4">
                <span>Produits</span>
                <span>{panier.length}</span>
              </div>

              <div className="flex justify-between mb-4">
                <span>Total</span>
                <span className="font-bold text-green-600">
                  À calculer
                </span>
              </div>

              <Link
                href="/commande"
                className="block text-center bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl mt-8 transition"
              >
                Commander
              </Link>

              <Link
                href="/produits"
                className="block text-center border border-green-600 text-green-600 hover:bg-green-600 hover:text-white py-3 rounded-xl mt-4 transition"
              >
                Continuer les achats
              </Link>

            </div>

          </div>
        ) : (

          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">

            <h2 className="text-3xl font-bold">
              Votre panier est vide
            </h2>

            <p className="text-gray-500 mt-3">
              Ajoutez des produits pour commencer votre commande.
            </p>

            <Link
              href="/produits"
              className="inline-block mt-8 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl"
            >
              Voir les produits
            </Link>

          </div>

        )}

      </div>

    </main>
  );
}