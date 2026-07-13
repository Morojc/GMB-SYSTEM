import Link from "next/link";

const produits = [
  {
    id: 1,
    nom: "Farine",
    description:
      "Produit alimentaire de haute qualité destiné aux professionnels et particuliers.",
    prix: "25 DH",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800",
  },
  {
    id: 2,
    nom: "Semoule",
    description:
      "Produit alimentaire de haute qualité destiné aux professionnels et particuliers.",
    prix: "18 DH",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800",
  },
  {
    id: 3,
    nom: "Blé",
    description:
      "Produit alimentaire de haute qualité destiné aux professionnels et particuliers.",
    prix: "30 DH",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800",
  },
  {
    id: 4,
    nom: "Maïs",
    description:
      "Produit alimentaire riche en qualité pour différents usages.",
    prix: "22 DH",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800",
  },
];

export default function ProduitsPage() {
  return (
    <main className="min-h-screen bg-gray-100">

      {/* Header */}
      <section className="bg-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold">
            Nos Produits
          </h1>

          <p className="mt-4 text-lg text-green-100">
            Découvrez toute notre gamme de produits alimentaires.
          </p>
        </div>
      </section>

      {/* Liste Produits */}
      <section className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {produits.map((produit) => (
            <div
              key={produit.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300"
            >
              <img
                src={produit.image}
                alt={produit.nom}
                className="w-full h-56 object-cover"
              />

              <div className="p-6">

                <h2 className="text-2xl font-bold">
                  {produit.nom}
                </h2>

                <p className="text-green-600 text-xl font-semibold mt-2">
                  {produit.prix}
                </p>

                <p className="text-gray-600 mt-4">
                  {produit.description}
                </p>

                <Link
                  href={`/produits/${produit.id}`}
                  className="mt-6 inline-block w-full text-center bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl transition"
                >
                  Voir plus
                </Link>

              </div>
            </div>
          ))}

        </div>

      </section>
    </main>
  );
}