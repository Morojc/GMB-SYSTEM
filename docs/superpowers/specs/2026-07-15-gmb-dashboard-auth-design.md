# GMB (Grande Minoterie) — Management System: Dashboard, Auth & Structure

**Date:** 2026-07-15
**Status:** Approved design → ready for implementation planning
**Stack:** Next.js 16 (App Router), React 19, Prisma 6 + PostgreSQL, Tailwind CSS v4, `bcryptjs`, `jsonwebtoken`.

> ⚠️ Per `AGENTS.md`, this Next.js has breaking changes vs. training data. Before writing any
> route handler, Server Action, middleware, or `params`/`cookies` usage, consult the installed
> Next 16 docs/release notes (`node_modules/next/dist/docs/` was empty on the dev machine — use
> the Next 16 documentation for App Router APIs, async `params`/`cookies`, and Server Actions).

---

## 1. Purpose & Goals

Turn the current half-built app into a working management system for a flour-mill / food
distribution business, with:

1. A **role-based, unified authentication** system (fix the broken login, remove the duplicate
   client-auth system, add the missing secret).
2. A **complete admin dashboard** with **full CRUD** over **every** entity in the Prisma schema,
   built on a small config-driven resource framework rather than ~20 hand-written screens.
3. A coherent **industrial / minimal, wheat-toned design system**.
4. **Project-structure cleanup** and **documentation**.

Delivered in **three verifiable phases** (see §9).

## 2. Current State & Problems (baseline)

Findings from review of the existing code:

| # | Problem | Location |
|---|---------|----------|
| P1 | `bcrypt.compare(password, password)` — compares password to itself; login **always fails**. | `src/app/api/auth/login/route.ts` |
| P2 | Two parallel auth systems / two cookies (`token` vs `client_token`); middleware only checks `token`; no role separation. | `api/auth/login`, `api/client/login`, `middleware.ts` |
| P3 | `JWT_SECRET` missing from `.env` (only `DATABASE_URL` present) → `jwt.sign/verify` throw. | `.env`, `lib/jwt.ts`, `middleware.ts` |
| P4 | All dashboard pages reference **non-existent fields** (`client.idPersonne`, `client.type`, `commande.idCommande`/`date`/`validation`, `emp.post`/`presence`, `produit.idProduit`/`type`). Real schema is snake_case with relations. Pages will not run. | `src/app/dashboard/**` |
| P5 | Sidebar links to `/dashboard/produit` (singular); actual route is `/dashboard/produits`. | `components/sidebar.tsx` |
| P6 | Orphan duplicate `src/confirmation/page.tsx` outside the App Router tree. | `src/confirmation/` |
| P7 | No way to obtain a staff/admin account; signup only creates `client`. No seeded roles/data. | — |

## 3. Data Model (authoritative — from `prisma/schema.prisma`)

Key facts the implementation must respect (fields are **snake_case**, no `@map`):

- `personne` — identity + `email @unique`, optional `password`. 1:1 optional `client` / `employe`.
- `client` — `id_personne @unique`, has many `commande`.
- `employe` — `id_personne`, `id_role → role_employe`, `date_embauche`, has many `salaire`.
- `role_employe` — `nom_role`, `tache`.
- `commande` — `date_commande`, `statut` (string, e.g. "En attente"), `id_client`; has `ligne_commande[]`, `facture[]`, `bon_commande[]`.
- `ligne_commande` — `id_commande`, `id_produit`, `quantite`, `prix_unitaire`.
- `produit` — `nom`, `prix`, `quantite_stock`, `id_type → type_produit`; `catalogue_produit[]`, `stock[]`.
- `type_produit`, `catalogue`, `catalogue_produit` (composite PK `[id_catalogue,id_produit]`).
- `stock` — `id_produit`, `id_zone → zone_stock`, `quantite`. `zone_stock` — `nom`, `capacite`.
- `silon` — `nom`, `capacite`; `matiere_premiere[]`. `matiere_premiere` — `nom`, `quantite`, `id_silon`.
- `livraison` — `date_livraison`, `statut`, `id_facture`, `id_livreur`; `bon_livraison[]`. `livreur` — `nom`, `telephone`.
- `facture` — `date_facture`, `montant`, `id_commande`; `livraison[]`.
- `bon_commande` (→`commande`), `bon_livraison` (→`livraison`), `salaire` (→`employe`).

