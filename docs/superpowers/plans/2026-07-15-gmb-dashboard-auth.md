# GMB Dashboard, Unified Auth & Structure — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the half-built GMB app into a working flour-mill management system: unified role-based auth, a config-driven admin dashboard with full CRUD over all 20 Prisma entities, an industrial/minimal design, structure cleanup, and documentation.

**Architecture:** Next.js 16 App Router. Auth = one JWT `token` cookie + middleware role guard. The dashboard is powered by a small **resource framework**: one typed config per entity drives generic `DataTable`/`ResourceForm`/`DeleteButton` components and generic `create/update/delete` Server Actions. Each route is a thin server component that reads a config and runs a Prisma query.

**Tech Stack:** Next.js 16.2, React 19, Prisma 6 + PostgreSQL, Tailwind v4, bcryptjs, jsonwebtoken (jose fallback for middleware), vitest, tsx (seed runner).

## Global Constraints

- **Next.js 16** — App Router; `cookies()` from `next/headers` is **async** (`await cookies()`); dynamic route `params` is a **Promise** (`await params`); Server Actions require `"use server"`. Verify each API against installed Next 16 docs before coding.
- **Prisma field names are snake_case, no `@map`** — use `id_personne`, `date_commande`, `statut`, etc. NEVER the camelCase names in the old (broken) pages.
- **No schema changes** without raising first. Seed is **additive/idempotent** — never deletes rows.
- **French UI copy.** Currency/labels in French.
- Never commit real secrets. `.env` is gitignored; provide `.env.example`.
- Roles: `ADMIN | EMPLOYE | CLIENT`. HR (employe, salaire, role_employe) + `personne` are ADMIN-only.

---

## File Structure

```
prisma/seed.ts                        # additive seed (roles, admin, sample data)
src/lib/prisma.ts                      # (exists) prisma singleton
src/lib/jwt.ts                         # (modify) add role to payload
src/lib/auth.ts                        # NEW getCurrentUser(), requireRole(), login helpers
src/lib/resources/types.ts            # NEW ResourceConfig / FieldConfig types
src/lib/resources/index.ts            # NEW registry: getResource(), allResources(), nav groups
src/lib/resources/<entity>.ts         # NEW one per entity (20)
src/lib/actions/crud.ts               # NEW generic createRecord/updateRecord/deleteRecord
src/lib/format.ts                      # NEW coercion + display helpers
src/components/admin/DataTable.tsx     # NEW
src/components/admin/ResourceForm.tsx  # NEW
src/components/admin/DeleteButton.tsx  # NEW
src/components/admin/StatCard.tsx      # NEW
src/components/admin/PageHeader.tsx    # NEW
src/components/admin/Sidebar.tsx       # NEW (replaces components/sidebar.tsx)
src/components/admin/Topbar.tsx        # NEW
src/app/dashboard/layout.tsx           # (modify) new shell + guard
src/app/dashboard/page.tsx             # (modify) overview
src/app/dashboard/[resource]/page.tsx        # NEW generic list
src/app/dashboard/[resource]/new/page.tsx    # NEW generic create
src/app/dashboard/[resource]/[id]/edit/page.tsx  # NEW generic edit
src/app/api/auth/login/route.ts        # (modify) fix bcrypt + role
src/app/api/auth/logout/route.ts       # NEW
src/app/api/client/me/route.ts         # (modify) unified token
src/middleware.ts                      # (modify) role-based
src/app/login/page.tsx                 # (modify) redesign + role redirect
src/app/globals.css                    # (modify) wheat design tokens
.env / .env.example                    # (modify/new) JWT_SECRET
README.md / docs/GUIDE.md              # (modify/new) documentation
```

Old hand-written `src/app/dashboard/{client,commande,employe,produits}/page.tsx` and `src/components/sidebar.tsx` are **deleted** (replaced by the generic routes). Orphan `src/confirmation/page.tsx` deleted.

---

## PHASE 0 — Environment

### Task 0: Install deps, tooling, secret, prisma client

**Files:** Modify `package.json`, `.env`; Create `.env.example`.

- [ ] **Step 1:** Ensure dependencies install and add tooling.

