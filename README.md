# GMB — Grande Minoterie Management System

A management system for a flour-mill / food-distribution business, built with
**Next.js 16** (App Router), **Prisma 6 + PostgreSQL**, **Tailwind CSS v4**,
JWT authentication and a config-driven admin dashboard.

It provides:

- A **role-based authentication** system (ADMIN / EMPLOYE / CLIENT) with a single JWT cookie.
- An **admin dashboard** with full **CRUD** over every entity in the database, generated
  from small per-entity config files (add a screen by adding one config).
- A **public storefront** (product catalog, cart, checkout) for clients.
- An **industrial / wheat-toned** design system.

> 📖 Architecture, the resource framework, the auth flow and the
> **"add a resource in 3 steps"** recipe live in [`docs/GUIDE.md`](docs/GUIDE.md).

---

## Prerequisites

- **Node.js** 20+
- **PostgreSQL** 13+ running locally (or a reachable connection string)

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment** — copy `.env.example` to `.env` and fill in:

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/gbm?schema=public"
   JWT_SECRET="a-long-random-secret-at-least-32-chars"
   ```

   > The `DATABASE_URL` must point at a database that exists and is reachable.
   > `JWT_SECRET` signs and verifies auth tokens — required, no default.

3. **Create the schema** (first run):

   ```bash
   npx prisma migrate dev --name init   # or: npx prisma db push
   ```

4. **Generate the Prisma client** (run again whenever `schema.prisma` changes):

   ```bash
   npx prisma generate
   ```

5. **Seed sample data + the admin account** (additive & idempotent — never deletes rows):

   ```bash
   npm run seed
   ```

6. **Run the dev server**

   ```bash
   npm run dev
   ```

   Open <http://localhost:3000>.

## Seeded accounts

The seed creates these logins (change them before any real deployment):

| Role     | Email               | Password      | Lands on     |
| -------- | ------------------- | ------------- | ------------ |
| ADMIN    | `admin@gmb.local`   | `Admin123!`   | `/dashboard` |
| EMPLOYE  | `meunier@gmb.local` | `Meunier123!` | `/dashboard` |
| CLIENT   | `sara.alaoui@example.com` | `Client123!` | `/produits`  |

Log in at **`/login`**. Clients can self-register at **`/client/inscription`**.

## Scripts

| Command          | Description                                   |
| ---------------- | --------------------------------------------- |
| `npm run dev`    | Start the dev server                          |
| `npm run build`  | Production build                              |
| `npm start`      | Run the production build                      |
| `npm run seed`   | Seed roles, admin account and sample data     |
| `npm run test`   | Run unit tests (Vitest)                        |
| `npm run lint`   | Lint                                          |

## Project layout (high level)

```
prisma/
  schema.prisma          # data model (French domain, snake_case)
  seed.ts                # additive seed
src/
  app/
    login/               # staff + client login
    client/              # client signup / login
    produits/            # public storefront
    panier/ commande/    # cart + checkout
    dashboard/           # admin — generic [resource] routes + overview
    api/auth/            # login / logout
  components/admin/       # DataTable, ResourceForm, Sidebar, Topbar, …
  lib/
    auth.ts jwt.ts roles.ts   # authentication
    resources/           # one config per entity + registry
    actions/crud.ts      # generic create/update/delete server actions
    format.ts loadOptions.ts
  proxy.ts               # route guard (Next 16 "proxy", formerly middleware)
docs/
  GUIDE.md               # architecture & how-to
  superpowers/           # design spec + implementation plan
```
