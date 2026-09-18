# Wedding Planner – Work Log

Newest entries first. Every document added or changed under `docs/` is recorded here.

---

## 2026-09-18 – Phase 5.2 Event Management

- **Status:** Complete
- **Phase:** 5.2 – Event Management module
- **What changed:**
  - Added typed event models, event status workflow helpers, event formatting helpers, Supabase event service, and event Zustand store.
  - Added protected event routes for dashboard, create, detail, and edit screens.
  - Added premium mobile-first event dashboard with upcoming/all sections, search, status filter, empty state, and responsive New Event actions.
  - Added React Hook Form + Zod event form with required name/date and end-time validation.
  - Added event detail page with hero header, information, venue, notes, timeline, audit timestamps, and placeholders for Participants and Outfits.
  - Added archive-only destructive flow using the existing `archive_event` RPC and confirmation modal.
  - Fixed Tailwind v4 CSS entrypoint so browser styling renders correctly.
  - Did not implement participant management, outfit management, invitations, progress widgets, permanent delete, schema, or migrations.
  - Browser-tested create, edit, archive, search, filter, mobile layout, desktop layout, and clean console.
  - Verified `npx pnpm@latest run lint` and `npx pnpm@latest run build`.
- **Follow from:** [README.md](../README.md), [CHANGELOG.md](../CHANGELOG.md)
- **Next:** Phase 5.3 — Participant Management.

---

## 2026-09-18 – Phase 5.1 User, wedding, and membership module

- **Status:** Complete
- **Phase:** 5.1 – First business module
- **What changed:**
  - Added typed profile, wedding, membership, auth, and permission utilities.
  - Added Supabase service modules for auth, `profiles`, `weddings`, and `wedding_memberships`.
  - Expanded auth and wedding stores to load profile, active memberships, accessible weddings, and persisted active wedding selection.
  - Replaced placeholder `/app` with a protected responsive shell: sidebar, top header, wedding switcher, profile block, and logout action.
  - Added reusable error, unauthorized, and error boundary states.
  - Did not implement events, participants, outfits, invitations, dashboard widgets, or progress widgets.
  - Verified `npx pnpm@latest run lint` and `npx pnpm@latest run build`.
- **Follow from:** [README.md](../README.md), [CHANGELOG.md](../CHANGELOG.md)
- **Next:** Phase 5.2 — Event Management.

---

## 2026-09-18 – Phase 4 React foundation

- **Status:** Complete
- **Phase:** 4 – Frontend foundation only
- **What changed:**
  - Added React, Vite, TypeScript, Tailwind CSS, React Router, Supabase JS, Zustand, React Hook Form, and Zod.
  - Added Supabase client, auth provider, session persistence, protected `/app` route, login route, logout handler, and loading state.
  - Added reusable UI primitives only; no wedding-specific modules.
  - Added PublicLayout and AppLayout placeholders.
  - Added empty auth, UI, and wedding stores.
  - Added PWA manifest, favicon, and icon asset; no service worker.
  - Verified `pnpm run build` and `pnpm run lint`.
- **Follow from:** [README.md](../README.md), [CHANGELOG.md](../CHANGELOG.md)
- **Next:** Phase 5 — Business Modules.

---

## 2026-09-18 – Phase 3.4 Git repository and release workflow

- **Status:** Complete
- **Phase:** 3.4 – Git repository, branch strategy, and release workflow
- **What changed:**
  - Confirmed Git repository and GitHub remote `Lucky19112002/Wedding_Planner`.
  - Confirmed repository visibility was changed from public to private before tracking `.env`.
  - Documented `main` as stable release branch and `dev` as active development branch.
  - Documented Conventional Commits and phase version tags.
  - Added MIT license, root README, and root CHANGELOG.
  - Tracked `.env` and Graphify outputs per operator restore preference.
- **Follow from:** [README.md](../README.md), [CHANGELOG.md](../CHANGELOG.md)
- **Next:** Phase 4 — React Foundation.

---

## 2026-09-18 – Phase 3.3 Live Supabase database execution

- **Status:** Complete
- **Phase:** 3.3 – Live database created from `/schema` via `scripts/migrate.py`
- **What changed:**
  - Refreshed Graphify project index before execution.
  - Configured local untracked `.env` with the Supabase Transaction Pooler database URL.
  - Applied migrations `001`–`005` in numeric order.
  - Fixed migration-only PostgreSQL naming collisions in `002_rls_policies.sql` and `004_seed_data.sql`, then re-ran the migration runner successfully.
  - Verified required tables, foreign keys, RLS policies, progress views, private `outfit-references` storage bucket, Lucky seed user, Lucky membership, and Lucky & Kareena Wedding 2026.
  - Re-ran `python scripts/migrate.py`; result: `Pending: (none)`.
