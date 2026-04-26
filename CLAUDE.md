# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Read These First

This repo is currently in the **planning/documentation phase** — no source code, no `package.json`, no `src/` exists yet. All knowledge lives in [Docs/](Docs/):

- [Docs/Claude.md](Docs/Claude.md) — **canonical system prompt**: full tech stack, design tokens, complete database schema with RLS policies, file layout, build phases, coding conventions. Read this in full before writing code.
- [Docs/Architecture.md](Docs/Architecture.md) — Vercel + Supabase + Mapbox infra rationale and architecture diagram.
- [Docs/features.md](Docs/features.md) — feature catalog organized by user role.
- [Docs/task.md](Docs/task.md) — phase-by-phase task checklist; **work follows this order strictly** (Phase 1 → Phase 9).

When [Docs/Claude.md](Docs/Claude.md) and this file disagree, [Docs/Claude.md](Docs/Claude.md) wins — it is the single source of truth that all AI assistants on this project must follow.

## Stack (one-liner)

Next.js 14 App Router · TypeScript (strict, no `any`) · Tailwind · shadcn/ui · Supabase (Postgres + PostGIS + Auth + Realtime + Edge Functions) · Mapbox GL JS · Zustand · React Hook Form + Zod · pnpm · Vercel.

## Commands (once Phase 1 initializes the project)

```bash
pnpm install
pnpm dev              # Next.js dev server
pnpm build
pnpm lint
```

The package.json does not exist yet — these are the expected commands per [README.md](README.md). Do not invent additional scripts; follow whatever Phase 1 sets up.

## Non-obvious architectural rules (don't violate without checking docs)

1. **Multi-tenancy is enforced in the database, not the app.** Every table except `schools`/`user_roles` is scoped by `school_id`, and RLS policies in [Docs/Claude.md](Docs/Claude.md) §5 do the filtering using `get_user_role()` / `get_user_school_id()` helpers. Application code must not bypass RLS.
2. **Two Supabase clients, never mixed.** Use the **server client** (`src/lib/supabase/server.ts`) in Server Components, Server Actions, and API routes. Use the **browser client** (`src/lib/supabase/client.ts`) in Client Components only. Never import the service-role key in client-facing code — it bypasses RLS.
3. **Mapbox is client-only.** Wrap any `mapbox-gl` usage in a Client Component, lazy-load it with `next/dynamic` + `ssr: false`, and clean up the map instance in the `useEffect` return. Use `mapbox-gl` directly, not `react-map-gl`.
4. **Server Components by default.** Add `'use client'` only when you actually need interactivity, hooks, or browser APIs.
5. **Real-time bus tracking** flows: driver writes to `bus_locations` → Supabase Realtime → parent's subscribed map updates. The `idx_bus_locations_bus_id` index on `(bus_id, timestamp DESC)` exists specifically for this hot path.
6. **Route optimization** runs as a Supabase Edge Function (`supabase/functions/optimize-route/`) using K-Means clustering + Nearest-Neighbor TSP heuristic, fed by Mapbox Matrix API for real road-network distances. The Edge Function is the optimizer — not a Next.js API route.

## Roles (used everywhere — auth, RLS, redirects, UI)

`platform_admin` · `school_admin` · `driver` · `parent`. Post-login redirect is role-based. RLS policies differ per role per table; see [Docs/Claude.md](Docs/Claude.md) §5.

## Design system (must match)

Karwa / Qatar Metro Link aesthetic — deep blue (`#1E3A8A`) primary, white/slate backgrounds, Inter font, map-centric layouts. Mobile-first for driver and parent views; desktop-first for admin dashboards. Full color tokens in [Docs/Claude.md](Docs/Claude.md) §3.1 — use them, don't invent new ones.

## Conventions

- Absolute imports via `@/` alias → `src/`.
- PascalCase for components and component files (`StatsCard.tsx`); camelCase for utilities (`utils.ts`).
- One component per file, named exports.
- Use `cn()` from shadcn for conditional classes; customize shadcn components via Tailwind, never by editing the shadcn source.
- Always destructure `{ data, error }` from Supabase calls and handle `error`.

## What not to commit

`.env.local` (already in `.gitignore`). The four required env vars are listed in [README.md](README.md) and [Docs/Architecture.md](Docs/Architecture.md). `SUPABASE_SERVICE_ROLE_KEY` is server-side only.
