# GMB — Architecture & Developer Guide

This guide explains how the GMB system is put together and how to extend it.
For setup and run instructions see the [README](../README.md).

> **This is a flour-mill (Grand Moulin) operations system.** The dashboard is
> **admin-only** and models the full cycle: **buy wheat → store → mill (produce)
> → finished product → sell & invoice**. See §9 for the cycle and its two guided
> workflows.

---

## 1. Domain glossary (French → meaning)

The database models a flour mill and its distribution chain. Terms are French
and columns are **snake_case**.

| Model              | Meaning                                             |
| ------------------ | --------------------------------------------------- |
| `personne`         | A person (identity: name, email, password). Base for clients & employees. |
| `client`           | A customer — a `personne` who can place orders.     |
| `employe`          | An employee — a `personne` with a role.             |
| `role_employe`     | Job role (e.g. *Admin*, *Meunier* = miller).        |
| `salaire`          | Salary record for an employee.                      |
| `commande`         | A customer order (has a `statut`).                  |
| `ligne_commande`   | A line item of an order (product × quantity × price).|
| `facture`          | An invoice for an order.                             |
| `bon_commande`     | Purchase voucher tied to an order.                  |
| `livraison`        | A delivery (linked to an invoice and a driver).     |
| `livreur`          | A delivery driver.                                  |
| `bon_livraison`    | Delivery voucher tied to a delivery.                |
| `produit`          | A product (flour, semolina…) with price & stock.    |
| `type_produit`     | Product category.                                   |
| `catalogue`        | A product catalogue.                                |
| `catalogue_produit`| Join table: which products are in which catalogue (composite key). |
| `stock`            | Stock of a product in a zone.                       |
| `zone_stock`       | A storage zone / warehouse area.                    |
| `silon`            | A silo (stores raw material).                        |
| `matiere_premiere` | Raw material (e.g. wheat) stored in a silo.         |
| `fournisseur`      | Supplier the mill buys wheat / raw material from.    |
| `achat`            | A purchase order to a supplier (statut: Commandé/Reçu/Annulé). |
| `ligne_achat`      | A purchase line (raw material × quantity × price).   |
| `facture_achat`    | Supplier invoice (money paid out).                   |
| `fabrication`      | A production run (milling wheat into products).      |
| `fabrication_intrant` | Raw material **consumed** by a production run.    |
| `fabrication_produit` | Finished product **produced** by a run.           |

> `facture` (tied to `commande`) is the **sales** invoice ("facture de vente");
> `facture_achat` (tied to `achat`) is the **purchase** invoice.

## 2. Tech stack

- **Next.js 16** App Router (React Server Components + Server Actions)
- **Prisma 6** ORM over **PostgreSQL**
- **Tailwind CSS v4** (design tokens in `globals.css`)
- **jsonwebtoken** (sign) + **jose** (verify in `proxy.ts`) for JWT auth
- **bcryptjs** for password hashing
- **Vitest** for unit tests

## 3. Authentication & authorization

### Roles

`ADMIN | EMPLOYE | CLIENT`, derived from the `personne`'s relations:

