import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/navbar";

export default async function ProduitsPage() {
  const produits = await prisma.produit.findMany({
    include: {
      type_produit: true,
    },
  });

  return (
    <>
    <Navbar />
    <main className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex justify-between items-center mb-10">

          <h1 className="text-4xl font-bold">
            Nos Produits
          </h1>

          <Link
            href="/client/inscription"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
          >
            🛒 Mon panier
          </Link>

        </div>

        {produits.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center">
            <h2 className="text-2xl font-semibold">
              Aucun produit disponible.
            </h2>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {produits.map((produit) => (

              <div
                key={produit.id_produit}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition"
              >

                <img
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff"
                  alt={produit.nom ?? "Produit"}
                  className="w-full h-56 object-cover"
                />

                <div className="p-6">

                  <h2 className="text-2xl font-bold">
                    {produit.nom}
                  </h2>

                  <p className="text-gray-500 mt-2">
                    Type : {produit.type_produit?.nom_type ?? "Inconnu"}
                  </p>

                  <div className="mt-6 flex gap-3">

                    <Link
                      href={`/produits/${produit.id_produit}`}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white text-center py-3 rounded-lg"
                    >
                      Voir détails
                    </Link>

                  </div>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>
    </main>
    </>
  );
}