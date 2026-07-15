import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/admin/PageHeader";
import StatCard from "@/components/admin/StatCard";
import Badge from "@/components/admin/Badge";

const LOW_STOCK_THRESHOLD = 10;

export default async function DashboardPage() {
  const [nbClients, nbEmployes, nbProduits, nbCommandes, caAgg, parStatut, lowStock] =
    await Promise.all([
      prisma.client.count(),
      prisma.employe.count(),
      prisma.produit.count(),
      prisma.commande.count(),
      prisma.facture.aggregate({ _sum: { montant: true } }),
      prisma.commande.groupBy({ by: ["statut"], _count: { _all: true } }),
      prisma.produit.findMany({
        where: { quantite_stock: { lt: LOW_STOCK_THRESHOLD } },
        orderBy: { quantite_stock: "asc" },
        take: 8,
      }),
    ]);

  const ca = Number(caAgg._sum.montant ?? 0);
  const maxStatut = Math.max(1, ...parStatut.map((s) => s._count._all));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Vue d'ensemble"
        subtitle="Tableau de bord de la Grande Minoterie GMB."
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Clients" value={nbClients} icon="👤" accent="wheat" />
        <StatCard label="Employés" value={nbEmployes} icon="👷" accent="olive" />
        <StatCard label="Produits" value={nbProduits} icon="📦" accent="amber" />
        <StatCard label="Commandes" value={nbCommandes} icon="🧾" accent="clay" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Chiffre d'affaires + commandes par statut */}
        <div className="rounded-lg border border-line bg-surface p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-roast-soft">
            Chiffre d&apos;affaires facturé
          </h2>
          <p className="mt-2 text-4xl font-bold text-wheat">
            {ca.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} MAD
          </p>

          <h3 className="mt-6 mb-3 text-sm font-semibold text-roast">
            Commandes par statut
          </h3>
          <div className="space-y-3">
            {parStatut.length === 0 && (
              <p className="text-sm text-roast-soft">Aucune commande.</p>
            )}
            {parStatut.map((s) => (
              <div key={s.statut ?? "—"} className="flex items-center gap-3">
                <div className="w-28 shrink-0">
                  <Badge value={s.statut ?? "—"} />
                </div>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-grain">
                  <div
                    className="h-full rounded-full bg-wheat"
                    style={{ width: `${(s._count._all / maxStatut) * 100}%` }}
                  />
                </div>
                <span className="w-8 text-right text-sm font-medium text-roast">
                  {s._count._all}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stock faible */}
        <div className="rounded-lg border border-line bg-surface p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-roast-soft">
            Produits en stock faible (&lt; {LOW_STOCK_THRESHOLD})
          </h2>
          <div className="mt-4 divide-y divide-line">
            {lowStock.length === 0 && (
              <p className="text-sm text-roast-soft">Tous les stocks sont sains. ✅</p>
            )}
            {lowStock.map((p) => (
              <div key={p.id_produit} className="flex items-center justify-between py-2.5">
                <span className="text-sm text-roast">{p.nom ?? `#${p.id_produit}`}</span>
                <span
                  className={`text-sm font-semibold ${
                    (p.quantite_stock ?? 0) === 0 ? "text-clay" : "text-amber"
                  }`}
                >
                  {p.quantite_stock ?? 0} u.
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
