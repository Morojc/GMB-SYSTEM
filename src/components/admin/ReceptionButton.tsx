"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { receptionAchat } from "@/lib/actions/cycle";

export default function ReceptionButton({ idAchat }: { idAchat: number }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function onClick() {
    if (!confirm("Réceptionner cet achat ? Le stock de matière première sera augmenté et une facture d'achat sera générée."))
      return;
    startTransition(async () => {
      const res = await receptionAchat(idAchat);
      if (!res.ok) {
        alert(res.error ?? "Réception impossible.");
        return;
      }
      router.refresh();
    });
  }

  return (
    <button
      onClick={onClick}
      disabled={pending}
      className="rounded-md bg-olive px-3 py-1.5 text-sm font-semibold text-white transition hover:brightness-95 disabled:opacity-50"
    >
      {pending ? "Réception…" : "Réceptionner"}
    </button>
  );
}
