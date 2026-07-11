export default function HomePage() {
  return (
    <main className="bg-gray-50 min-h-screen">

      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <h1 className="text-3xl font-bold text-green-700">
            GBM
          </h1>

          <div className="hidden md:flex gap-8 text-gray-700 font-medium">
            <a href="#" className="hover:text-green-600">Accueil</a>
            <a href="#" className="hover:text-green-600">Produits</a>
            <a href="#" className="hover:text-green-600">À propos</a>
            <a href="#" className="hover:text-green-600">Contact</a>
          </div>

          <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition">
            Connexion
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">

        <div>
          <h2 className="text-5xl font-bold text-gray-800 leading-tight">
            Bienvenue chez <span className="text-green-600">GBM</span>
          </h2>

          <p className="text-gray-600 mt-6 text-lg leading-8">
            Découvrez une large gamme de produits alimentaires
            de qualité, préparés avec soin pour répondre
            aux besoins de nos clients.
          </p>

          <div className="mt-8 flex gap-4">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg transition">
              Découvrir nos produits
            </button>

            <button className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-6 py-3 rounded-xl transition">
              Nous contacter
            </button>
          </div>
        </div>

        <div>
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e"
            alt="Produits alimentaires"
            className="rounded-3xl shadow-xl w-full h-[450px] object-cover"
          />
        </div>

      </section>

      {/* Produits */}
      <section className="bg-white py-20">

        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-4xl font-bold text-center mb-12">
            Nos Produits
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            {[
              "Farine",
              "Semoule",
              "Blé"
            ].map((produit) => (

              <div
                key={produit}
                className="bg-gray-50 rounded-2xl shadow hover:shadow-xl transition overflow-hidden"
              >

                <img
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff"
                  className="h-56 w-full object-cover"
                  alt={produit}
                />

                <div className="p-6">

                  <h3 className="text-2xl font-bold mb-3">
                    {produit}
                  </h3>

                  <p className="text-gray-600">
                    Produit alimentaire de haute qualité
                    destiné aux professionnels et particuliers.
                  </p>

                  <button className="mt-6 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg">
                    Voir plus
                  </button>

                </div>

              </div>

            ))}

          </div>

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

        </div>

      </footer>

    </main>
  );
}