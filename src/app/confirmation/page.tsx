import Link from "next/link";

export default function ConfirmationPage() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-xl w-full text-center">

        <div className="text-6xl mb-6">
          ✅
        </div>

        <h1 className="text-4xl font-bold text-green-600 mb-4">
          Commande confirmée
        </h1>

        <p className="text-gray-600 text-lg mb-8">
          Merci pour votre confiance.
          <br />
          Votre commande a été enregistrée avec succès.
        </p>

        <div className="space-y-4">

          <Link
            href="/produits"
            className="block bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition"
          >
            Continuer les achats
          </Link>

          <Link
            href="/"
            className="block border border-green-600 text-green-600 hover:bg-green-600 hover:text-white py-3 rounded-lg transition"
          >
            Retour à l&apos;accueil
          </Link>

        </div>

      </div>
    </main>
  );
}