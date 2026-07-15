"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteRecord } from "@/lib/actions/crud";

export default function DeleteButton({
  resourceKey,
  id,
  label,
}: {
  resourceKey: string;
  id: string;
  label: string;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function onDelete() {
    if (!confirm(`Supprimer « ${label} » ? Cette action est irréversible.`)) return;
    startTransition(async () => {
      const res = await deleteRecord(resourceKey, id);
      if (!res.ok) {
        alert(res.error ?? "Suppression impossible.");
        return;
      }
      router.refresh();
    });
  }

  return (
    <button
      onClick={onDelete}
      disabled={pending}
      className="rounded-md px-2 py-1 text-sm font-medium text-clay transition hover:bg-clay/10 disabled:opacity-50"
    >
      {pending ? "…" : "Supprimer"}
    </button>
  );
}
