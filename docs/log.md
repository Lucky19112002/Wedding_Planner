# Wedding Planner – Work Log

Newest entries first. Every document added or changed under `docs/` is recorded here.

---

## 2026-09-19 - Hotfix v1.0.1 Invitation Refresh and Invite URLs

- **Status:** Complete
- **Phase:** Hotfix v1.0.1
- **What changed:**
  - Refreshed pending invitations from Supabase immediately after invite creation.
  - Centralized app URL generation so invitation creation and resend use the configured Vite base path.
  - Fixed GitHub Pages invite links to resolve under `/Wedding_Planner/` without hardcoding the repository name.
  - Added URL regression coverage for GitHub Pages and root-base deployments.
  - Did not modify PRD, SDD, DATABASE, MIGRATIONS, schema, RLS, or business rules.
- **Follow from:** [CHANGELOG.md](../CHANGELOG.md)
- **Next:** Merge hotfix after production verification.

---

## 2026-09-19 - Phase 7.1 Production Data Seed

- **Status:** Complete
- **Phase:** 7.1 - Production data reset and wedding seed
- **What changed:**
  - Added `schema/007_seed_production_wedding.sql`.
  - Removed previous application data and seeded the real `K&L Weds` wedding for 2026-12-05.
  - Created production Auth/Profile users for Lucky, Kareena, and Mom.
  - Created memberships: Lucky admin/Super Admin, Kareena member, Mom viewer.
  - Created five production events: Janda Nikla, Haldi, Mehndi, Nikah, and Post Wedding Shoot.
  - Created production participants only; no outfits, images, links, or invitations were seeded.
  - Verified exact counts, roles, idempotency, and `Pending: (none)` from the migration runner.
  - Did not modify PRD, SDD, DATABASE, MIGRATIONS, schema design, RLS, functions, views, storage, React UI, or business rules.
- **Follow from:** [CHANGELOG.md](../CHANGELOG.md)
- **Next:** Production use with real outfit planning data.

---

## 2026-09-19 - v1.0.0 Stable Production Release

- **Status:** Released
- **Tag:** `v1.0.0-stable`
- **Main commit:** `4810c77`
- **Production URL:** https://lucky19112002.github.io/Wedding_Planner/
- **What changed:**
  - Merged `dev` into `main` with preserved history.
  - Enabled GitHub Pages through GitHub Actions with HTTPS enforced and no custom domain.
  - Fixed the Pages workflow ordering so `pnpm` is available before `actions/setup-node` cache resolution.
  - Updated the `github-pages` environment deployment branch rule from `dev` to `main`.
  - Published the first stable production deployment.
  - Verified home, `/login`, protected `/app` redirect, manifest, JavaScript, and CSS assets in production.
- **Follow from:** [CHANGELOG.md](../CHANGELOG.md)
- **Next:** Production operations and future planning.

---

## 2026-09-18 - Phase 7 GitHub Pages CI/CD & Production Release

- **Status:** Complete
- **Phase:** 7 - GitHub Pages CI/CD and production release
- **What changed:**
  - Added GitHub Actions deployment from `main` to GitHub Pages.
  - Configured the Vite production base path for repository Pages deployments without hardcoded domains.
  - Added SPA refresh support by publishing `404.html` with the production artifact.
  - Documented Pages source, HTTPS, custom domain readiness, and stable release tag flow.
  - Verified lint, tests, build, and GitHub Pages production-base build.
  - Did not modify PRD, SDD, DATABASE, MIGRATIONS, SQL schema, or business rules.
- **Follow from:** [README.md](../README.md), [CHANGELOG.md](../CHANGELOG.md)
- **Next:** v1.0.0 production operation and future feature planning.

---

## 2026-09-18 – Phase 6 Performance, Dashboard & Production Polish

- **Status:** Complete
- **Phase:** 6 – Production polish and performance
- **What changed:**
  - Added dashboard summaries for today's tasks, pending invitations, and family member count while keeping progress percentages sourced from existing SQL progress views.
  - Added route-level lazy loading with React Suspense for public and protected pages.
  - Polished shopping links with copy action and delete confirmation.
  - Polished image management with delete confirmation and clearer multi-image upload/compression guidance.
  - Reduced the initial production JS from the RC warning state (~759 kB minified / ~215 kB gzip) to a split initial bundle (~318 kB minified / ~100 kB gzip) with page chunks.
  - Verified TypeScript, ESLint, Vitest, and production build.
  - Did not modify PRD, SDD, DATABASE, MIGRATIONS, SQL schema, or business rules.