- has an `employe` whose `role_employe.nom_role` is *Admin*/*Administrateur* → **ADMIN**
- has any other `employe` → **EMPLOYE**
- has a `client` → **CLIENT**

`resolveRole()` in `src/lib/roles.ts` implements this (pure, unit-tested).

### Flow

```
POST /api/auth/login
  → find personne by email (+ client, employe.role_employe)
  → bcrypt.compare(password, personne.password)
  → resolveRole(personne)
  → generateToken({ idPersonne, email, role })   [jsonwebtoken, HS256, 7d]
  → Set-Cookie: token=<jwt>  (httpOnly, sameSite=lax)

Every request → src/proxy.ts (runs before rendering, nodejs runtime)
  → /dashboard/*                     ADMIN only, else → /produits (or /login if anonymous)
  → /panier /commande /confirmation  require any authenticated user, else → /login
  → jwtVerify(token, JWT_SECRET)      [jose]

Server Components / Actions → getCurrentUser() / requireRole([...])  (src/lib/auth.ts)
POST /api/auth/logout → clears the cookie
```

There is a **single** auth system and a **single** `token` cookie. Client login
(`/client/login`) and staff login (`/login`) both call `/api/auth/login` and
redirect by role. Client self-registration is `POST /api/client/inscription`.

### Permission matrix

| Area                                   | ADMIN | EMPLOYE | CLIENT |
| -------------------------------------- | :---: | :-----: | :----: |
| **Entire `/dashboard`** (all resources + workflows) | ✅ | ❌ | ❌ |
| Storefront, cart, place order          |  ✅   |   ✅    |   ✅   |

The dashboard is **admin-only** (enforced in `proxy.ts` and the dashboard layout).
Write Server Actions still call `requireRole` — because Server Actions are reachable
by direct POST, not only through the UI. (Per-resource `adminOnly` flags remain in
the configs but are moot while the whole dashboard is admin-only.)

## 4. The resource framework

The dashboard does **not** hand-write ~20 CRUD screens. Each entity is described
once by a `ResourceConfig`, and generic components + routes render it.

```
src/lib/resources/
  types.ts        ResourceConfig / FieldConfig / RelationConfig
  index.ts        REGISTRY + getResource() / allResources() / navGroups()
  produit.ts, commercial.ts, production.ts, rh.ts, …   the configs

src/lib/
  actions/crud.ts  submitResource() (create/update) + deleteRecord()
  loadOptions.ts   loads <select> options for relation fields
  format.ts        coerceValue / formatValue / getPath / relationLabel

src/components/admin/
  DataTable.tsx    list + search (columns from fields[inList])
  ResourceForm.tsx create/edit form (inputs from fields[inForm])
  DeleteButton.tsx confirm + delete action
  Sidebar.tsx      grouped nav from navGroups()
  Topbar.tsx StatCard.tsx PageHeader.tsx Badge.tsx

src/app/dashboard/
  page.tsx                       overview (KPIs + aggregates)
  [resource]/page.tsx            generic list
  [resource]/new/page.tsx        generic create
  [resource]/[id]/edit/page.tsx  generic edit
```

### How data flows for one screen

1. `/dashboard/produits` → `getResource("produits")` → Prisma
   `produit.findMany({ include: listInclude })` → `<DataTable cfg rows />`.
2. `/dashboard/produits/new` → `loadRelationOptions(cfg)` builds `<select>`
   options for relation fields → `<ResourceForm mode="new" />`.
3. The form submits to the `submitResource` Server Action (resource key, mode and
   id travel as hidden fields). It coerces each field by type, enforces the role,
   runs `prisma[model].create/update`, `revalidatePath`, and redirects back.

### Field & relation types

`FieldConfig.type` is one of: `text | number | decimal | date | email | textarea
| select | relation | badge`.

- **`relation`** — a foreign key. `relation.accessor` is the dot-path from a list
  row to the included object (e.g. `"client.personne"`), and `relation.labelField`
  the key(s) to display. For form options, `relation.model` + `relation.valueField`
  are queried, with optional `relation.optionInclude` / `relation.optionLabel`
  when the label lives on a nested relation.
- **`select`** — fixed `options` (e.g. order `statut`), rendered as a badge in lists.
- Composite keys use `idFields: [...]`; row ids are encoded as `a__b`.

## 5. Add a new resource in 3 steps

Suppose the schema gains a `fournisseur` (supplier) table.

**Step 1 — write the config** (`src/lib/resources/fournisseur.ts`):

```ts
import type { ResourceConfig } from "./types";

export const fournisseur: ResourceConfig = {
  key: "fournisseurs",
  model: "fournisseur",         // the Prisma model name
  idField: "id_fournisseur",
  labelSingular: "Fournisseur",
  labelPlural: "Fournisseurs",
  icon: "🏭",
  group: "Production",
  fields: [
    { name: "id_fournisseur", label: "ID", type: "number", inList: true },
    { name: "nom", label: "Nom", type: "text", inList: true, inForm: true, required: true },
    { name: "telephone", label: "Téléphone", type: "text", inList: true, inForm: true },
  ],
  searchFields: ["nom"],
};
```

**Step 2 — register it** in `src/lib/resources/index.ts`:

```ts
import { fournisseur } from "./fournisseur";
const REGISTRY = [ /* … */ fournisseur ];
```

**Step 3 — done.** The sidebar link, list, search, create, edit and delete
screens all exist at `/dashboard/fournisseurs`. No new components or routes.

To restrict it to admins, add `adminOnly: true`. For a foreign key, add a field
of `type: "relation"` (see `produit.ts` or `salaire.ts` for examples).

## 6. Design system

Tokens are defined in `src/app/globals.css` (`@theme`) and used as Tailwind
utilities (`bg-grain`, `text-roast`, `bg-wheat`, `border-line`, …):

| Token      | Value     | Use                     |
| ---------- | --------- | ----------------------- |
| `grain`    | `#F4EFE3` | app background          |
| `surface`  | `#FFFDF8` | cards / panels          |
| `roast`    | `#2A2320` | primary text            |
| `wheat`    | `#B8860B` | primary accent          |
| `olive` / `amber` / `clay` | — | success / warning / danger |
| `line`     | `#E3DAC9` | borders                 |

