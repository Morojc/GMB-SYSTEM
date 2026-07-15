import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/admin/PageHeader";
import ReceptionButton from "@/components/admin/ReceptionButton";

export default async function ReceptionPage() {
  const achats = await prisma.achat.findMany({
    where: { statut: { not: "Reçu" } },
    include: { fournisseur: true, ligne_achat: { include: { matiere_premiere: true } } },
    orderBy: { id_achat: "desc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Réception des achats"
        subtitle="Valider l'arrivée du blé / des matières premières : met à jour le stock et génère la facture d'achat."
      />

      {achats.length === 0 ? (
        <div className="rounded-lg border border-line bg-surface p-10 text-center text-roast-soft">
          Aucun achat en attente de réception. ✅
        </div>
      ) : (
        <div className="space-y-4">
          {achats.map((a) => {
            const total = a.ligne_achat.reduce(
              (s, l) => s + (l.quantite ?? 0) * Number(l.prix_unitaire ?? 0),
              0
            );
            return (
              <div key={a.id_achat} className="rounded-lg border border-line bg-surface p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-roast">
                      Achat #{a.id_achat} — {a.fournisseur?.nom ?? "Fournisseur inconnu"}
                    </p>
                    <p className="text-sm text-roast-soft">
                      {a.date_achat ? new Date(a.date_achat).toLocaleDateString("fr-FR") : "—"} ·{" "}
                      <span className="rounded-full bg-amber/15 px-2 py-0.5 text-amber">
                        {a.statut ?? "—"}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-roast">{total.toFixed(2)} MAD</p>
                    {a.statut !== "Annulé" && <ReceptionButton idAchat={a.id_achat} />}
                  </div>
                </div>

                <ul className="mt-3 divide-y divide-line border-t border-line pt-2 text-sm">
                  {a.ligne_achat.map((l) => (
                    <li key={l.id_ligne_achat} className="flex justify-between py-1.5 text-roast-soft">
                      <span>{l.matiere_premiere?.nom ?? `Matière #${l.id_matiere}`}</span>
                      <span>
                        {l.quantite ?? 0} kg × {Number(l.prix_unitaire ?? 0).toFixed(2)} MAD
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