- **Follow from:** [README.md](../README.md), [CHANGELOG.md](../CHANGELOG.md)
- **Next:** v1.0.0 stable release preparation.

---

## 2026-09-18 – Phase 5.7 Invitations & Permissions

- **Status:** Complete
- **Phase:** 5.7 – Invitations & Permission Management
- **What changed:**
  - Added protected `/app/users` user management with search, role filtering, active/deactivated filtering, profile cards, role updates, permission matrix display, and deactivation confirmation.
  - Added invite-user workflow with validation, active-member duplicate prevention, pending invitation list, resend, cancel, and generated invite links.
  - Added public `/invite/:token` response flow for authenticated acceptance/rejection and invalid, expired, accepted, rejected, and cancelled states.
  - Added `invitation.service.ts`, `permission.service.ts`, `invitationStore`, and `permissionStore` while keeping Supabase queries isolated.
  - Added reusable user-management components and permission matrix tests.
  - Used the existing Supabase invitation RPC workflow after migration `006` repaired token hashing.
  - Browser-tested user management, invite creation, duplicate prevention, resend, cancel, invite state handling, role updates, permission matrix, deactivation guard, and mobile layout.
  - Verified `npx pnpm@latest run lint`, `npx pnpm@latest run build`, and `npx pnpm@latest run test`.
  - Re-verified from the home PC on `dev`: Graphify code index, protected `/app/users` redirect, public `/invite/:token`, mobile invite layout, lint, tests, and production build.
  - Did not modify PRD, SDD, DATABASE, MIGRATIONS, locked baseline migrations, or business rules.
- **Follow from:** [README.md](../README.md), [CHANGELOG.md](../CHANGELOG.md)
- **Next:** Phase 5 final integration.

---

## 2026-09-18 – Phase 3.3.2 Baseline Migration Reconciliation

- **Status:** Complete
- **Phase:** 3.3.2 – Baseline Migration Reconciliation
- **What changed:**
  - Added [MIGRATION_RECONCILIATION.md](MIGRATION_RECONCILIATION.md) documenting production checksums, current locked source checksums, and the reconciliation rules for migrations `001` through `005`.
  - Updated `scripts/migrate.py` with a reconciled-baseline validator that accepts only the recorded live checksum plus the recorded locked source checksum.
  - Added and applied `schema/006_fix_pgcrypto_invitation.sql` to repair `hash_invite_token()` with `extensions.digest(convert_to(...), 'sha256')`.
  - Verified the runner reconciles `001` through `005`, applies `006`, and then reports `Pending: (none)`.
  - Verified live invitation create, accept, membership creation, accepted-token invalidation, and duplicate acceptance prevention.
  - Removed temporary QA invitation/user rows after verification.
  - Did not edit `schema_migrations`, recreate the database, alter baseline migration contents, change business rules, or manually alter schema objects.
- **Follow from:** [MIGRATION_RECONCILIATION.md](MIGRATION_RECONCILIATION.md), [CHANGELOG.md](../CHANGELOG.md)
- **Next:** Continue Phase 5.7 — Invitations & Permissions browser verification and release.

---

## 2026-09-18 – Phase 5.6 Progress Dashboard

- **Status:** Complete
- **Phase:** 5.6 – Progress Dashboard & Analytics
- **What changed:**
  - Replaced the `/app` home screen with a mobile-first progress dashboard.
  - Added dashboard service queries for `v_wedding_progress`, `v_event_progress`, and `v_participant_progress`, plus active events, participants, outfits, and profiles for display counts.
  - Added dashboard Zustand store with loading, refreshing, error, and dashboard state.
  - Added reusable dashboard UI components for the readiness ring, summary cards, event progress cards, participant insights, outfit analytics, upcoming timeline, quick actions, and skeleton loading.
  - Added metric helpers and Vitest coverage for readiness labels, progress clamping, upcoming day labels, and pending outfit status handling.
  - Did not modify schema, SQL migrations, locked product/system/database documentation, business rules, progress formulas, or permissions.
  - Browser-tested dashboard load, refresh, progress values against seeded QA data, event navigation, mobile layout, tablet layout, desktop layout, and clean console.
  - Archived the temporary Phase 5.6 QA events after verification.
  - Verified `npx pnpm@latest run lint`, `npx pnpm@latest run build`, and `npx pnpm@latest run test`.
