import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProduitDetailsPage({
  params,
}: Props) {
  const { id } = await params;

  const produit = await prisma.produit.findUnique({
    where: {
      id_produit: Number(id),
    },
    include: {
      type_produit: true,
    },
  });

  if (!produit) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-100 py-10">

      <div className="max-w-6xl mx-auto px-6">

        <Link
          href="/produits"
          className="text-green-600 hover:underline"
        >
          ← Retour aux produits
        </Link>

        <div className="grid md:grid-cols-2 gap-10 mt-8 bg-white rounded-2xl shadow-xl overflow-hidden">

          <img
            src="https://images.unsplash.com/photo-1509440159596-0249088772ff"
            alt={produit.nom ?? ""}
            className="w-full h-full object-cover"
          />

          <div className="p-8">

            <h1 className="text-4xl font-bold">
              {produit.nom}
            </h1>

            <p className="mt-6 text-gray-600 text-lg">
              Produit alimentaire de haute qualité destiné aux
              professionnels et particuliers.
            </p>

            <div className="mt-8 space-y-4">

              <div className="flex justify-between border-b pb-3">
                <span className="font-semibold">
                  ID
                </span>

                <span>{produit.id_produit}</span>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span className="font-semibold">
                  Type
                </span>

                <span>{produit.type_produit?.nom_type ?? "N/A"}</span>
              </div>

            </div>

            <div className="mt-10 flex gap-4">

              <AddToCartButton
                  id={Number(produit.id_produit)}
                  nom={produit.nom ?? ""}
                  prix={Number(produit.prix ?? 0)}
              />
              <Link
                href="/panier"
                className="flex-1 text-center border border-green-600 text-green-600 hover:bg-green-600 hover:text-white py-3 rounded-lg transition"
              >
                Voir le panier
              </Link>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}