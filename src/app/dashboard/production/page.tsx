import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/admin/PageHeader";
import ProductionForm from "@/components/admin/ProductionForm";

export default async function ProductionPage() {
  const [matieres, produits, fabrications] = await Promise.all([
    prisma.matiere_premiere.findMany({ orderBy: { nom: "asc" } }),
    prisma.produit.findMany({ orderBy: { nom: "asc" } }),
    prisma.fabrication.findMany({
      orderBy: { id_fabrication: "desc" },
      take: 6,
      include: {
        fabrication_intrant: { include: { matiere_premiere: true } },
        fabrication_produit: { include: { produit: true } },
      },
    }),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Atelier de production"
        subtitle="Transformer le blé en produits finis. Le stock des matières et des produits est mis à jour automatiquement."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ProductionForm
          matieres={matieres.map((m) => ({
            id_matiere: m.id_matiere,
            nom: m.nom,
            quantite: m.quantite,
          }))}
          produits={produits.map((p) => ({ id_produit: p.id_produit, nom: p.nom }))}
        />

        {/* Recent runs */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-roast-soft">
            Dernières fabrications
          </h3>
          {fabrications.length === 0 && (
            <p className="text-sm text-roast-soft">Aucune fabrication pour l&apos;instant.</p>
          )}
          {fabrications.map((f) => {
            const totalIn = f.fabrication_intrant.reduce((s, i) => s + (i.quantite ?? 0), 0);
            const totalOut = f.fabrication_produit.reduce((s, p) => s + (p.quantite ?? 0), 0);
            const rendement = totalIn > 0 ? Math.round((totalOut / totalIn) * 1000) / 10 : 0;
            return (
              <div key={f.id_fabrication} className="rounded-lg border border-line bg-surface p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-roast">Fabrication #{f.id_fabrication}</span>
                  <span className="text-sm text-roast-soft">
                    {f.date_fabrication
                      ? new Date(f.date_fabrication).toLocaleDateString("fr-FR")
                      : "—"}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-roast-soft">
                  <span>🌾 {totalIn} kg consommés</span>
                  <span>📦 {totalOut} produits</span>
                  <span className="font-medium text-olive">Rendement {rendement}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
