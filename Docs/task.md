# RouteyAI — Task Tracker

Stack: Next.js 14 · TypeScript · Tailwind CSS · shadcn/ui · Supabase · Mapbox GL JS · Vercel
Mobile: Expo (React Native) · NativeWind · Mapbox RN · EAS

---

## Phase 1: Project Setup & Landing Page

- [ ] Initialize Next.js 14 project with TypeScript and pnpm
- [ ] Configure Tailwind CSS + shadcn/ui
- [ ] Set up absolute imports (`@/` → `src/`)
- [ ] Configure `.env.local` and `.env.example`
- [ ] Initialize Supabase project (get URL + keys)
- [ ] Set up Supabase browser and server clients (`src/lib/supabase/`)
- [ ] Configure Mapbox (`src/lib/mapbox/config.ts`)
- [ ] Build landing page: Hero, Features, Pricing, CTA, Footer
- [ ] Add responsive navbar: Logo, Features, Pricing, Login, Sign Up
- [ ] Deploy to Vercel and connect GitHub repo

## Phase 2: Authentication & Role System

- [ ] Enable Supabase Auth (email/password)
- [ ] Create `user_roles` table with RLS
- [ ] Build Login page (`/login`)
- [ ] Build Signup page (`/signup`) with role selection
- [ ] Implement auth middleware (`src/lib/supabase/middleware.ts`) for route protection
- [ ] Post-login redirect based on role (`platform_admin`, `school_admin`, `driver`, `parent`)
- [ ] Build auth hooks (`useAuth.ts`)

## Phase 3: Database Schema

- [ ] Enable PostGIS extension in Supabase
- [ ] Run migrations: `schools`, `user_roles`, `buses`, `students`, `routes`, `bus_locations`, `announcements`, `attendance`
- [ ] Write and apply all RLS policies per role
- [ ] Create indexes (`idx_bus_locations_bus_id`)
- [ ] Generate TypeScript types from Supabase schema (`src/types/database.ts`)
- [ ] Add seed data for development (`supabase/seed.sql`)

## Phase 4: Platform Admin Dashboard

- [ ] Dashboard shell: Sidebar + TopBar layout (`/admin`)
- [ ] Stats cards: total schools, total buses, total students
- [ ] Schools CRUD table (create, edit, delete schools)
- [ ] Assign School Admins to schools
- [ ] Platform-wide analytics charts

## Phase 5: School Admin Dashboard

- [ ] Sidebar nav: Overview, Buses, Students, Routes, Analytics
- [ ] Bus management table + Add/Edit modals
- [ ] Assign driver to bus
- [ ] Student management table + Add Student form with Mapbox geocoding
- [ ] Smart Placement: auto-assign new student to nearest cluster/bus
- [ ] Route visualization: color-coded routes on Mapbox with stop and school markers
- [ ] Push announcements: send to all drivers or specific bus
- [ ] Analytics panel: capacity, student counts, fleet stats
- [ ] Live fleet mini-map on overview page

## Phase 6: AI Route Optimization

- [ ] Supabase Edge Function: `supabase/functions/optimize-route/index.ts`
- [ ] Implement K-Means clustering on student coordinates
- [ ] Implement Nearest-Neighbor TSP heuristic for stop ordering
- [ ] Integrate Mapbox Matrix API for real road-network distances
- [ ] Capacity check: block assignment if bus > capacity limit
- [ ] Trigger recalculation on student add/remove
- [ ] Save optimized waypoints to `routes` table

## Phase 7: Expo App — Setup & Infrastructure

