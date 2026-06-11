---
name: Forth Architecture site
description: Full-stack architecture firm website — stack, schema, key decisions, and gotchas.
---

# Forth Architecture Consulting & Construction Ltd

## Stack
- Frontend: React 19 + Vite (artifact: `forth-architecture`, port 25455, preview path `/`)
- API: Express 5 (artifact: `api-server`, port 8080, base path `/api`)
- DB: PostgreSQL + Drizzle ORM (`lib/db`)
- Auth: Clerk whitelabel (`app_3EyybfG0wmc1rlDuKf68aA8O027`) — proxy at `/api/__clerk`
- Storage: Replit Object Storage
- Fonts: Playfair Display (headings) + Inter (body) via Google Fonts
- Colors: dark navy `#1a2744` (primary) + warm gold `#c9a84c` (secondary/accent)

## DB Schema Tables (lib/db/src/schema/)
projects, project_images, gallery, team_members, services, social_links, company_info, contact_messages

## Key Decisions
- Company info uses upsert pattern: GET creates default row if none exists (single-row table).
- Portfolio filter categories must match DB project categories: Commercial, Residential, Cultural, Institutional, General.
- Services icons stored by lucide-react component name (e.g. "Building2", "HardHat") — looked up by exact name in serviceIcons map. Use `serviceIcons[service.icon]` (NOT `.toLowerCase()`) for lookup.
- Seed script at `scripts/src/seed.ts` — safe to rerun (skips if records exist).
- Admin dashboard has full CRUD for all sections: Projects, Gallery, Team, Services, Social Links, Company Info, Messages.

**Why:** Upsert for company info avoids null checks everywhere. Direct icon name lookup avoids case mismatch with PascalCase lucide-react component names.

## Admin Dashboard Mutation Patterns
- Create: `useCreateProject().mutate({ ...fields })`
- Update: `useUpdateProject().mutate({ id, data: { ...fields } })`
- Delete: `useDeleteProject().mutate({ id })`
- Company (singleton): `useUpdateCompanyInfo().mutate({ data: { ...fields } })`
- Always use `useEffect` (not inline setState during render) to populate form from fetched data.

## CSS Gotcha
- Tailwind v4: layer declaration must come BEFORE `@import "tailwindcss"`.
- Google Font `@import url(...)` must be the absolute first line of index.css.

## Clerk Wiring
- `publishableKeyFromHost` from `@clerk/react/internal` (NOT `@clerk/react`).
- `proxyUrl = import.meta.env.VITE_CLERK_PROXY_URL` — empty in dev (intentional).

## Navbar Logo
- Logo uses "F" square box (navy bg, gold text), with "FORTH ARCHITECTURE" bold and "CONSULTING & CONSTRUCTION LTD" in small caps below.
- Transitions from gold-on-navy (transparent) to primary-on-white (scrolled).
