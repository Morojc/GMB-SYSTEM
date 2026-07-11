import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const nbEmployes = await prisma.employe.count();
  const nbClients = await prisma.client.count();
  const nbProduits = await prisma.produit.count();
  const nbCommandes = await prisma.commande.count();

  return (
    <div className="space-y-8">
      {/* Titre */}
      <div>
        <h1 className="text-4xl font-bold text-gray-800">
          Dashboard
        </h1>
        <p className="text-gray-500 mt-2">
          Bienvenue dans votre système de gestion GBM.
        </p>
      </div>

      {/* Cartes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* Employés */}
        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 p-6 border-l-4 border-blue-600">
          <h2 className="text-gray-500 text-sm uppercase">
            Employés
          </h2>

          <p className="text-4xl font-bold text-blue-600 mt-3">
            {nbEmployes}
          </p>
        </div>

        {/* Clients */}
        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 p-6 border-l-4 border-green-600">
          <h2 className="text-gray-500 text-sm uppercase">
            Clients
          </h2>

          <p className="text-4xl font-bold text-green-600 mt-3">
            {nbClients}
          </p>
        </div>

        {/* Produits */}
        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 p-6 border-l-4 border-yellow-500">
          <h2 className="text-gray-500 text-sm uppercase">
            Produits
          </h2>

          <p className="text-4xl font-bold text-yellow-500 mt-3">
            {nbProduits}
          </p>
        </div>

        {/* Commandes */}
        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 p-6 border-l-4 border-red-500">
          <h2 className="text-gray-500 text-sm uppercase">
            Commandes
          </h2>

          <p className="text-4xl font-bold text-red-500 mt-3">
            {nbCommandes}
          </p>
        </div>

      </div>
    </div>
  );
}