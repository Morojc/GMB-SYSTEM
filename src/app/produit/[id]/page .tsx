import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProduitDetailsPage({ params }: Props) {
  const { id } = await params;

  const produit = await prisma.produit.findUnique({
    where: {
      id_produit: Number(id),
    },
  });

  if (!produit) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-100 py-10">

      <div className="max-w-6xl mx-auto px-6">

        {/* Retour */}
        <Link
          href="/produits"
          className="text-green-600 hover:text-green-700 font-medium"
        >
          ← Retour aux produits
        </Link>

        {/* Carte Produit */}
        <div className="bg-white rounded-3xl shadow-xl mt-8 overflow-hidden">

          <div className="grid md:grid-cols-2">

            {/* Image */}
            <div>
              <img
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1000"
                alt={produit.nom ?? "Sans nom"}
                className="w-full h-full object-cover min-h-[450px]"
              />
            </div>

            {/* Informations */}
            <div className="p-10 flex flex-col justify-center">

              <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full w-fit">
                {produit.id_type}
              </span>

              <h1 className="text-5xl font-bold text-gray-800 mt-6">
                {produit.nom}
              </h1>

              <p className="text-gray-600 mt-6 leading-8">
                Ce produit est fabriqué selon les normes de qualité de GBM.
                Il garantit une excellente qualité et répond aux besoins des
                particuliers et des professionnels.
              </p>

              <div className="mt-8">
                <h3 className="font-semibold text-gray-700 mb-2">
                  Quantité
                </h3>

                <input
                  type="number"
                  defaultValue={1}
                  min={1}
                  className="w-24 border rounded-lg px-3 py-2"
                />
              </div>

              <div className="flex gap-4 mt-10">

                <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl shadow-lg transition">
                  Ajouter au panier
                </button>

                <Link
                  href="/panier"
                  className="border border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-3 rounded-xl transition"
                >
                  Voir le panier
                </Link>

              </div>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}