**Full entity list for admin CRUD (20):** personne, client, employe, role_employe, salaire,
commande, ligne_commande, facture, bon_commande, produit, type_produit, catalogue,
catalogue_produit, stock, zone_stock, silon, matiere_premiere, livraison, livreur, bon_livraison.

No schema changes are required for this build. (If a change becomes necessary it will be raised
before running `prisma migrate`.)

## 4. Authentication & Authorization

**Roles:** `ADMIN | EMPLOYE | CLIENT`.
- A `personne` with an `employe` record is staff. `ADMIN` is derived when the employee's
  `role_employe.nom_role` matches an admin role (config constant, e.g. `"Admin"`/`"Administrateur"`).
- A `personne` with a `client` record is `CLIENT`.

**Single system:**
- `POST /api/auth/login` — verifies `bcrypt.compare(password, personne.password)` (fixes P1),
  issues one JWT in the **`token`** cookie (httpOnly, `sameSite: lax`, 7-day). JWT payload:
  `{ idPersonne, email, role }`.
- `POST /api/auth/logout` — clears the cookie.
- Remove `/api/client/login` and the `client_token` cookie (P2). Rework `/api/client/me` (and the
  navbar's cart auth check) to read the unified `token`. Client **signup** (`/api/client/inscription`
  + `/client/inscription` page) stays as the self-registration path and afterwards logs the user in
  (or redirects to login).
- `lib/jwt.ts` — extend `JwtPayload` with `role`; keep helpers. Add a small
  `lib/auth.ts` server helper: `getCurrentUser()` (read+verify cookie) and `requireRole(roles)`.

**Middleware (`middleware.ts`):**
- `/dashboard/*` → require `role ∈ {ADMIN, EMPLOYE}`; a CLIENT is redirected to `/produits`,
  an anonymous user to `/login`.
- `/panier`, `/commande`, `/confirmation`, `/mes-commande` → require any authenticated user.
- Uses the single `token` cookie; verifies with `JWT_SECRET`.
- Note: keep JWT verification middleware-compatible (Edit-runtime safe). If `jsonwebtoken` proves
  incompatible with the middleware runtime under Next 16, fall back to `jose` for verify — decide
  during implementation after checking the docs.

**Secrets:** add `JWT_SECRET` (and keep `DATABASE_URL`) to `.env` and document both in
`.env.example` (P3). Never commit real secrets.

**Fine-grained access (within dashboard):** HR screens (employe, salaire, role_employe) and the
personne table are **ADMIN-only**; other resources are open to any staff. Enforced in the resource
config (`adminOnly: true`) + checked in Server Actions and page guards, not just hidden in the UI.

## 5. Admin Dashboard — Config-Driven Resource Framework

### 5.1 Resource config
One file per entity in `src/lib/resources/<entity>.ts` exporting a typed `ResourceConfig`:

```
type FieldType = "text" | "number" | "decimal" | "date" | "email" | "textarea"
               | "select" | "relation" | "badge";

interface FieldConfig {
  name: string;              // prisma field, e.g. "date_commande"
  label: string;             // FR label, e.g. "Date de commande"
  type: FieldType;
  required?: boolean;
  inList?: boolean;          // show as a table column
  inForm?: boolean;          // show in create/edit form
  relation?: {               // for type "relation"
    model: string; valueField: string; labelField: string; // for the <select> options
  };
  options?: string[];        // for type "select" (e.g. statut values)
  format?: (v) => string;    // display formatting
}

interface ResourceConfig {
  key: string;               // url slug, e.g. "commandes"
  model: string;             // prisma model name, e.g. "commande"
  idField: string;           // pk, e.g. "id_commande"
  labelSingular: string; labelPlural: string;
  icon: string;
  group: "Commercial" | "Production" | "Inventaire" | "RH";
  adminOnly?: boolean;
  fields: FieldConfig[];
  listInclude?: object;      // prisma include for the list query (relations shown in table)
  searchFields?: string[];   // fields the list search box filters on
}
```

