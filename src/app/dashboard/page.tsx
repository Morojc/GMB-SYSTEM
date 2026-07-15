import { prisma } from "@/lib/prisma";
import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import StatCard from "@/components/admin/StatCard";
import Badge from "@/components/admin/Badge";

const LOW_STOCK_THRESHOLD = 10;

function mad(n: number) {
  return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " MAD";
}

export default async function DashboardPage() {
  const [
    nbFournisseurs,
    achatsEnCours,
    matiereAgg,
    nbFabrications,
    produitAgg,
    nbCommandes,
    nbClients,
    ventesAgg,
    achatsAgg,
    parStatut,
    lowStock,
  ] = await Promise.all([
    prisma.fournisseur.count(),
    prisma.achat.count({ where: { statut: "Commandé" } }),
    prisma.matiere_premiere.aggregate({ _sum: { quantite: true } }),
    prisma.fabrication.count(),
    prisma.produit.aggregate({ _sum: { quantite_stock: true } }),
    prisma.commande.count(),
    prisma.client.count(),
    prisma.facture.aggregate({ _sum: { montant: true } }),
    prisma.facture_achat.aggregate({ _sum: { montant: true } }),
    prisma.commande.groupBy({ by: ["statut"], _count: { _all: true } }),
    prisma.produit.findMany({
      where: { quantite_stock: { lt: LOW_STOCK_THRESHOLD } },
      orderBy: { quantite_stock: "asc" },
      take: 8,
    }),
  ]);

  const totalVentes = Number(ventesAgg._sum.montant ?? 0);
  const totalAchats = Number(achatsAgg._sum.montant ?? 0);
  const marge = totalVentes - totalAchats;
  const maxStatut = Math.max(1, ...parStatut.map((s) => s._count._all));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Vue d'ensemble"
        subtitle="Cycle du Grand Moulin : approvisionnement → production → stock → ventes."
      />

      {/* Cycle KPIs */}
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-roast-soft">
          🚜 Approvisionnement & Production
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Fournisseurs" value={nbFournisseurs} icon="🚜" accent="wheat" />
          <StatCard label="Achats en cours" value={achatsEnCours} icon="🧾" accent="amber" />
          <StatCard
            label="Stock matière (kg)"
            value={(matiereAgg._sum.quantite ?? 0).toLocaleString("fr-FR")}
            icon="🌾"
            accent="olive"
          />
          <StatCard label="Fabrications" value={nbFabrications} icon="🏭" accent="wheat" />
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-roast-soft">
          📦 Stock & Ventes
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Produits finis (u.)"
            value={(produitAgg._sum.quantite_stock ?? 0).toLocaleString("fr-FR")}
            icon="📦"
            accent="olive"
          />
          <StatCard label="Commandes" value={nbCommandes} icon="🧾" accent="clay" />
          <StatCard label="Clients" value={nbClients} icon="👤" accent="wheat" />
          <StatCard label="Marge brute" value={mad(marge)} icon="📈" accent={marge >= 0 ? "olive" : "clay"} />
        </div>
      </div>

      {/* Finance + operations */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-line bg-surface p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-roast-soft">
            Bilan financier
          </h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <span className="text-roast-soft">Ventes facturées (clients)</span>
              <span className="text-lg font-bold text-olive">{mad(totalVentes)}</span>
            </div>
            <div className="flex items-center justify-between border-b border-line pb-3">
              <span className="text-roast-soft">Achats facturés (fournisseurs)</span>
              <span className="text-lg font-bold text-clay">− {mad(totalAchats)}</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="font-semibold text-roast">Marge brute</span>
              <span className={`text-2xl font-bold ${marge >= 0 ? "text-olive" : "text-clay"}`}>
                {mad(marge)}
              </span>
            </div>
          </div>

          <h3 className="mt-6 mb-3 text-sm font-semibold text-roast">Commandes par statut</h3>
          <div className="space-y-3">
            {parStatut.length === 0 && <p className="text-sm text-roast-soft">Aucune commande.</p>}
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
                <span className="w-8 text-right text-sm font-medium text-roast">{s._count._all}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {/* Quick actions */}
          <div className="rounded-lg border border-line bg-surface p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-roast-soft">
              Opérations rapides
            </h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/dashboard/reception"
                className="rounded-md bg-olive px-4 py-2 text-sm font-semibold text-white hover:brightness-95"
              >
                📥 Réceptionner un achat
              </Link>
              <Link
                href="/dashboard/production"
                className="rounded-md bg-wheat px-4 py-2 text-sm font-semibold text-white hover:brightness-95"
              >
                🏭 Lancer une production
              </Link>
            </div>
          </div>

          {/* Low stock */}
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
    </div>
  );
}
