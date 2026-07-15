# Grand Moulin — Operations Cycle (Admin) Design

**Date:** 2026-07-15
**Status:** Approved → implementation
**Builds on:** `2026-07-15-gmb-dashboard-auth-design.md`

Reorients the system around a flour mill's **internal operations**: buy wheat →
store → mill (produce) → finished product → sell/invoice. Dashboard becomes
**admin-only**. Billing covers **both** supplier (achat) and client (vente) sides.

## 1. Schema additions (7 tables)

No existing table is dropped. New models (snake_case, matching convention):

- `fournisseur(id_fournisseur, nom, telephone?, email?, adresse?)`
- `achat(id_achat, id_fournisseur?, date_achat?, statut?)` — statut ∈ {Commandé, Reçu, Annulé}
- `ligne_achat(id_ligne_achat, id_achat?, id_matiere?, quantite?, prix_unitaire?)`
- `facture_achat(id_facture_achat, id_achat?, date_facture?, montant?)` — supplier invoice
- `fabrication(id_fabrication, date_fabrication?, statut?, note?)` — production run; statut ∈ {En cours, Terminée, Annulée}
- `fabrication_intrant(id_intrant, id_fabrication?, id_matiere?, quantite?)` — raw material consumed
- `fabrication_produit(id_fab_produit, id_fabrication?, id_produit?, quantite?)` — product produced

Back-relations added: `matiere_premiere.ligne_achat[]`, `matiere_premiere.fabrication_intrant[]`,
`produit.fabrication_produit[]`. Existing `facture` = **facture de vente** (sales).

`prisma generate` runs offline (compiles the client from schema). Applying the
tables needs `prisma db push`/`migrate` against a live DB (deferred) — the seed
is extended to populate them.

## 2. Access — admin-only

`/dashboard/*` requires `role === "ADMIN"` in `proxy.ts` and the dashboard layout
(`isStaff` → `isAdmin`). EMPLOYE/CLIENT redirected. Storefront stays public.
`adminOnly` per-resource flags become redundant but are harmless; the whole
dashboard is admin.

## 3. Nav regrouped around the cycle

New `ResourceGroup` set: `Approvisionnement | Production | Stock | Ventes | RH | Système`.

- **Approvisionnement**: fournisseurs, achats, factures d'achat
- **Production**: fabrications, silos, matières premières, produits, types, catalogues
- **Stock**: stock, zones
- **Ventes**: commandes, clients, factures (de vente), livraisons, livreurs, bons
- **RH**: employés, rôles, salaires
- **Système**: personnes

(`ligne_achat`, `fabrication_intrant/produit`, `catalogue_produit`, `ligne_commande`,
`bon_*` remain reachable but are secondary; kept in sensible groups.)

## 4. Guided workflows (business logic beyond generic CRUD)

Implemented as dedicated pages + transactional Server Actions:

**A. Réception d'un achat** (`/dashboard/achats/[id]/reception`)
- Precondition: achat not already Reçu.
- Transaction: for each `ligne_achat`, `matiere_premiere.quantite += ligne.quantite`;
  set `achat.statut = "Reçu"`; create a `facture_achat` with `montant = Σ(quantite × prix_unitaire)`.
- Idempotent guard: refuse if already Reçu.

**B. Lancer une fabrication** (`/dashboard/fabrications/new`)
- Purpose-built form: date + note; N input rows (matière premières + quantité) +
  M output rows (produit + quantité).
- Validation: each input quantity ≤ current `matiere_premiere.quantite`.
- Transaction: create `fabrication` (+intrants +produits); `matiere_premiere.quantite -= q`
  for each input; `produit.quantite_stock += q` for each output; `statut = "Terminée"`.
- Show **rendement** = Σ(output qty) / Σ(input qty) × 100%.

Both actions are ADMIN-guarded and use `prisma.$transaction`.

## 5. Facturation (both directions)

- **Factures d'achat** (from §4A) and **Factures de vente** (existing `facture`)
  each get a dashboard list.
- Overview finance card: `total achats = Σ facture_achat.montant`,
  `total ventes = Σ facture.montant`, `marge = ventes − achats`.

## 6. Overview (cycle-oriented)

KPIs across the cycle: fournisseurs, achats en cours, stock matière première (Σ),
fabrications, produits finis en stock (Σ), commandes, clients. Finance summary
(§5). Low-stock products + silo capacity (existing).

## 7. Phases

- **P1**: schema + generate + seed; admin-only lock; regrouped nav; generic CRUD
  configs for the 7 new tables.
- **P2**: guided workflows A & B (transactional stock movements).
- **P3**: cycle overview + finance summary; docs update.

## 8. Out of scope (unchanged)

PDF invoices, payments/accounting ledger, multi-warehouse transfers, BOM/recipes
(fabrication inputs are entered manually, not from a recipe), storefront redesign.