A central `resources/index.ts` registers all configs and exposes `getResource(key)`.

**Composite-key entities** (`catalogue_produit`) and pure join/lookup tables get simplified
configs (compound id handling in the generic actions). If a given entity's shape doesn't fit the
generic form cleanly, it may use a small bespoke page — the framework is the default, not a
straitjacket.

### 5.2 Generic UI components (`src/components/admin/`)
- `DataTable` — columns from `fields[inList]`, renders relations/badges/formatted values, row
  actions (Edit link, `DeleteButton`), empty state, client-side search box, zebra rows.
- `ResourceForm` — renders inputs from `fields[inForm]`; used for create and edit; relation fields
  render `<select>` populated from a passed options map; client component with `useActionState`.
- `DeleteButton` — client component calling the delete Server Action with a confirm dialog.
- `StatCard`, `PageHeader`, `Badge`.

### 5.3 Generic Server Actions (`src/lib/actions/crud.ts`)
`createRecord(resourceKey, formData)`, `updateRecord(resourceKey, id, formData)`,
`deleteRecord(resourceKey, id)`:
- Look up the config, coerce/validate fields by type (number/decimal/date parsing, required
  checks), enforce `adminOnly` via `requireRole`, run the matching `prisma[model]` operation, then
  `revalidatePath`. Return a typed `{ ok, error? }` result for `useActionState`.
- Prisma model access is dispatched by `config.model` (a small typed switch/map — no unsafe `any`
  indexing where avoidable).

### 5.4 Routes (App Router)
```
/dashboard                      → overview (KPIs + aggregates)
/dashboard/<key>                → list (DataTable)
/dashboard/<key>/new            → create (ResourceForm)
/dashboard/<key>/[id]/edit      → edit (ResourceForm)
```
Each page is a thin server component: read the config, run the Prisma query (with `listInclude`
and relation-option queries for forms), render the generic component. Legacy hand-written pages
(`dashboard/client`, `/commande`, `/employe`, `/produits`) are replaced by config-driven versions
at the new slugs; old routes removed to avoid the broken-field code in P4.

### 5.5 Overview page
Real data via Prisma `count`/`groupBy`/`aggregate`:
- KPI `StatCard`s: clients, employés, produits, commandes, chiffre d'affaires (sum `facture.montant`).
- "Commandes par statut" — simple horizontal bars (CSS/flex, no chart library).
- "Produits en rupture / stock faible" — list where `quantite_stock` below a threshold.
- "Capacité des silos" — `capacite` vs summed `matiere_premiere.quantite`.

## 6. Design System (industrial / minimal, wheat-toned)

- **Tokens in `globals.css`** (Tailwind v4 `@theme`): background `--grain` (warm cream ~`#F5F1E8`),
  surface `#FFFDF8`, text `--roast` (dark brown/charcoal ~`#2A2320`), primary accent
  `--wheat` (golden ~`#C79A3A`/`#B8860B`), status colors muted (olive success, amber warning,
  clay danger). Remove the default dark-mode auto scheme; commit to one high-contrast light theme.
  Flat surfaces, thin borders, minimal shadow, small radius. Provide a mono/condensed heading feel.
- **Sidebar** grouped by domain: **Commercial** (clients, commandes, factures, livraisons, livreurs,
  bons) · **Production** (produits, types, catalogues, silos, matières premières) · **Inventaire**
  (stock, zones) · **RH** (employés, rôles, salaires) · **Système** (personnes — admin). Active-link
  state; sourced from the resource registry so nav stays in sync with resources.
- **Topbar**: page title slot, current user + role, logout button.
- Rebuild `/login` to the new design and to actually redirect by role on success (fixes the
  `alert()` stub); restyle `/client/inscription`.
- Keep the storefront (`/`, `/produits`, `/panier`, etc.) functional; light re-skin to the new
  tokens where low-cost, but storefront polish is **out of scope** beyond making auth/cart work.

