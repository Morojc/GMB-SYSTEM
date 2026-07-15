import Link from "next/link";
import Navbar from "@/components/navbar";


export default function HomePage() {
  return (
    <>
      <Navbar />
    <main className="bg-gray-50 min-h-screen">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <h1 className="text-3xl font-bold text-green-700">
            GMB
          </h1>

          <div className="hidden md:flex gap-8 text-gray-700 font-medium">
            <Link href="/" className="hover:text-green-600 transition">
              Accueil
            </Link>

            <Link href="/produits" className="hover:text-green-600 transition">
              Produits
            </Link>

            <Link href="/apropos" className="hover:text-green-600 transition">
              À propos
            </Link>

            <Link href="/contact" className="hover:text-green-600 transition">
              Contact
            </Link>
          </div>


        <div className="flex justify-center gap-4">
          <Link
            href="/client/inscription"
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition"
          >
            Inscription
          </Link>        
          <Link
            href="/client/login"
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition"
          >
            Connexion
          </Link>
        </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-5xl font-bold text-gray-800 leading-tight">
            Bienvenue chez <span className="text-green-600">GMB</span>
          </h2>

          <p className="text-gray-600 mt-6 text-lg leading-8">
            Découvrez une large gamme de produits alimentaires de qualité,
            préparés avec soin pour répondre aux besoins de nos clients.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              href="/produits"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg transition"
            >
              Découvrir nos produits
            </Link>

            <Link
              href="/contact"
              className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-6 py-3 rounded-xl transition"
            >
              Nous contacter
            </Link>
          </div>
        </div>

        <div>
          <img
            src="https://zinecapitalinvest.ma/lgmz.php"
            alt="Produits alimentaires"
            className="rounded-3xl shadow-xl w-full h-[450px] object-cover"
          />
        </div>
      </section>


      {/* Pourquoi nous */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-14">
            Pourquoi choisir GBM ?
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow text-center">
              <div className="text-5xl mb-4">🌾</div>
              <h3 className="font-bold text-xl">
                Produits naturels
              </h3>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow text-center">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="font-bold text-xl">
                Livraison rapide
              </h3>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow text-center">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="font-bold text-xl">
                Qualité garantie
              </h3>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow text-center">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="font-bold text-xl">
                Service client
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-green-500">
            GBM
          </h2>

          <p className="mt-4 text-gray-400">
            © 2026 GBM. Tous droits réservés.
          </p>

          <div className="flex justify-center gap-6 mt-6">
            <Link href="/" className="hover:text-green-400">
              Accueil
            </Link>

            <Link href="/produits" className="hover:text-green-400">
              Produits
            </Link>

            <Link href="/apropos" className="hover:text-green-400">
              À propos
            </Link>

            <Link href="/contact" className="hover:text-green-400">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </main>
     
    </>
  );
}