"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { validerCommande, livrerCommande } from "@/lib/actions/sales";

export default function CommandeActions({
  idCommande,
  statut,
}: {
  idCommande: number;
  statut: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function run(fn: () => Promise<{ ok: boolean; error?: string }>, confirmMsg: string) {
    if (!confirm(confirmMsg)) return;
    startTransition(async () => {
      const res = await fn();
      if (!res.ok) {
        alert(res.error ?? "Action impossible.");
        return;
      }
      router.refresh();
    });
  }

  if (statut === "Livrée" || statut === "Annulée") {
    return <span className="text-sm text-roast-soft">—</span>;
  }

  return (
    <div className="flex justify-end gap-2">
      {statut !== "Validée" && (
        <button
          onClick={() =>
            run(
              () => validerCommande(idCommande),
              "Valider et facturer cette commande ? Le stock produit sera décrémenté et une facture de vente sera créée."
            )
          }
          disabled={pending}
          className="rounded-md bg-wheat px-3 py-1.5 text-sm font-semibold text-white transition hover:brightness-95 disabled:opacity-50"
        >
          Valider & facturer
        </button>
      )}
      {statut === "Validée" && (
        <button
          onClick={() =>
            run(
              () => livrerCommande(idCommande),
              "Marquer cette commande comme livrée ? Une livraison et un bon de livraison seront créés."
            )
          }
          disabled={pending}
          className="rounded-md bg-olive px-3 py-1.5 text-sm font-semibold text-white transition hover:brightness-95 disabled:opacity-50"
        >
          Marquer livrée
        </button>
      )}
    </div>
  );
}