```bash
npm install
npm install -D vitest tsx
```

- [ ] **Step 2:** Add `JWT_SECRET` to `.env` (dev value) and create `.env.example`.

`.env` (append):
```
JWT_SECRET="dev-only-change-me-please-32-chars-min-0123456789"
```
`.env.example` (new):
```
DATABASE_URL="postgresql://user:password@localhost:5432/gbm?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
```

- [ ] **Step 3:** Add scripts + seed config + vitest to `package.json`.

Add to `"scripts"`: `"seed": "tsx prisma/seed.ts"`, `"test": "vitest run"`.
Add top-level: `"prisma": { "seed": "tsx prisma/seed.ts" }`.

- [ ] **Step 4:** Generate the Prisma client.

Run: `npx prisma generate`
Expected: "Generated Prisma Client".

- [ ] **Step 5:** Confirm the app compiles.

Run: `npx tsc --noEmit` (expect errors only from the known-broken old dashboard pages — those get deleted in Phase 1).

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json .env.example
git commit -m "chore: add vitest, tsx, seed script, JWT_SECRET example"
```

---

## PHASE 1 — Auth, Framework, Core CRUD

### Task 1: JWT payload with role + auth helpers

**Files:** Modify `src/lib/jwt.ts`; Create `src/lib/auth.ts`, `src/lib/auth.test.ts`.

**Interfaces:**
- Produces: `JwtPayload { idPersonne:number; email:string; role:Role }`; `Role = "ADMIN"|"EMPLOYE"|"CLIENT"`; `getCurrentUser(): Promise<JwtPayload|null>`; `requireRole(roles: Role[]): Promise<JwtPayload>` (throws `Response`-like or redirects); `resolveRole(personne): Role`.

- [ ] **Step 1: Write failing test** `src/lib/auth.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { resolveRole } from "./auth";

describe("resolveRole", () => {
  it("returns ADMIN for employe with admin role name", () => {
    expect(resolveRole({ employe: { role_employe: { nom_role: "Admin" } }, client: null })).toBe("ADMIN");
  });
  it("returns EMPLOYE for non-admin employe", () => {
    expect(resolveRole({ employe: { role_employe: { nom_role: "Meunier" } }, client: null })).toBe("EMPLOYE");
  });
  it("returns CLIENT when only client present", () => {
    expect(resolveRole({ employe: null, client: { id_client: 1 } })).toBe("CLIENT");
  });
});
```

- [ ] **Step 2:** Run `npx vitest run src/lib/auth.test.ts` → FAIL (module not found).

- [ ] **Step 3:** Implement. `src/lib/jwt.ts` — extend payload:

```ts
export type Role = "ADMIN" | "EMPLOYE" | "CLIENT";
export interface JwtPayload { idPersonne: number; email: string; role: Role; }
```
(keep `generateToken`/`verifyToken`.)

`src/lib/auth.ts`:
```ts
import { cookies } from "next/headers";
import { verifyToken, type JwtPayload, type Role } from "./jwt";

const ADMIN_ROLE_NAMES = ["Admin", "Administrateur"];

export function resolveRole(p: {
  employe?: { role_employe?: { nom_role?: string | null } | null } | null;
  client?: unknown | null;
}): Role {
  if (p.employe) {
    const name = p.employe.role_employe?.nom_role ?? "";
    return ADMIN_ROLE_NAMES.includes(name) ? "ADMIN" : "EMPLOYE";
  }
  if (p.client) return "CLIENT";
  return "CLIENT";
}

