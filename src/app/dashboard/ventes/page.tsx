import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/admin/PageHeader";
import Badge from "@/components/admin/Badge";
import CommandeActions from "@/components/admin/CommandeActions";
import { lignesTotal } from "@/lib/cycle-calc";

export default async function VentesPage() {
  const commandes = await prisma.commande.findMany({
    orderBy: { id_commande: "desc" },
    include: {
      client: { include: { personne: true } },
      ligne_commande: true,
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Traitement des commandes"
        subtitle="Valider & facturer les commandes clients, puis les marquer livrées."
      />

      <div className="overflow-hidden rounded-lg border border-line bg-surface shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-grain/60 text-left text-roast-soft">
                <th className="px-5 py-3 font-semibold">Commande</th>
                <th className="px-5 py-3 font-semibold">Client</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Montant</th>
                <th className="px-5 py-3 font-semibold">Statut</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {commandes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-roast-soft">
                    Aucune commande.
                  </td>
                </tr>
              ) : (
                commandes.map((c, i) => {
                  const montant = lignesTotal(c.ligne_commande);
                  const personne = c.client?.personne;
                  return (
                    <tr
                      key={c.id_commande}
                      className={`border-t border-line/70 ${i % 2 ? "bg-grain/30" : "bg-surface"}`}
                    >
                      <td className="px-5 py-3 font-medium text-roast">#{c.id_commande}</td>
                      <td className="px-5 py-3 text-roast">
                        {personne ? `${personne.prenom} ${personne.nom}` : "—"}
                      </td>
                      <td className="px-5 py-3 text-roast-soft">
                        {c.date_commande
                          ? new Date(c.date_commande).toLocaleDateString("fr-FR")
                          : "—"}
                      </td>
                      <td className="px-5 py-3 font-medium text-roast">{montant.toFixed(2)} MAD</td>
                      <td className="px-5 py-3">
                        {c.statut ? <Badge value={c.statut} /> : "—"}
                      </td>
                      <td className="px-5 py-3">
                        <CommandeActions idCommande={c.id_commande} statut={c.statut} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
