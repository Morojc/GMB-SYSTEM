import Link from "next/link";

export default function CommandePage() {
  return (
    <main className="min-h-screen bg-gray-100 py-10">

      <div className="max-w-6xl mx-auto px-6">

        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Passer une commande
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Informations Client */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8">

            <h2 className="text-2xl font-bold mb-6">
              Informations du client
            </h2>

            <div className="grid md:grid-cols-2 gap-6">

              <div>
                <label className="block mb-2 font-medium">
                  Nom
                </label>

                <input
                  type="text"
                  placeholder="Votre nom"
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Prénom
                </label>

                <input
                  type="text"
                  placeholder="Votre prénom"
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="email@gmail.com"
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Téléphone
                </label>

                <input
                  type="tel"
                  placeholder="06XXXXXXXX"
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
                />
              </div>

            </div>

            <div className="mt-6">

              <label className="block mb-2 font-medium">
                Adresse de livraison
              </label>

              <textarea
                rows={4}
                placeholder="Votre adresse..."
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
              />

            </div>

            <div className="mt-6">

              <label className="block mb-2 font-medium">
                Commentaire
              </label>

              <textarea
                rows={3}
                placeholder="Commentaire (facultatif)"
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-600 outline-none"
              />

            </div>

          </div>

          {/* Résumé */}
          <div className="bg-white rounded-2xl shadow-lg p-8 h-fit">

            <h2 className="text-2xl font-bold mb-6">
              Résumé
            </h2>

            <div className="flex justify-between mb-4">
              <span>Produits</span>
              <span>3</span>
            </div>

            <div className="flex justify-between mb-4">
              <span>Sous-total</span>
              <span>300 DH</span>
            </div>

            <div className="flex justify-between mb-4">
              <span>Livraison</span>
              <span>Gratuite</span>
            </div>

            <hr className="my-4" />

            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span className="text-green-600">
                300 DH
              </span>
            </div>

            <Link
              href="/confirmation"
              className="block text-center bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl mt-8 transition"
            >
              Confirmer la commande
            </Link>

            <Link
              href="/panier"
              className="block text-center border border-green-600 text-green-600 hover:bg-green-600 hover:text-white py-3 rounded-xl mt-4 transition"
            >
              Retour au panier
            </Link>

          </div>

        </div>

      </div>

    </main>
  );
}