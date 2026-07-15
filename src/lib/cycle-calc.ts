/**
 * Pure calculation helpers for the mill cycle — no Prisma, no I/O, so they are
 * cheap to unit-test and shared by the procurement / production / sales actions.
 */

export interface Ligne {
  quantite?: number | null;
  prix_unitaire?: number | string | { toString(): string } | null;
}

/** Total value of a set of lines: Σ(quantité × prix unitaire). */
export function lignesTotal(lignes: Ligne[]): number {
  return lignes.reduce(
    (sum, l) => sum + (l.quantite ?? 0) * Number(l.prix_unitaire ?? 0),
    0
  );
}

/** Yield of a production run as a percentage, rounded to 0.1%. */
export function rendement(totalIn: number, totalOut: number): number {
  if (totalIn <= 0) return 0;
  return Math.round((totalOut / totalIn) * 1000) / 10;
}

/** Sum a quantity field over rows. */
export function sumQuantite(rows: { quantite?: number | null }[]): number {
  return rows.reduce((s, r) => s + (r.quantite ?? 0), 0);
}