- **Follow from:** [MIGRATIONS.md](MIGRATIONS.md), [DATABASE.md](DATABASE.md), [INFRASTRUCTURE.md](INFRASTRUCTURE.md)
- **Next:** Phase 4 — React Foundation.

---

## 2026-09-17 – Phase 3.2 Automated database migration system

- **Status:** Complete
- **Phase:** 3.2 – Migration runner (no React UI; `001`–`004` unchanged)
- **What changed:**
  - Added [MIGRATIONS.md](MIGRATIONS.md).
  - Added `scripts/migrate.py` and `schema/005_example.sql`.
  - Conceptually updated DATABASE.md, INFRASTRUCTURE.md, CHANGELOG.md, DECISIONS.md (DEC-009).
- **Follow from:** [MIGRATIONS.md](MIGRATIONS.md)
- **Next:** Phase 4 — React Foundation. Command: `python scripts/migrate.py`.

---

## 2026-09-17 – Phase 3.1 Supabase infrastructure and project connection

- **Status:** Complete (documentation only)
- **Phase:** 3.1 – Live Supabase connection guide
- **What changed:**
  - Added [INFRASTRUCTURE.md](INFRASTRUCTURE.md): project creation, Auth, storage bucket `outfit-references`, `.env` structure, architecture, verification, security, deployment prerequisites.
  - Did not redesign `/schema`. Did not write React UI or business logic.
- **Follow from:** [INFRASTRUCTURE.md](INFRASTRUCTURE.md), [DATABASE.md](DATABASE.md)
- **Next:** React foundation against the live project. Schema remains `001`–`004`.

---

## 2026-09-17 – Phase 3 Database Design and Supabase architecture

- **Status:** Complete
- **Phase:** 3 – Database (no React UI)
- **What changed:**
  - Wrote [DATABASE.md](DATABASE.md) and [API.md](API.md).
  - Added numbered SQL under `/schema` (`001`–`004`) plus `/schema/README.md` (no log duplicate there).
  - Recorded DEC-007 and DEC-008 in [DECISIONS.md](DECISIONS.md).
- **Follow from:** [DATABASE.md](DATABASE.md)
- **Next:** Implementation against this schema (Auth, RLS, seed Lucky). Phase 1–2 remain LOCKED.

---

## 2026-09-17 – Phase 2.1 Documentation Revision (blocking fixes)

- **Status:** Complete / locked with Phase 1 and Phase 2
- **Phase:** 2.1 – Documentation only
- **What changed:**
  - Added [PHASE-2.1.md](PHASE-2.1.md).
  - Extended [PRD.md](PRD.md) with Sections 17–20 (invitations, archive/restore/permanent delete, progress formulas, audit).
  - Extended [SDD.md](SDD.md) (progress clarification, invitation flow, DEC-006, Sections 15–18).
  - Updated [CHANGELOG.md](CHANGELOG.md) and [DECISIONS.md](DECISIONS.md) (DEC-006).
- **Follow from:** [PHASE-2.1.md](PHASE-2.1.md), [PRD.md](PRD.md)
- **Next:** Phase 3 — Database Design. Phase 1 LOCKED. Phase 2 LOCKED.

---

## 2026-09-17 – Phase 2 System Design Document

- **Status:** Complete
- **Phase:** 2 – System Design (documentation only)
- **What changed:**
  - Added [SDD.md](SDD.md) with all fourteen required sections and Mermaid diagrams.
  - Added [README.md](README.md), [CHANGELOG.md](CHANGELOG.md), [DECISIONS.md](DECISIONS.md).
  - Added placeholders [DATABASE.md](DATABASE.md) and [API.md](API.md).
  - Promoted Phase 1 content to [PRD.md](PRD.md).
- **Follow from:** [SDD.md](SDD.md)
- **Next:** Phase 3 — Database Design (no React, no tables created in the cloud until that phase says so).

---

## 2026-09-17 – Phase 1 Product Requirements Document

- **Status:** Complete
- **Phase:** 1 – Product Requirements (documentation only)
- **What changed:** PRD authored (canonical: [PRD.md](PRD.md); original draft: [Plan.md](Plan.md)).
- **Next:** Phase 2 SDD (now complete).
