# Forth Architecture Consulting & Construction Ltd

A complete professional website for "Forth Architecture Consulting & Construction Ltd" — a full-stack architecture firm site with an admin dashboard, all public pages, Clerk authentication, PostgreSQL database, and Replit Object Storage for image uploads.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/forth-architecture run dev` — run the React frontend (port 25455)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/scripts run seed` — seed the database with initial data
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19, Vite, Tailwind v4, shadcn/ui, framer-motion, wouter, Playfair Display + Inter fonts
- API: Express 5, pino structured logging
- DB: PostgreSQL + Drizzle ORM
- Auth: Clerk (whitelabel, with proxy middleware on `/api/__clerk`)
- Storage: Replit Object Storage (via `@workspace/object-storage-web`)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/db/src/schema/` — all Drizzle schema tables (projects, gallery, team, services, social-links, company, contact)
- `lib/api-spec/` — OpenAPI spec (source of truth for API contracts)
- `lib/api-client-react/src/generated/api.ts` — generated React Query hooks
- `lib/api-zod/src/generated/api.ts` — generated Zod validators
- `lib/object-storage-web/` — Uppy-based object storage client
- `artifacts/api-server/src/routes/` — all Express route handlers
- `artifacts/api-server/src/middlewares/clerkProxyMiddleware.ts` — Clerk auth proxy
- `artifacts/forth-architecture/src/pages/` — all public pages + admin dashboard
- `artifacts/forth-architecture/src/components/` — Navbar, Footer, HeroSection, FadeIn, etc.

## Architecture decisions

- Contract-first: OpenAPI spec → codegen → both client hooks and Zod validators. All server routes validate against generated schemas.
- Clerk whitelabel proxy: `/api/__clerk` proxies Clerk authentication requests. Same code runs in dev and prod; env vars are empty in dev.
- Company info uses an upsert pattern: GET creates a default record if none exists.
- DB schema uses `drizzle-zod` to derive Zod schemas, keeping validation in sync with the DB.
- Object Storage images use Replit-managed GCS buckets. Uppy on the client, presigned URLs from `/api/storage/sign` on the server.

## Product

**Public pages:** Home (hero + stats + featured projects + services + contact CTA), About (company story + mission/vision/values + team preview), Services (full service grid + process steps), Portfolio (filterable project grid + pagination), Project Detail, Gallery (filterable photo grid + lightbox), Team, Contact (form + info)

**Admin dashboard** (sign-in required): Stats overview, Messages inbox, Projects/Gallery/Team/Services CRUD, Social Links management, Company Info editor.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Always run `pnpm --filter @workspace/api-spec run codegen` after changing the OpenAPI spec, before editing routes or frontend code.
- Tailwind v4: `@layer theme, base, clerk, components, utilities;` must come before `@import "tailwindcss"`. Google Font `@import url(...)` must be the absolute first line.
- Clerk `publishableKeyFromHost` is imported from `@clerk/react/internal`, not `@clerk/react`.
- The `sortOrder` field in DB tables controls display order.
- DB seed script: `pnpm --filter @workspace/scripts run seed` — safe to run multiple times (skips if data exists).

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- See `.local/skills/clerk-auth/references/setup-and-customization.md` for Clerk wiring
- See `.local/skills/object-storage/SKILL.md` for object storage setup
