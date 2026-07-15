"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createFabrication } from "@/lib/actions/cycle";

interface MatiereOpt {
  id_matiere: number;
  nom: string | null;
  quantite: number | null;
}
interface ProduitOpt {
  id_produit: number;
  nom: string | null;
}
let counter = 0;

export default function ProductionForm({
  matieres,
  produits,
}: {
  matieres: MatiereOpt[];
  produits: ProduitOpt[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [note, setNote] = useState("");
  const [intrants, setIntrants] = useState<Record<string, string>[]>([{ key: "0", id: "", quantite: "" }]);
  const [sorties, setSorties] = useState<Record<string, string>[]>([{ key: "0", id: "", quantite: "" }]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function update(
    list: Record<string, string>[],
    setList: (v: Record<string, string>[]) => void,
    i: number,
    field: "id" | "quantite",
    value: string
  ) {
    const next = list.map((row, idx) => (idx === i ? { ...row, [field]: value } : row));
    setList(next);
  }
  function addRow(list: Record<string, string>[], setList: (v: Record<string, string>[]) => void) {
    setList([...list, { key: String(Date.now() + counter++), id: "", quantite: "" }]);
  }
  function removeRow(list: Record<string, string>[], setList: (v: Record<string, string>[]) => void, i: number) {
    setList(list.length > 1 ? list.filter((_, idx) => idx !== i) : list);
  }

  function submit() {
    setError("");
    setSuccess("");
    const payload = {
      note,
      intrants: intrants
        .filter((r) => r.id && r.quantite)
        .map((r) => ({ id_matiere: parseInt(r.id, 10), quantite: parseInt(r.quantite, 10) })),
      produits: sorties
        .filter((r) => r.id && r.quantite)
        .map((r) => ({ id_produit: parseInt(r.id, 10), quantite: parseInt(r.quantite, 10) })),
    };
    startTransition(async () => {
      const res = await createFabrication(payload);
      if (!res.ok) {
        setError(res.error ?? "Erreur.");
        return;
      }
      setSuccess(
        `Fabrication #${res.id} enregistrée. Rendement : ${res.rendement ?? 0}%. Stock mis à jour.`
      );
      setIntrants([{ key: "0", id: "", quantite: "" }]);
      setSorties([{ key: "0", id: "", quantite: "" }]);
      setNote("");
      router.refresh();
    });
  }

  const inputCls =
    "rounded-md border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-wheat";

  return (
    <div className="max-w-2xl space-y-6 rounded-lg border border-line bg-surface p-6 shadow-sm">
      {/* Intrants */}
      <section>
        <h3 className="mb-2 text-sm font-semibold text-roast">🌾 Matières premières consommées</h3>
        <div className="space-y-2">
          {intrants.map((row, i) => (
            <div key={row.key} className="flex gap-2">
              <select
                value={row.id}
                onChange={(e) => update(intrants, setIntrants, i, "id", e.target.value)}
                className={`${inputCls} flex-1`}
              >
                <option value="">— Matière —</option>
                {matieres.map((m) => (
                  <option key={m.id_matiere} value={m.id_matiere}>
                    {m.nom} (stock : {m.quantite ?? 0} kg)
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Qté (kg)"
                value={row.quantite}
                onChange={(e) => update(intrants, setIntrants, i, "quantite", e.target.value)}
                className={`${inputCls} w-28`}
              />
              <button
                type="button"
                onClick={() => removeRow(intrants, setIntrants, i)}
                className="rounded-md px-2 text-clay hover:bg-clay/10"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => addRow(intrants, setIntrants)}
          className="mt-2 text-sm font-medium text-wheat hover:underline"
        >
          + Ajouter une matière
        </button>
      </section>

      {/* Produits */}
      <section>
        <h3 className="mb-2 text-sm font-semibold text-roast">📦 Produits fabriqués</h3>
        <div className="space-y-2">
          {sorties.map((row, i) => (
            <div key={row.key} className="flex gap-2">
              <select
                value={row.id}
                onChange={(e) => update(sorties, setSorties, i, "id", e.target.value)}
                className={`${inputCls} flex-1`}
              >
                <option value="">— Produit —</option>
                {produits.map((p) => (
                  <option key={p.id_produit} value={p.id_produit}>
                    {p.nom}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Qté"
                value={row.quantite}
                onChange={(e) => update(sorties, setSorties, i, "quantite", e.target.value)}
                className={`${inputCls} w-28`}
              />
              <button
                type="button"
                onClick={() => removeRow(sorties, setSorties, i)}
                className="rounded-md px-2 text-clay hover:bg-clay/10"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => addRow(sorties, setSorties)}
          className="mt-2 text-sm font-medium text-wheat hover:underline"
        >
          + Ajouter un produit
        </button>
      </section>

      <div>
        <label className="mb-1 block text-sm font-medium text-roast">Note (optionnel)</label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className={`${inputCls} w-full`}
          placeholder="Ex. lot du matin"
        />
      </div>

      {error && <p className="rounded-md bg-clay/10 px-3 py-2 text-sm text-clay">{error}</p>}
      {success && <p className="rounded-md bg-olive/10 px-3 py-2 text-sm text-olive">{success}</p>}

      <button
        onClick={submit}
        disabled={pending}
        className="rounded-md bg-wheat px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 disabled:opacity-50"
      >
        {pending ? "Enregistrement…" : "🏭 Lancer la fabrication"}
      </button>
    </div>
  );
}
