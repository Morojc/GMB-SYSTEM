"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { lignesTotal } from "@/lib/cycle-calc";
import { revalidatePath } from "next/cache";

export interface SalesResult {
  ok: boolean;
  error?: string;
  montant?: number;
}

function revalidateSales() {
  revalidatePath("/dashboard/ventes");
  revalidatePath("/dashboard/commandes");
  revalidatePath("/dashboard/factures");
  revalidatePath("/dashboard/produits");
}

/**
 * Valider une commande: reserve stock, set it "Validée", and issue the sales
 * invoice (facture de vente). Decrements finished-product stock per line.
 */
export async function validerCommande(idCommande: number): Promise<SalesResult> {
  try {
    await requireRole(["ADMIN"]);

    const commande = await prisma.commande.findUnique({
      where: { id_commande: idCommande },
      include: { ligne_commande: { include: { produit: true } } },
    });
    if (!commande) return { ok: false, error: "Commande introuvable." };
    if (commande.statut === "Validée" || commande.statut === "Livrée")
      return { ok: false, error: "Cette commande est déjà traitée." };
    if (commande.ligne_commande.length === 0)
      return { ok: false, error: "Commande sans lignes." };

    // Stock availability check.
    for (const l of commande.ligne_commande) {
      const dispo = l.produit?.quantite_stock ?? 0;
      if (l.id_produit && (l.quantite ?? 0) > dispo)
        return {
          ok: false,
          error: `Stock insuffisant pour « ${l.produit?.nom ?? l.id_produit} » : ${dispo} disponible, ${l.quantite} demandé.`,
        };
    }

    const montant = lignesTotal(commande.ligne_commande);

    await prisma.$transaction(async (tx) => {
      for (const l of commande.ligne_commande) {
        if (l.id_produit && l.quantite) {
          await tx.produit.update({
            where: { id_produit: l.id_produit },
            data: { quantite_stock: { decrement: l.quantite } },
          });
        }
      }
      await tx.commande.update({
        where: { id_commande: idCommande },
        data: { statut: "Validée" },
      });
      await tx.facture.create({
        data: { id_commande: idCommande, date_facture: new Date(), montant },
      });
    });

    revalidateSales();
    return { ok: true, montant };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

/**
 * Livrer une commande: requires it to be validated (a sales invoice exists).
 * Creates a delivery + delivery voucher and marks the order "Livrée".
 */
export async function livrerCommande(idCommande: number): Promise<SalesResult> {
  try {
    await requireRole(["ADMIN"]);

    const commande = await prisma.commande.findUnique({
      where: { id_commande: idCommande },
      include: { facture: { orderBy: { id_facture: "desc" }, take: 1 } },
    });
    if (!commande) return { ok: false, error: "Commande introuvable." };
    if (commande.statut !== "Validée")
      return { ok: false, error: "Validez d'abord la commande (facturation)." };

    const facture = commande.facture[0];
    const livreur = await prisma.livreur.findFirst();

    await prisma.$transaction(async (tx) => {
      const livraison = await tx.livraison.create({
        data: {
          id_facture: facture?.id_facture ?? null,
          id_livreur: livreur?.id_livreur ?? null,
          date_livraison: new Date(),
          statut: "Livrée",
        },
      });
      await tx.bon_livraison.create({
        data: { id_livraison: livraison.id_livraison, date_creation: new Date() },
      });
      await tx.commande.update({
        where: { id_commande: idCommande },
        data: { statut: "Livrée" },
      });
    });

    revalidateSales();
    revalidatePath("/dashboard/livraisons");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