## 7. Seed & Sample Data (`prisma/seed.ts`)

- **Additive & idempotent** — uses `upsert`/existence checks; **never** deletes existing rows.
- Seeds: `role_employe` (incl. an Admin role), one **admin `personne`+`employe`** with known
  credentials (documented, e.g. `admin@gmb.local` / a documented dev password, bcrypt-hashed),
  `type_produit`, `zone_stock`, `silon`, a few `produit`, and a small set of sample
  `client`/`commande` so screens render with data.
- Wire `prisma db seed` in `package.json` (`"prisma": { "seed": "..." }`), using `tsx`/`ts-node`
  as the runner (add dev dep). Document how to run.

## 8. Project-Structure Cleanup

- Delete orphan `src/confirmation/page.tsx` (P6); keep `src/app/confirmation/page.tsx`.
- Fix sidebar links / unify slugs (P5) — resolved by the registry-driven nav.
- Consistent folder layout: `src/lib/{auth.ts,jwt.ts,prisma.ts,resources/,actions/}`,
  `src/components/admin/`, `src/components/store/` (move storefront components), `src/app/dashboard/`.
- `.env.example` added; `README.md` replaced (see §10).

## 9. Phases (each independently verifiable)

**Phase 1 — Foundation & Auth + Core CRUD**
- `.env`/`.env.example` + `JWT_SECRET`; fix P1/P2/P3; unified `lib/auth.ts`, middleware, login/logout,
  reworked `/api/client/me` + navbar; role redirects.
- Resource framework (config types, `DataTable`, `ResourceForm`, `DeleteButton`, generic actions).
- Configs + working end-to-end CRUD for **Core**: produit, type_produit, client, employe, commande,
  stock, zone_stock. Design tokens + sidebar + topbar shell. Seed script (roles, admin, core data).
- **Verify:** log in as seeded admin → list/create/edit/delete a produit and a commande end-to-end.

**Phase 2 — Remaining entities**
- Configs for the rest: personne, role_employe, salaire, ligne_commande, facture, bon_commande,
  catalogue, catalogue_produit, silon, matiere_premiere, livraison, livreur, bon_livraison.
- Composite-key + join-table handling; adminOnly enforcement on HR/personne.
- **Verify:** each new resource lists and supports create/edit/delete (spot-check the tricky ones:
  catalogue_produit composite key, salaire→employe relation).

**Phase 3 — Overview analytics, storefront wiring & docs**
- Overview KPIs/aggregates; ensure storefront auth+cart+order flow works against unified auth;
  final cleanup; full documentation (§10).
- **Verify:** overview shows real numbers; place an order as a client; docs reviewed.

Each phase uses TDD where it fits (auth helpers, field coercion/validation, role checks are unit-
testable; add a test runner — `vitest` — as a dev dep in Phase 1) and ends with the
`verification-before-completion` check.

## 10. Documentation Deliverable

`docs/` guide + rewritten `README.md` covering:
- Overview & domain glossary (FR terms → meaning).
- Setup: prerequisites, `.env` (`DATABASE_URL`, `JWT_SECRET`), `prisma migrate`/`db seed`,
  `npm run dev`. **Seeded admin credentials.**
- Architecture: App Router layout, auth/authorization flow (with a diagram), the resource
  framework, and a **"How to add a new resource in 3 steps"** recipe.
- Data model summary and the role/permission matrix.

## 11. Out of Scope (YAGNI)

- File uploads / images for products, PDF invoice/bon generation, email, password reset,
  pagination beyond client-side search, i18n (French only), storefront visual redesign beyond
  functional wiring, real-time updates, audit logging.

## 12. Risks / Open Items

- **Next 16 API specifics** (async `params`/`cookies`, Server Action signatures, middleware
  runtime + JWT lib compatibility) — verify against installed docs before coding each area.
- **`jsonwebtoken` in middleware** — may need `jose` for Edge/middleware verify.
- Generic Prisma model dispatch must stay type-safe enough to compile under `strict` TS.
- Composite-key and join/lookup tables may need small bespoke handling within the framework.
