import Link from "next/link";

export default function ConfirmationPage() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-6">

      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-10 text-center">

        {/* Icône */}
        <div className="mx-auto w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 h-12 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>

        </div>

        <h1 className="text-4xl font-bold text-gray-800 mt-8">
          Commande confirmée !
        </h1>

        <p className="text-gray-600 mt-4 text-lg">
          Merci pour votre confiance.
          <br />
          Votre commande a été enregistrée avec succès.
        </p>

        <div className="bg-gray-100 rounded-xl p-6 mt-8 text-left">

          <div className="flex justify-between mb-3">
            <span>Numéro de commande</span>
            <span className="font-bold text-green-600">
              CMD-000001
            </span>
          </div>

          <div className="flex justify-between mb-3">
            <span>Statut</span>
            <span className="text-green-600 font-semibold">
              Confirmée
            </span>
          </div>

          <div className="flex justify-between">
            <span>Livraison estimée</span>
            <span>2 à 5 jours</span>
          </div>

        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-8">

          <Link
            href="/mes-commandes"
            className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition"
          >
            Mes commandes
          </Link>

          <Link
            href="/produits"
            className="border border-green-600 text-green-600 hover:bg-green-600 hover:text-white py-3 rounded-lg transition"
          >
            Continuer les achats
          </Link>

        </div>

        <Link
          href="/"
          className="inline-block mt-8 text-green-600 hover:underline"
        >
          ← Retour à l'accueil
        </Link>

      </div>

    </main>
  );
}