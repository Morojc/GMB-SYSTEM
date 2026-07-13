import Link from "next/link";

export default function CommandePage() {
  return (
    <main className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-4xl font-bold mb-8 text-center">
          Passer la commande
        </h1>

        <form className="space-y-6">

          <div>
            <label className="block mb-2 font-medium">
              Nom complet
            </label>

            <input
              type="text"
              placeholder="Votre nom"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="email@example.com"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Téléphone
            </label>

            <input
              type="tel"
              placeholder="+212..."
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Adresse de livraison
            </label>

            <textarea
              rows={4}
              placeholder="Votre adresse..."
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Mode de paiement
            </label>

            <select className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600">
              <option>Paiement à la livraison</option>
              <option>Carte bancaire</option>
              <option>Virement bancaire</option>
            </select>
          </div>

          <div className="bg-gray-100 rounded-lg p-5">

            <h2 className="text-xl font-bold mb-4">
              Résumé
            </h2>

            <div className="flex justify-between mb-2">
              <span>Sous-total</span>
              <span>68 DH</span>
            </div>

            <div className="flex justify-between mb-2">
              <span>Livraison</span>
              <span>20 DH</span>
            </div>

            <div className="flex justify-between font-bold text-xl mt-4">
              <span>Total</span>
              <span className="text-green-600">
                88 DH
              </span>
            </div>

          </div>

          <div className="flex gap-4">

            <Link
              href="/panier"
              className="flex-1 text-center border border-green-600 text-green-600 py-3 rounded-lg hover:bg-green-600 hover:text-white transition"
            >
              Retour
            </Link>

            <Link
              href="/confirmation"
              className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition"
            >
              Confirmer la commande
            </Link>

          </div>

        </form>

      </div>
    </main>
  );
}