- **Follow from:** [README.md](../README.md), [CHANGELOG.md](../CHANGELOG.md)
- **Next:** Phase 5.7 — Invitations & Permissions.

---

## 2026-09-18 – Phase 5.5 Images & Shopping Links

- **Status:** Complete
- **Phase:** 5.5 – Images & Shopping Links module
- **What changed:**
  - Added typed outfit image and shopping-link models, private Storage image service, shopping-link service, and independent Zustand stores.
  - Added signed URL generation and session caching for private `outfit-references` images.
  - Added browser-side image validation/compression, upload progress state, delete, reorder, and set-primary image controls.
  - Replaced Outfit Details image placeholders with a real gallery: hero image, thumbnail strip, full-screen preview, upload panel, empty state, and lazy-loaded images.
  - Added shopping link cards with provider detection, custom labels, domains, open/edit/delete actions, and URL validation.
  - Enforced five active images and five active links in the UI while preserving the existing database caps.
  - Added Vitest coverage for shopping URL validation and provider detection.
  - Did not modify schema, SQL migrations, locked product/system/database documentation, business rules, or permanent delete behavior.
  - Browser-tested signed image rendering, five-image cap rejection, reorder, set primary, delete, invalid URL rejection, add links, five-link cap rejection, edit, delete, open link, and clean console.
  - Verified `npx pnpm@latest run lint`, `npx pnpm@latest run build`, and `npx pnpm@latest run test`.
- **Follow from:** [README.md](../README.md), [CHANGELOG.md](../CHANGELOG.md)
- **Next:** Phase 5.6 — Progress Dashboard.

---

## 2026-09-18 – Phase 5.4 Outfit Management

- **Status:** Complete
- **Phase:** 5.4 – Outfit Management module
- **What changed:**
  - Added typed outfit models, outfit workflow helpers, outfit formatting helpers, Supabase outfit service, and outfit Zustand store.
  - Added protected outfit routes for participant-scoped create, outfit detail, and outfit edit screens.
  - Integrated participant-scoped outfit lists into Event Details with active outfit counts, empty states, and New Outfit links.
  - Added React Hook Form + Zod outfit form with dress type, colour, quantity minimum, status, and notes.
  - Added outfit detail page with hero image placeholder, outfit information, notes, status timeline, image gallery placeholder, shopping-link placeholder, and audit timestamps.
  - Added archive-only destructive flow using the existing `archive_outfit` RPC and confirmation modal.
  - Added Vitest coverage for outfit workflow transitions and progress exclusion.
  - Did not implement image upload, image gallery management, shopping-link editing, schema changes, SQL migrations, permanent delete, or progress widgets.
  - Browser-tested create, edit, archive, status changes, quantity validation, navigation, mobile layout, desktop layout, and clean console.
  - Verified `npx pnpm@latest run lint`, `npx pnpm@latest run build`, and `npx pnpm@latest run test`.
- **Follow from:** [README.md](../README.md), [CHANGELOG.md](../CHANGELOG.md)
- **Next:** Phase 5.5 — Images & Shopping Links.

---

## 2026-09-18 – Phase 5.3 Participant Management

- **Status:** Complete
- **Phase:** 5.3 – Participant Management module
- **What changed:**
  - Added typed participant models, participant validation helpers, Supabase participant service, and participant Zustand store.
  - Added participant UI components for avatar, role badge, cards, lists, empty state, add/edit dialog, remove dialog, and event detail integration.
  - Integrated Participants into Event Details with member search, add existing wedding member, edit event role, archive/remove participant, duplicate prevention, and live participant count refresh.
  - Preserved the existing locked schema and used the `archive_participant` RPC for removal; no permanent delete is exposed.
  - Kept event role as configurable text with role suggestions, not hardcoded enums.
  - Added Vitest and unit tests for duplicate detection and candidate search filtering.
  - Did not implement outfit management, standalone participant pages, schema changes, SQL migrations, or participant notes persistence because the locked schema has no participant notes column.
  - Browser-tested add, edit, remove, duplicate prevention, search, desktop layout, mobile layout, navigation, and clean console.
  - Verified `npx pnpm@latest run lint`, `npx pnpm@latest run build`, and `npx pnpm@latest run test`.
- **Follow from:** [README.md](../README.md), [CHANGELOG.md](../CHANGELOG.md)
- **Next:** Phase 5.4 — Outfit Management.

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
