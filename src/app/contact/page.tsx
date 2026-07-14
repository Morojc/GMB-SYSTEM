import Navbar from "@/components/navbar";



export default function ContactPage() {
  return (
    <>
    <Navbar />
    <main className="min-h-screen bg-gray-100">

      <section className="bg-green-700 text-white py-16">

        <div className="max-w-6xl mx-auto px-6 text-center">

          <h1 className="text-5xl font-bold">
            Contactez-nous
          </h1>

          <p className="mt-4 text-green-100 text-lg">
            Nous sommes à votre disposition pour répondre à toutes vos questions.
          </p>

        </div>

      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">

        <div className="grid md:grid-cols-2 gap-10">

          {/* Informations */}

          <div className="bg-white rounded-2xl shadow-lg p-8">

            <h2 className="text-3xl font-bold mb-8">
              Nos coordonnées
            </h2>

            <div className="space-y-6">

              <div>
                <h3 className="font-bold text-green-600">
                  Adresse
                </h3>

                <p className="text-gray-600">
                  Zone Industrielle, Marrakech, Maroc
                </p>
              </div>

              <div>
                <h3 className="font-bold text-green-600">
                  Téléphone
                </h3>

                <p className="text-gray-600">
                  +212 *********
                </p>
              </div>

              <div>
                <h3 className="font-bold text-green-600">
                  Email
                </h3>

                <p className="text-gray-600">
                  contact@gbm.ma
                </p>
              </div>

            </div>

          </div>

          {/* Formulaire */}

          <div className="bg-white rounded-2xl shadow-lg p-8">

            <h2 className="text-3xl font-bold mb-8">
              Envoyer un message
            </h2>

            <form className="space-y-5">

              <input
                type="text"
                placeholder="Nom complet"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-600 outline-none"
              />

              <input
                type="email"
                placeholder="Adresse email"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-600 outline-none"
              />

              <input
                type="text"
                placeholder="Sujet"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-600 outline-none"
              />

              <textarea
                rows={6}
                placeholder="Votre message..."
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-600 outline-none"
              />

              <button
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition"
              >
                Envoyer
              </button>

            </form>

          </div>

        </div>

      </section>

    </main>
    </>
  );
}