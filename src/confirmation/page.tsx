import Link from "next/link";

export default function ConfirmationPage() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-6 py-10">

      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-10 text-center">

        {/* Icône */}
        <div className="w-24 h-24 mx-auto rounded-full bg-green-100 flex items-center justify-center">

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-14 h-14 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>

        </div>

        {/* Titre */}
        <h1 className="text-4xl font-bold text-gray-800 mt-8">
          Commande confirmée !
        </h1>

        <p className="text-gray-600 mt-4 text-lg">
          Merci pour votre confiance.
          <br />
          Votre commande a été enregistrée avec succès.
        </p>

        {/* Informations */}
        <div className="bg-gray-100 rounded-xl p-6 mt-8 text-left">

          <div className="flex justify-between mb-4">
            <span className="font-medium">Numéro de commande</span>
            <span className="font-bold text-green-600">
              CMD-000001
            </span>
          </div>

          <div className="flex justify-between mb-4">
            <span className="font-medium">Statut</span>
            <span className="text-green-600 font-semibold">
              Confirmée
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">
              Livraison estimée
            </span>
            <span>
              2 - 5 jours
            </span>
          </div>

        </div>

        {/* Boutons */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-10">

          <Link
            href="/mes-commandes"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl transition"
          >
            Mes commandes
          </Link>

          <Link
            href="/produits"
            className="border border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-3 rounded-xl transition"
          >
            Continuer les achats
          </Link>

        </div>

        {/* Retour accueil */}
        <div className="mt-8">

          <Link
            href="/"
            className="text-green-600 hover:underline font-medium"
          >
            ← Retour à l'accueil
          </Link>

        </div>

      </div>

    </main>
  );
}