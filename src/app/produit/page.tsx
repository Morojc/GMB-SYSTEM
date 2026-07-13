import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ProduitsPage() {
  const produits = await prisma.produit.findMany({
    orderBy: {
      id_produit: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-gray-100">

      {/* Hero */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <h1 className="text-5xl font-bold">
            Nos Produits
          </h1>

          <p className="mt-4 text-lg text-green-100">
            Découvrez tous les produits disponibles chez GBM.
          </p>

        </div>
      </section>

      {/* Recherche */}
      <section className="max-w-7xl mx-auto px-6 mt-10">

        <div className="bg-white rounded-xl shadow-md p-5">

          <input
            type="text"
            placeholder="Rechercher un produit..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
          />

        </div>

      </section>

      {/* Produits */}
      <section className="max-w-7xl mx-auto px-6 py-12">

        {produits.length > 0 ? (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

            {produits.map((produit) => (

              <div
                key={produit.id_produit}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300"
              >

               <img
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600"
                  alt={produit.nom ?? "Sans nom"}
                  className="w-full h-56 object-cover"
                />

                <div className="p-6">

                  <span className="inline-block bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">
                    {produit.id_type}
                  </span>

                  <h2 className="text-2xl font-bold mt-4">
                    {produit.nom}
                  </h2>

                  <p className="text-gray-600 mt-3">
                    Produit alimentaire de haute qualité,
                    fabriqué selon les normes GBM.
                  </p>

                  <div className="mt-6 flex justify-between items-center">

                    <span className="text-green-700 font-bold text-xl">
                      Disponible
                    </span>

                    <Link
                      href={`/produits/${produit.id_produit}`}
                      className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition"
                    >
                      Voir détails
                    </Link>

                  </div>

                </div>

              </div>

            ))}

          </div>

        ) : (

          <div className="bg-white rounded-xl shadow p-12 text-center">

            <h2 className="text-2xl font-bold text-gray-700">
              Aucun produit disponible
            </h2>

            <p className="text-gray-500 mt-3">
              Les produits apparaîtront ici après leur ajout.
            </p>

          </div>

        )}

      </section>

    </main>
  );
}