export async function getCurrentUser(): Promise<JwtPayload | null> {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;
  try { return verifyToken(token); } catch { return null; }
}
```
(`requireRole` added in Task 6 where it's first used by actions; define here now returning the user or throwing an Error the caller maps.)

Add to `auth.ts`:
```ts
export async function requireRole(roles: Role[]): Promise<JwtPayload> {
  const user = await getCurrentUser();
  if (!user || !roles.includes(user.role)) throw new Error("FORBIDDEN");
  return user;
}
```

- [ ] **Step 4:** Run `npx vitest run src/lib/auth.test.ts` → PASS.

- [ ] **Step 5: Commit** `git add src/lib/jwt.ts src/lib/auth.ts src/lib/auth.test.ts && git commit -m "feat(auth): role in JWT + auth helpers"`

### Task 2: Fix login route + logout

**Files:** Modify `src/app/api/auth/login/route.ts`; Create `src/app/api/auth/logout/route.ts`.

**Interfaces:** Consumes `resolveRole`, `generateToken`. Produces `token` cookie + JSON `{ user:{id,nom,prenom,email,role} }`.

- [ ] **Step 1:** Rewrite login route — the critical fixes are (a) `bcrypt.compare(password, personne.password)`, (b) include `employe.role_employe`, (c) `role` in token.

```ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/jwt";
import { resolveRole } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password)
      return NextResponse.json({ message: "Email et mot de passe obligatoires." }, { status: 400 });

    const personne = await prisma.personne.findUnique({
      where: { email },
      include: { client: true, employe: { include: { role_employe: true } } },
    });
    if (!personne || !personne.password)
      return NextResponse.json({ message: "Identifiants incorrects." }, { status: 401 });

    const ok = await bcrypt.compare(password, personne.password);
    if (!ok) return NextResponse.json({ message: "Identifiants incorrects." }, { status: 401 });

    const role = resolveRole(personne);
    const token = generateToken({ idPersonne: personne.id_personne, email, role });
    const res = NextResponse.json({
      message: "Connexion réussie.",
      user: { id: personne.id_personne, nom: personne.nom, prenom: personne.prenom, email, role },
    });
    res.cookies.set("token", token, {
      httpOnly: true, secure: process.env.NODE_ENV === "production",
      sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Erreur serveur." }, { status: 500 });
  }
}
```

- [ ] **Step 2:** Create logout route `src/app/api/auth/logout/route.ts`:

```ts
import { NextResponse } from "next/server";
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("token", "", { path: "/", maxAge: 0 });
  return res;
}
```

- [ ] **Step 3:** Verify compile `npx tsc --noEmit` (login/logout clean).

- [ ] **Step 4: Commit** `git commit -am "fix(auth): correct bcrypt compare, add role + logout"`

### Task 3: Middleware role guard

**Files:** Modify `src/middleware.ts`.

- [ ] **Step 1:** Rewrite to verify token + gate `/dashboard` by role. Because `jsonwebtoken` may not run in the middleware runtime, verify with `jose` (add dep) OR set `export const runtime = "nodejs"` if Next 16 supports Node middleware — **check docs; default to `jose`**.

```ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
const staffOnly = ["/dashboard"];
const authOnly = ["/panier", "/commande", "/confirmation", "/mes-commande"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;
  const isStaff = staffOnly.some((r) => pathname.startsWith(r));
  const isAuth = authOnly.some((r) => pathname.startsWith(r));
  if (!isStaff && !isAuth) return NextResponse.next();
  if (!token) return NextResponse.redirect(new URL("/login", req.url));
  try {
    const { payload } = await jwtVerify(token, secret);
    if (isStaff && payload.role !== "ADMIN" && payload.role !== "EMPLOYE")
      return NextResponse.redirect(new URL("/produits", req.url));
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
export const config = { matcher: ["/dashboard/:path*", "/panier/:path*", "/commande/:path*", "/confirmation/:path*", "/mes-commande/:path*"] };
```
Run `npm install jose`.

- [ ] **Step 2:** Ensure `generateToken` (jsonwebtoken) + `jwtVerify` (jose) agree on secret encoding — both use the raw `JWT_SECRET` string (HS256 default). Confirm jose default alg check accepts HS256 (pass `{ algorithms: ["HS256"] }` if needed).

- [ ] **Step 3: Commit** `git commit -am "feat(auth): role-based middleware with jose verify"`

### Task 4: Design tokens

**Files:** Modify `src/app/globals.css`, `src/app/layout.tsx`.

- [ ] **Step 1:** Replace `globals.css` `:root`/dark block with the wheat palette (single light theme), Tailwind v4 `@theme` tokens:

```css
@import "tailwindcss";

:root {
  --grain: #F4EFE3;      /* background */
  --surface: #FFFDF8;
  --roast: #2A2320;      /* text */
  --roast-soft: #6B5E52;
  --wheat: #B8860B;      /* primary accent */
  --wheat-soft: #E9D8A6;
  --olive: #4B7A3F;      /* success */
  --amber: #C9820A;      /* warning */
  --clay: #B23A2E;       /* danger */
  --line: #E3DAC9;       /* borders */
}
@theme inline {
  --color-grain: var(--grain);
  --color-surface: var(--surface);
  --color-roast: var(--roast);
  --color-roast-soft: var(--roast-soft);
  --color-wheat: var(--wheat);
  --color-wheat-soft: var(--wheat-soft);
  --color-olive: var(--olive);
  --color-amber: var(--amber);
  --color-clay: var(--clay);
  --color-line: var(--line);
}
body { background: var(--grain); color: var(--roast); font-family: ui-sans-serif, system-ui, Arial, sans-serif; }
```

- [ ] **Step 2:** `layout.tsx` metadata title → "GMB — Grande Minoterie". Keep `CartProvider`.

- [ ] **Step 3: Commit** `git commit -am "feat(design): wheat industrial design tokens"`

### Task 5: Resource framework types + format helpers

**Files:** Create `src/lib/resources/types.ts`, `src/lib/format.ts`, `src/lib/format.test.ts`.

**Interfaces:**
- Produces `FieldType`, `FieldConfig`, `ResourceConfig` (as in spec §5.1); `coerceValue(type, raw): unknown`; `formatValue(type, value): string`.

- [ ] **Step 1: Failing test** `src/lib/format.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { coerceValue, formatValue } from "./format";

describe("coerceValue", () => {
  it("parses number", () => expect(coerceValue("number", "42")).toBe(42));
  it("parses decimal", () => expect(coerceValue("decimal", "9.99")).toBe(9.99));
  it("empty → null", () => expect(coerceValue("number", "")).toBeNull());
  it("date → Date", () => expect(coerceValue("date", "2026-07-15") instanceof Date).toBe(true));
});
describe("formatValue", () => {
  it("null → dash", () => expect(formatValue("text", null)).toBe("—"));
  it("decimal → 2dp", () => expect(formatValue("decimal", 9.5)).toBe("9.50"));
});
```

- [ ] **Step 2:** Run `npx vitest run src/lib/format.test.ts` → FAIL.

- [ ] **Step 3:** Implement `src/lib/format.ts`:

```ts
import type { FieldType } from "./resources/types";

export function coerceValue(type: FieldType, raw: unknown): unknown {
  if (raw === "" || raw === undefined || raw === null) return null;
  switch (type) {
    case "number": return parseInt(String(raw), 10);
    case "decimal": return parseFloat(String(raw));
    case "date": return new Date(String(raw));
    case "relation": return parseInt(String(raw), 10);
    default: return String(raw);
  }
}
export function formatValue(type: FieldType, value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (type === "decimal") return Number(value).toFixed(2);
  if (type === "date") return new Date(String(value)).toLocaleDateString("fr-FR");
  return String(value);
}
```

And `src/lib/resources/types.ts` (the interfaces from spec §5.1 verbatim).

- [ ] **Step 4:** Run test → PASS.

- [ ] **Step 5: Commit** `git commit -m "feat(framework): resource types + value coercion/format"`

### Task 6: Generic CRUD Server Actions

**Files:** Create `src/lib/actions/crud.ts`.

**Interfaces:**
- Consumes `getResource`, `coerceValue`, `requireRole`. Produces `createRecord(resourceKey:string, formData:FormData)`, `updateRecord(resourceKey:string, id:string, formData:FormData)`, `deleteRecord(resourceKey:string, id:string)` → `Promise<{ok:boolean; error?:string}>`; each `revalidatePath` + `redirect` on success where appropriate.

- [ ] **Step 1:** Implement with `"use server"`. Build a typed prisma-model dispatch via `(prisma as Record<string, any>)[config.model]` guarded by the registry (model names are trusted, from config). Coerce each `inForm` field, enforce `adminOnly` with `requireRole(["ADMIN"])`, parse id by `idField` type, call `.create/.update/.delete`, then `revalidatePath("/dashboard/"+key)`.

```ts
"use server";
import { prisma } from "@/lib/prisma";
import { getResource } from "@/lib/resources";
import { coerceValue } from "@/lib/format";
import { requireRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";

function buildData(key: string, formData: FormData) {
  const cfg = getResource(key);
  const data: Record<string, unknown> = {};
  for (const f of cfg.fields) {
    if (!f.inForm) continue;
    const v = coerceValue(f.type, formData.get(f.name));
    if (v !== null || f.required) data[f.name] = v;
  }
  return { cfg, data };
}
async function guard(key: string) {
  const cfg = getResource(key);
  await requireRole(cfg.adminOnly ? ["ADMIN"] : ["ADMIN", "EMPLOYE"]);
  return cfg;
}
export async function createRecord(key: string, formData: FormData) {
  try {
    await guard(key);
    const { cfg, data } = buildData(key, formData);
    await (prisma as any)[cfg.model].create({ data });
    revalidatePath(`/dashboard/${key}`);
    return { ok: true };
  } catch (e) { return { ok: false, error: (e as Error).message }; }
}
export async function updateRecord(key: string, id: string, formData: FormData) {
  try {
    const cfg = await guard(key);
    const { data } = buildData(key, formData);
    const idVal = cfg.idField.startsWith("id") ? parseInt(id, 10) : id;
    await (prisma as any)[cfg.model].update({ where: { [cfg.idField]: idVal }, data });
    revalidatePath(`/dashboard/${key}`);
    return { ok: true };
  } catch (e) { return { ok: false, error: (e as Error).message }; }
}
export async function deleteRecord(key: string, id: string) {
  try {
    const cfg = await guard(key);
    const idVal = parseInt(id, 10);
    await (prisma as any)[cfg.model].delete({ where: { [cfg.idField]: idVal } });
    revalidatePath(`/dashboard/${key}`);
    return { ok: true };
  } catch (e) { return { ok: false, error: (e as Error).message }; }
}
```
(Composite-key entities handled in Phase 2 with a bespoke branch.)

- [ ] **Step 2:** `npx tsc --noEmit` clean for this file.

- [ ] **Step 3: Commit** `git commit -m "feat(framework): generic CRUD server actions"`

### Task 7: Registry + Core resource configs

**Files:** Create `src/lib/resources/index.ts` and configs for `produit`, `type_produit`, `client`, `employe`, `commande`, `stock`, `zone_stock`.

**Interfaces:** Produces `getResource(key):ResourceConfig` (throws on unknown), `allResources():ResourceConfig[]`, `navGroups():{group,items}[]`.

- [ ] **Step 1:** Write `type_produit.ts` (simplest) as the worked example:

```ts
import type { ResourceConfig } from "./types";
export const typeProduit: ResourceConfig = {
  key: "types-produit", model: "type_produit", idField: "id_type",
  labelSingular: "Type de produit", labelPlural: "Types de produit",
  icon: "🏷️", group: "Production",
  fields: [
    { name: "id_type", label: "ID", type: "number", inList: true, inForm: false },
    { name: "nom_type", label: "Nom du type", type: "text", inList: true, inForm: true, required: true },
  ],
  searchFields: ["nom_type"],
};
```

- [ ] **Step 2:** Write remaining Core configs following the same shape. Relation fields use `type:"relation"` with `relation:{model,valueField,labelField}` and `listInclude` for the table display. Example `produit.ts`:

```ts
export const produit: ResourceConfig = {
  key: "produits", model: "produit", idField: "id_produit",
  labelSingular: "Produit", labelPlural: "Produits", icon: "📦", group: "Production",
  fields: [
    { name: "id_produit", label: "ID", type: "number", inList: true, inForm: false },
    { name: "nom", label: "Nom", type: "text", inList: true, inForm: true, required: true },
    { name: "prix", label: "Prix", type: "decimal", inList: true, inForm: true },
    { name: "quantite_stock", label: "Stock", type: "number", inList: true, inForm: true },
    { name: "id_type", label: "Type", type: "relation", inForm: true,
      relation: { model: "type_produit", valueField: "id_type", labelField: "nom_type" } },
  ],
  listInclude: { type_produit: true },
  searchFields: ["nom"],
};
```
(commande: fields `id_commande`, `date_commande` date, `statut` select `["En attente","Validée","Livrée","Annulée"]`, `id_client` relation to client→personne; `listInclude:{client:{include:{personne:true}}}`. client/employe: relation to personne. stock: relations to produit + zone_stock.)

- [ ] **Step 3:** `index.ts` registry:

```ts
import type { ResourceConfig } from "./types";
import { produit } from "./produit";
/* ...import all... */
const REGISTRY: ResourceConfig[] = [produit, typeProduit, client, employe, commande, stock, zoneStock];
export function allResources() { return REGISTRY; }
export function getResource(key: string): ResourceConfig {
  const r = REGISTRY.find((x) => x.key === key);
  if (!r) throw new Error(`Unknown resource: ${key}`);
  return r;
}
const GROUP_ORDER = ["Commercial", "Production", "Inventaire", "RH", "Système"] as const;
export function navGroups() {
  return GROUP_ORDER.map((g) => ({ group: g, items: REGISTRY.filter((r) => r.group === g) })).filter((x) => x.items.length);
}
```

- [ ] **Step 4:** `npx tsc --noEmit` clean.

- [ ] **Step 5: Commit** `git commit -m "feat(framework): resource registry + core configs"`

### Task 8: Admin UI components

**Files:** Create `src/components/admin/{DataTable,ResourceForm,DeleteButton,StatCard,PageHeader,Sidebar,Topbar}.tsx`.

- [ ] **Step 1:** `PageHeader.tsx` (title + subtitle + optional action slot), `StatCard.tsx` (label, value, accent). Server components.

- [ ] **Step 2:** `DataTable.tsx` — props `{ cfg, rows }`; client component for search box; renders `fields[inList]` columns, resolves relation display via `listInclude` object on the row (e.g. `row.type_produit?.nom_type`), formats via `formatValue`, Edit link `/dashboard/{key}/{id}/edit`, `<DeleteButton>`. Uses wheat tokens (`bg-surface`, `border-line`, zebra `bg-grain`).

- [ ] **Step 3:** `ResourceForm.tsx` — client component, props `{ cfg, mode, initial?, relationOptions }`; renders `fields[inForm]` inputs by type (`text/number/decimal/date/email/textarea/select/relation`); relation/select render `<select>`; submits via `useActionState` bound to `createRecord`/`updateRecord`; shows returned `error`; on `ok` redirect handled by action or `router.push`.

- [ ] **Step 4:** `DeleteButton.tsx` — client, `confirm()` then calls `deleteRecord(key,id)` and refreshes.

- [ ] **Step 5:** `Sidebar.tsx` — reads `navGroups()`, renders grouped links, filters `adminOnly` items when `role !== "ADMIN"` (role passed as prop). `Topbar.tsx` — page title, user name+role, logout button (POST `/api/auth/logout` → `/login`).

- [ ] **Step 6:** `npx tsc --noEmit` clean; **manual smoke** deferred to Task 10.

- [ ] **Step 7: Commit** `git commit -m "feat(admin): datatable, form, sidebar, topbar components"`

### Task 9: Delete broken pages, wire generic routes + dashboard shell

**Files:** Delete `src/app/dashboard/{client,commande,employe,produits}/page.tsx`, `src/components/sidebar.tsx`, `src/confirmation/page.tsx`. Modify `src/app/dashboard/layout.tsx`. Create `src/app/dashboard/[resource]/page.tsx`, `/new/page.tsx`, `/[id]/edit/page.tsx`.

- [ ] **Step 1:** Delete the broken/orphan files (listed above).

- [ ] **Step 2:** `dashboard/layout.tsx` — guard with `getCurrentUser()`; if not staff → `redirect("/login")`; render `<Sidebar role>` + `<Topbar user>` + `<main>`.

- [ ] **Step 3:** `[resource]/page.tsx` (list): `const { resource } = await params; const cfg = getResource(resource);` run `prisma[cfg.model].findMany({ include: cfg.listInclude })`; render `<PageHeader>` + "Ajouter" link + `<DataTable cfg rows>`.

- [ ] **Step 4:** `[resource]/new/page.tsx` + `[resource]/[id]/edit/page.tsx`: load relation options for each relation field (`prisma[relation.model].findMany`), for edit load the record; render `<ResourceForm>`.

- [ ] **Step 5: Commit** `git commit -m "feat(dashboard): generic list/new/edit routes + shell; remove broken pages"`

### Task 10: Seed + end-to-end verification (Phase 1 gate)

**Files:** Create `prisma/seed.ts`.

- [ ] **Step 1:** Write additive seed: upsert `role_employe` (incl. "Admin"), `type_produit`, `zone_stock`, `silon`; upsert admin `personne` (email `admin@gmb.local`, bcrypt of documented dev password `Admin123!`) + `employe` linked to Admin role; a few `produit`; 2 `client` (personne+client); 1-2 `commande` with `ligne_commande`. All via `upsert`/find-guarded `create` — never `deleteMany`.

- [ ] **Step 2:** Run migration + seed against the DB (requires Postgres running).

```bash
npx prisma migrate dev --name init   # if no migrations yet; else db push
npm run seed
```
Expected: "Seed done".

- [ ] **Step 3:** `npm run dev`, then verify end-to-end (verification-before-completion):
  - `/login` as `admin@gmb.local` / `Admin123!` → redirected to `/dashboard`.
  - `/dashboard/produits` lists seeded products.
  - Create a product via `/dashboard/produits/new` → appears in list.
  - Edit it, then delete it → list updates.
  - Log out → `/dashboard` redirects to `/login`.
  - A CLIENT account hitting `/dashboard` → redirected to `/produits`.

- [ ] **Step 4:** `npx tsc --noEmit` and `npm run test` both green.

- [ ] **Step 5: Commit** `git commit -m "feat(seed): additive seed + Phase 1 verified end-to-end"`

---

## PHASE 2 — Remaining Entities (recipe-driven)

For **each** remaining entity — `personne`, `role_employe`, `salaire`, `ligne_commande`, `facture`, `bon_commande`, `catalogue`, `catalogue_produit`, `silon`, `matiere_premiere`, `livraison`, `livreur`, `bon_livraison` — the work is:

### Task 11–13: Add resource configs (batched by group)

**Files:** Create `src/lib/resources/<entity>.ts`; Modify `src/lib/resources/index.ts` (register).

- [ ] **Step 1 (per entity):** Write a `ResourceConfig` mirroring Task 7's shape — map every schema field to a `FieldConfig`, set `type` (fk → `relation` with `{model,valueField,labelField}`, `statut`/known enums → `select`, `montant`/`prix` → `decimal`, dates → `date`), choose `inList`/`inForm`, add `listInclude` for relations shown, set `group` (Commercial/Production/Inventaire/RH/Système), `adminOnly:true` for `personne`,`employe`,`salaire`,`role_employe`.
- [ ] **Step 2:** Register in `index.ts` REGISTRY.
- [ ] **Step 3:** Load `/dashboard/<key>` in the running app → list renders; create/edit/delete a row.
- [ ] **Step 4:** Commit per group: `git commit -m "feat(resources): <group> entities"`.

Batch as: **Task 11 Commercial** (facture, bon_commande, ligne_commande, livraison, livreur, bon_livraison), **Task 12 Production/Inventaire** (silon, matiere_premiere, catalogue), **Task 13 RH/Système** (personne, role_employe, salaire).

### Task 14: Composite-key + join tables (`catalogue_produit`)

**Files:** Modify `src/lib/actions/crud.ts`, `src/lib/resources/catalogue_produit.ts`, generic routes for composite id.

- [ ] **Step 1:** Add config with `idField` as an array marker (e.g. `idFields:["id_catalogue","id_produit"]`) — extend `ResourceConfig` with optional `idFields?: string[]`.
- [ ] **Step 2:** In `crud.ts` update/delete, when `idFields` present build the compound `where: { id_catalogue_id_produit: {...} }` (Prisma composite key syntax) — parse the encoded id (e.g. `"3-7"`).
- [ ] **Step 3:** Verify create/list/delete of a `catalogue_produit` row in-app.
- [ ] **Step 4:** Commit `git commit -m "feat(resources): composite-key catalogue_produit support"`.

### Task 15: adminOnly enforcement test

**Files:** Create `src/lib/actions/crud.test.ts` (unit test the `guard` role logic via a mockable seam) OR verify manually that an EMPLOYE session cannot open `/dashboard/personnes` (server guard redirects) and its actions throw.

- [ ] **Step 1:** Add page-level guard in `[resource]/page.tsx`: if `cfg.adminOnly` and `role !== "ADMIN"` → `redirect("/dashboard")`.
- [ ] **Step 2:** Manually verify with a seeded EMPLOYE (non-admin) account.
- [ ] **Step 3:** Commit `git commit -m "feat(auth): adminOnly resource guards"`.

---

## PHASE 3 — Overview, Storefront wiring, Docs

### Task 16: Overview page

**Files:** Modify `src/app/dashboard/page.tsx`; create `src/components/admin/StatBar.tsx`.

- [ ] **Step 1:** Prisma aggregates: `count` clients/employes/produits/commandes; `aggregate` sum `facture.montant` (CA); `groupBy` `commande.statut`; products where `quantite_stock` < 10; silo capacity vs summed `matiere_premiere.quantite`.
- [ ] **Step 2:** Render `StatCard`s + CSS-bar "commandes par statut" + low-stock list + silo capacity bars. No chart lib.
- [ ] **Step 3:** Verify numbers match seed data in-app.
- [ ] **Step 4:** Commit `git commit -m "feat(dashboard): overview KPIs + aggregates"`.

### Task 17: Storefront + login page wiring

**Files:** Modify `src/app/login/page.tsx`, `src/app/api/client/me/route.ts`, `src/components/navbar.tsx`.

- [ ] **Step 1:** `me/route.ts` reads unified `token` cookie (not `client_token`); returns `{authenticated, role}`.
- [ ] **Step 2:** `login/page.tsx` — redesign to wheat tokens; on success `router.push` by role (ADMIN/EMPLOYE→`/dashboard`, else `/produits`); replace `alert()`.
- [ ] **Step 3:** navbar cart auth check unchanged logic but hits unified `me`.
- [ ] **Step 4:** Verify: client signup → login → add to cart → place order (`/api/commande`) → confirmation.
- [ ] **Step 5:** Commit `git commit -m "feat(store): unified-auth login + cart wiring"`.

### Task 18: Documentation

**Files:** Modify `README.md`; create `docs/GUIDE.md`.

- [ ] **Step 1:** README: overview, prerequisites, `.env` (`DATABASE_URL`, `JWT_SECRET`), `prisma migrate`/`npm run seed`, `npm run dev`, **seeded admin credentials** (`admin@gmb.local` / `Admin123!`), scripts.
- [ ] **Step 2:** `docs/GUIDE.md`: domain glossary (FR→meaning), architecture (App Router map, auth flow diagram), the resource framework, **"How to add a resource in 3 steps"** recipe, role/permission matrix.
- [ ] **Step 3:** Final `npx tsc --noEmit` + `npm run test` + `npm run build` all green.
- [ ] **Step 4:** Commit `git commit -m "docs: README + architecture/usage guide"`.

---

## Self-Review

**Spec coverage:** §2 problems P1–P7 → Tasks 2,2,0,7-9,9,9,10. §4 auth → 1,2,3. §5 framework → 5,6,7,8,9. §6 design → 4,8. §7 seed → 10. §8 cleanup → 9. §9 phases → phase headers. §10 docs → 18. §11 out-of-scope respected. §12 risks flagged inline (Next APIs, jose, composite keys). All covered.

**Placeholder scan:** No TBD/TODO; per-entity configs give a full worked example (Task 7) + explicit field-mapping rules (Task 11–13) rather than repeating 20 near-identical blocks — the recipe is complete and mechanical.

**Type consistency:** `JwtPayload{idPersonne,email,role}`, `Role`, `ResourceConfig`/`FieldConfig`, `getResource/allResources/navGroups`, `createRecord/updateRecord/deleteRecord`, `coerceValue/formatValue` used consistently across tasks.
