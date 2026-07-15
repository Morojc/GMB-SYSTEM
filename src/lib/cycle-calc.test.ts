import { describe, it, expect } from "vitest";
import { lignesTotal, rendement, sumQuantite } from "./cycle-calc";

describe("lignesTotal", () => {
  it("multiplies quantity by unit price and sums", () => {
    expect(
      lignesTotal([
        { quantite: 2000, prix_unitaire: 4.5 },
        { quantite: 100, prix_unitaire: "2" },
      ])
    ).toBe(9200);
  });
  it("treats missing values as zero", () => {
    expect(lignesTotal([{ quantite: null, prix_unitaire: null }, {}])).toBe(0);
  });
  it("accepts Decimal-like objects", () => {
    expect(lignesTotal([{ quantite: 3, prix_unitaire: { toString: () => "1.5" } }])).toBe(4.5);
  });
});

describe("rendement", () => {
  it("computes output/input as a percentage", () => {
    expect(rendement(1000, 780)).toBe(78);
  });
  it("rounds to one decimal", () => {
    expect(rendement(3, 2)).toBe(66.7);
  });
  it("returns 0 when there is no input", () => {
    expect(rendement(0, 500)).toBe(0);
  });
});

describe("sumQuantite", () => {
  it("sums quantities, ignoring nulls", () => {
    expect(sumQuantite([{ quantite: 5 }, { quantite: null }, { quantite: 3 }])).toBe(8);
  });
});