## 7. Testing & verification

- **Unit tests:** `npm run test` (Vitest) — cover `resolveRole` and the value
  coercion/formatting helpers.
- **Build:** `npm run build` type-checks the whole app and compiles every route.
- **Runtime:** with the DB seeded, log in as `admin@gmb.local`, then list / create
  / edit / delete on any resource, and confirm a CLIENT is redirected away from
  `/dashboard`.

## 8. Notes & known limitations

- `personne` passwords are **not** editable through the generic admin form (a raw
  password field would store plaintext) — they are set at signup/seed and hashed.
- Deleting a record referenced by others (FK `NoAction`) surfaces the database
  error in the UI rather than cascading.
- Out of scope (by design): file uploads, PDF invoice/voucher generation, email,
  password reset, server-side pagination, i18n, storefront visual redesign.

## 9. The operations cycle & guided workflows

The dashboard nav follows the mill cycle, grouped as
**Approvisionnement → Production → Stock → Ventes → RH → Système**, plus an
**Opérations** section at the top linking the two guided workflows.

```
Approvisionnement   fournisseur → achat (+ligne_achat) → [Réception] → facture_achat
        │                                                     │ increments
        ▼                                                     ▼
   matiere_premiere (wheat in silos) ───────────────► [Fabrication] ──┐
                                                        consumes       │ produces
                                                                       ▼
                                                        produit (finished, in stock)
                                                                       │
                                                                       ▼
                                              commande → facture (vente) → livraison
```

Most tables use the generic CRUD framework (§4). The **two steps with real
business logic** are dedicated pages backed by transactional Server Actions in
`src/lib/actions/cycle.ts`:

### A. Réception d'un achat — `/dashboard/reception`
Lists purchases not yet received. "Réceptionner" runs `receptionAchat(idAchat)`:
in one `prisma.$transaction` it **increments `matiere_premiere.quantite`** for each
line, sets the achat to `Reçu`, and creates a **`facture_achat`** for the line
total. Idempotent — refuses an already-received purchase.

### B. Lancer une fabrication — `/dashboard/production`
A multi-row form (raw-material inputs + finished-product outputs). `createFabrication(input)`
validates that enough raw material is in stock, then in one transaction records the
run, **decrements `matiere_premiere`** for each input and **increments
`produit.quantite_stock`** for each output, and reports the **rendement** (yield %
= output ÷ input). Both actions are ADMIN-guarded.

### C. Traitement d'une commande — `/dashboard/ventes`
Closes the sales leg. `validerCommande(idCommande)` checks finished-product stock,
then in one transaction **decrements `produit.quantite_stock`**, sets the order
`Validée`, and issues the **sales invoice** (`facture`). `livrerCommande(idCommande)`
(only after validation) creates a **`livraison` + `bon_livraison`** and sets the
order `Livrée`. Both are ADMIN-guarded. Actions live in `src/lib/actions/sales.ts`.

Clients see their own orders (real data) at `/mes-commande`.

### Finance
The overview shows total **ventes** (Σ `facture.montant`) vs total **achats**
(Σ `facture_achat.montant`) and the resulting **marge brute**.

### Shared cycle math
Pure, unit-tested helpers in `src/lib/cycle-calc.ts` (`lignesTotal`, `rendement`,
`sumQuantite`) are reused by all three workflows and the overview.

> These two pages live at static segments (`/dashboard/reception`,
> `/dashboard/production`) that intentionally do **not** collide with the generic
> `/dashboard/[resource]` routes.
