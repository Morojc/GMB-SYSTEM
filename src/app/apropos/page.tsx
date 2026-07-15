import Navbar from "@/components/navbar";



export default function AproposPage() {
  return (
    <>
    <Navbar />
    <main className="min-h-screen bg-gray-100">

      <section className="bg-green-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">

          <h1 className="text-5xl font-bold">
            À propos de GMB
          </h1>

          <p className="mt-4 text-lg text-green-100">
            Découvrez notre entreprise et notre engagement envers la qualité.
          </p>

        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">

        <div className="grid md:grid-cols-2 gap-12 items-center">

          <img
            src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=900"
            alt="Entreprise"
            className="rounded-2xl shadow-lg"
          />

          <div>

            <h2 className="text-3xl font-bold mb-6">
              Qui sommes-nous ?
            </h2>

            <p className="text-gray-600 leading-8 mb-6">
              GBM est une entreprise spécialisée dans la production et la
              commercialisation de produits alimentaires de haute qualité.
              Notre objectif est d&apos;offrir des produits répondant aux normes
              les plus exigeantes.
            </p>

            <p className="text-gray-600 leading-8">
              Grâce à une équipe qualifiée et des équipements modernes,
              nous garantissons une qualité constante et un service
              professionnel à nos clients.
            </p>

          </div>

        </div>

      </section>

      <section className="bg-white py-16">

        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-3xl font-bold text-center mb-12">
            Nos Valeurs
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            <div className="shadow-lg rounded-xl p-8 text-center">
              <h3 className="text-xl font-bold mb-3">
                Qualité
              </h3>

              <p className="text-gray-600">
                Des produits conformes aux meilleures normes.
              </p>
            </div>

            <div className="shadow-lg rounded-xl p-8 text-center">
              <h3 className="text-xl font-bold mb-3">
                Innovation
              </h3>

              <p className="text-gray-600">
                Des solutions modernes pour satisfaire nos clients.
              </p>
            </div>

            <div className="shadow-lg rounded-xl p-8 text-center">
              <h3 className="text-xl font-bold mb-3">
                Satisfaction
              </h3>

              <p className="text-gray-600">
                Votre satisfaction est notre priorité.
              </p>
            </div>

          </div>

        </div>

      </section>

    </main>
    </>
  );
}