"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { lignesTotal, rendement, sumQuantite } from "@/lib/cycle-calc";
import { revalidatePath } from "next/cache";

export interface CycleResult {
  ok: boolean;
  error?: string;
  id?: number;
  rendement?: number;
}

/**
 * Réception d'un achat: mark it "Reçu", add its purchased quantities into
 * raw-material stock, and generate the supplier invoice (facture d'achat).
 * Idempotent — refuses if already received.
 */
export async function receptionAchat(idAchat: number): Promise<CycleResult> {
  try {
    await requireRole(["ADMIN"]);

    const achat = await prisma.achat.findUnique({
      where: { id_achat: idAchat },
      include: { ligne_achat: true },
    });
    if (!achat) return { ok: false, error: "Achat introuvable." };
    if (achat.statut === "Reçu")
      return { ok: false, error: "Cet achat est déjà réceptionné." };

    const montant = lignesTotal(achat.ligne_achat);

    await prisma.$transaction(async (tx) => {
      for (const l of achat.ligne_achat) {
        if (l.id_matiere && l.quantite) {
          await tx.matiere_premiere.update({
            where: { id_matiere: l.id_matiere },
            data: { quantite: { increment: l.quantite } },
          });
        }
      }
      await tx.achat.update({ where: { id_achat: idAchat }, data: { statut: "Reçu" } });
      await tx.facture_achat.create({
        data: { id_achat: idAchat, date_facture: new Date(), montant },
      });
    });

    revalidatePath("/dashboard/reception");
    revalidatePath("/dashboard/achats");
    revalidatePath("/dashboard/matieres");
    revalidatePath("/dashboard/factures-achat");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export interface FabricationInput {
  date?: string;
  note?: string;
  intrants: { id_matiere: number; quantite: number }[];
  produits: { id_produit: number; quantite: number }[];
}

/**
 * Lancer une fabrication: record a production run that consumes raw material
 * and yields finished products, moving stock in a single transaction.
 * Returns the yield (rendement %) = output ÷ input.
 */
export async function createFabrication(input: FabricationInput): Promise<CycleResult> {
  try {
    await requireRole(["ADMIN"]);

    const intrants = input.intrants.filter((i) => i.id_matiere && i.quantite > 0);
    const produits = input.produits.filter((p) => p.id_produit && p.quantite > 0);
    if (!intrants.length)
      return { ok: false, error: "Ajoutez au moins une matière première consommée." };
    if (!produits.length)
      return { ok: false, error: "Ajoutez au moins un produit fabriqué." };

    // Stock availability check before mutating anything.
    for (const i of intrants) {
      const m = await prisma.matiere_premiere.findUnique({
        where: { id_matiere: i.id_matiere },
      });
      if (!m) return { ok: false, error: `Matière première #${i.id_matiere} introuvable.` };
      if ((m.quantite ?? 0) < i.quantite)
        return {
          ok: false,
          error: `Stock insuffisant pour « ${m.nom} » : ${m.quantite ?? 0} disponible, ${i.quantite} demandé.`,
        };
    }

    const fab = await prisma.$transaction(async (tx) => {
      const f = await tx.fabrication.create({
        data: {
          date_fabrication: input.date ? new Date(input.date) : new Date(),
          statut: "Terminée",
          note: input.note || null,
        },
      });
      for (const i of intrants) {
        await tx.fabrication_intrant.create({
          data: { id_fabrication: f.id_fabrication, id_matiere: i.id_matiere, quantite: i.quantite },
        });
        await tx.matiere_premiere.update({
          where: { id_matiere: i.id_matiere },
          data: { quantite: { decrement: i.quantite } },
        });
      }
      for (const p of produits) {
        await tx.fabrication_produit.create({
          data: { id_fabrication: f.id_fabrication, id_produit: p.id_produit, quantite: p.quantite },
        });
        await tx.produit.update({
          where: { id_produit: p.id_produit },
          data: { quantite_stock: { increment: p.quantite } },
        });
      }
      return f;
    });

    const rdt = rendement(sumQuantite(intrants), sumQuantite(produits));

    revalidatePath("/dashboard/production");
    revalidatePath("/dashboard/fabrications");
    revalidatePath("/dashboard/produits");
    revalidatePath("/dashboard/matieres");
    return { ok: true, id: fab.id_fabrication, rendement: rdt };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