- [ ] Initialize Expo project in `mobile/` directory (TypeScript, bare or managed workflow)
- [ ] Configure NativeWind (Tailwind for React Native)
- [ ] Set up React Navigation (stack + tab navigators)
- [ ] Set up Supabase client for React Native (`@supabase/supabase-js` + `expo-secure-store` for session)
- [ ] Configure `@rnmapbox/maps` with Mapbox token
- [ ] Deep linking: configure app scheme so invite links (`/invite/[code]`) open in the app
- [ ] Build shared auth screens: Login (email/password → Supabase Auth)
- [ ] Role-based navigation guard: driver → driver stack, parent → parent stack
- [ ] Add migration `supabase/migrations/0005_push_tokens.sql` — add `push_token TEXT` column to `user_roles`
- [ ] On app launch: register `expo-notifications` device token and save to `user_roles.push_token`
- [ ] EAS project setup (`eas.json`, `app.json`, link to expo.dev)

## Phase 8: Expo — Driver Interface

- [ ] Driver home screen: assigned bus info + "Start Route" button
- [ ] Route map screen: full-screen `@rnmapbox/maps` map with optimized route polyline + stop markers
- [ ] Passenger manifest screen: ordered stop list with student names and boarded/absent status
- [ ] Attendance: tap student to mark Boarded / Absent (writes to `attendance` table via Supabase)
- [ ] "Start Route": begin GPS broadcasting with `expo-location` watchPositionAsync
- [ ] GPS broadcast: write lat/lng to `bus_locations` table on each location update
- [ ] "Stop Route": stop GPS broadcast, update bus status
- [ ] Compose and send announcement to parents on the bus (inserts into `announcements`)
- [ ] Receive announcements from School Admin (Supabase Realtime subscription)

## Phase 9: Expo — Parent Interface

- [ ] Parent home screen: child info card + bus ETA summary
- [ ] Full-screen map: `@rnmapbox/maps` with live bus marker + child's stop pin
- [ ] Live bus tracking: Supabase Realtime subscription to `bus_locations` for the child's bus
- [ ] ETA calculation: distance from bus to child's stop → estimated minutes
- [ ] Bottom sheet: child name, bus number, current ETA, boarded/absent status
- [ ] Announcements feed: display driver messages in real time (Realtime subscription to `announcements`)
- [ ] Attendance confirmation: show when child is marked boarded or absent

## Phase 10: Push Notifications

- [ ] Supabase Edge Function: `supabase/functions/send-notification/index.ts`
  - Calls Expo Push API (`https://exp.host/--/api/v2/push/send`)
  - Reads `push_token` from `user_roles` for target users
- [ ] Trigger: notify parent when driver marks their child as boarded or absent
- [ ] Trigger: notify driver when School Admin sends an announcement to their bus
- [ ] Trigger: notify parent when bus is N minutes from their child's stop (ETA alert)
- [ ] Handle Expo push receipts and token cleanup (remove invalid tokens)

## Phase 11: Web Polish & Production

- [ ] Dark mode support (web)
- [ ] `loading.tsx` and `error.tsx` for all route segments
- [ ] Toast notifications for all user actions (shadcn Sonner)
- [ ] Error boundaries and custom 404 page
- [ ] Lazy load Mapbox with `next/dynamic` and `ssr: false`
- [ ] SEO meta tags on all pages
- [ ] Performance audit (Lighthouse)
- [ ] Connect custom domain on Vercel

## Phase 12: App Store & Play Store Submission

- [ ] Configure EAS Build profiles (development, preview, production) in `eas.json`
- [ ] Add app icons and splash screen assets (`mobile/assets/`)
- [ ] iOS: configure bundle ID, signing certificates, provisioning profiles via EAS
- [ ] Android: configure `applicationId`, keystore via EAS
- [ ] Run `eas build --platform all --profile production`
- [ ] Internal testing: TestFlight (iOS) + internal track (Google Play)
- [ ] Write App Store listing copy, screenshots (iPhone + iPad), privacy policy URL
- [ ] Write Play Store listing copy, screenshots, content rating
- [ ] Submit to App Store review
- [ ] Submit to Google Play review
- [ ] Configure OTA updates via `eas update` for post-launch patches
