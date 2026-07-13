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
    <main className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">

        <div className="grid md:grid-cols-2 gap-8">

          {/* Image */}
          <div>
            <img
              src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=900"
              alt={produit.nom ?? "Sans nom"}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Informations */}
          <div className="p-8 flex flex-col justify-center">

            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full w-fit text-sm mb-4">
              Produit GBM
            </span>

            <h1 className="text-4xl font-bold mb-4">
              {produit.nom}
            </h1>

            <p className="text-gray-600 mb-6">
              Produit alimentaire de haute qualité fabriqué par GBM,
              destiné aux particuliers et aux professionnels.
            </p>

            <div className="space-y-3 mb-8">

              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">
                  ID
                </span>

                <span>
                  {produit.id_produit}
                </span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">
                  Nom
                </span>

                <span>
                  {produit.nom}
                </span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">
                  Type
                </span>

                <span>
                  {produit.id_type}
                </span>
              </div>

            </div>

            <div className="flex gap-4">

              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition">
                Ajouter au panier
              </button>

              <Link
                href="/produits"
                className="border border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-6 py-3 rounded-lg transition"
              >
                Retour
              </Link>

            </div>

          </div>

        </div>

      </div>
    </main>
  );
}