import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { lignesTotal } from "@/lib/cycle-calc";
import Navbar from "@/components/navbar";

export const dynamic = "force-dynamic";

const STATUT_TONE: Record<string, string> = {
  "En attente": "bg-yellow-100 text-yellow-700",
  Validée: "bg-blue-100 text-blue-700",
  Livrée: "bg-green-100 text-green-700",
  Annulée: "bg-red-100 text-red-700",
};

export default async function MesCommandesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const client = await prisma.client.findUnique({
    where: { id_personne: user.idPersonne },
  });

  const commandes = client
    ? await prisma.commande.findMany({
        where: { id_client: client.id_client },
        orderBy: { id_commande: "desc" },
        include: { ligne_commande: true },
      })
    : [];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Mes Commandes</h1>
            <Link
              href="/produits"
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg"
            >
              Continuer les achats
            </Link>
          </div>

          {commandes.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500">
              Vous n&apos;avez pas encore de commande.
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-green-600 text-white">
                  <tr>
                    <th className="p-4 text-left">Commande</th>
                    <th className="p-4 text-left">Date</th>
                    <th className="p-4 text-left">Articles</th>
                    <th className="p-4 text-left">Montant</th>
                    <th className="p-4 text-left">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {commandes.map((c) => {
                    const total = lignesTotal(c.ligne_commande);
                    const tone = STATUT_TONE[c.statut ?? ""] ?? "bg-gray-100 text-gray-700";
                    return (
                      <tr key={c.id_commande} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-medium">
                          CMD-{String(c.id_commande).padStart(6, "0")}
                        </td>
                        <td className="p-4">
                          {c.date_commande
                            ? new Date(c.date_commande).toLocaleDateString("fr-FR")
                            : "—"}
                        </td>
                        <td className="p-4">{c.ligne_commande.length}</td>
                        <td className="p-4">{total.toFixed(2)} DH</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full ${tone}`}>
                            {c.statut ?? "—"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-8 flex gap-4">
            <Link
              href="/"
              className="border border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-6 py-3 rounded-lg"
            >
              Retour à l&apos;accueil
            </Link>
            <Link
              href="/produits"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
            >
              Voir les produits
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
