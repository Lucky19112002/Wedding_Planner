# Wedding Planner

Mobile-first wedding planning application for Lucky & Kareena Wedding 2026, designed to grow into a reusable multi-wedding family planning system.

## Architecture

- **Frontend:** React, Vite, TypeScript, Tailwind CSS, React Router, Zustand, React Hook Form, and Zod.
- **Backend:** Supabase Auth, PostgreSQL, Row Level Security, and private Storage.
- **Database changes:** Versioned SQL migrations in `/schema`, applied only through `scripts/migrate.py`.
- **Documentation:** Locked product and system design live in `/docs`.

## Folder Structure

```text
docs/      Product, system, infrastructure, migration, and release docs
public/    PWA manifest, favicon, and icons
schema/    Numbered Supabase/PostgreSQL migrations
scripts/   Local automation, including the migration runner
src/       React application and business modules
```

## Setup

1. Install PostgreSQL client tools so `psql` is available.
2. Confirm `.env` contains the current `SUPABASE_DB_URL`.
3. Add the frontend Supabase values to `.env` before login testing:

```text
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

4. Install frontend dependencies and run checks:

```text
pnpm install
pnpm run build
pnpm run lint
pnpm run test
```

5. Run migrations from the project root when database changes are added:

```text
python scripts/migrate.py
```

This repository is private because `.env` is tracked for single-machine restore. Do not make the repository public while `.env` contains live credentials.

## Branch Workflow

- `main` is the stable release branch.
- `dev` is the active development branch.
- Do not develop directly on `main`.
- Each completed phase merges `dev` into `main`, then gets a version tag.

## Commit Convention

Use Conventional Commits:

```text
feat(phase-4): initialize react foundation
feat(events): implement event management
fix(auth): resolve session persistence
docs(phase-3.3): complete live database
```

## Release Workflow

Production releases merge `dev` into `main` without squashing so phase history remains visible. A push to `main` starts the GitHub Pages workflow, which installs dependencies, runs lint, runs tests, builds the Vite app, uploads the Pages artifact, and deploys the site.

GitHub Pages must use:

- **Source:** GitHub Actions
- **HTTPS:** enforced in repository Pages settings
- **SPA refresh:** handled by the workflow copying `dist/index.html` to `dist/404.html`
- **Custom domain:** add a `CNAME` file and set the domain in Pages settings when needed

Stable release tag:

- `v1.0.0-stable`

## Roadmap

- Phase 4: React foundation — complete
- Phase 5.1: User, wedding, and membership module — complete
- Phase 5.2: Event management — complete
- Phase 5.3: Participant management — complete
- Phase 5.4: Outfit management — complete
- Phase 5.5: Images and shopping links — complete
- Phase 5.6: Progress dashboard — complete
- Phase 5.7: Invitations and permissions — complete
- Phase 6: Performance, dashboard, and production polish — complete

## Current App Surface

- Supabase Auth login/logout with persisted sessions.
- Protected `/app` shell with mobile sidebar, header, wedding switcher, profile block, and logout action.
- Read-only profile loading from `profiles`.
- Wedding and membership loading from `weddings` and `wedding_memberships`.
- Active wedding auto-selection and local restore after refresh.
- Role-derived permission utilities for Phase 5 modules.
- Event dashboard with upcoming/all events, search, status filter, empty state, and responsive New Event actions.
- Event create/edit/detail/archive flows connected to Supabase.
- Event status workflow helpers and archive-only destructive action.
- Participant management inside event details with member search, add/edit/remove, duplicate prevention, archive-only removal, responsive dialogs, and live outfit counts.
- Participant-scoped outfit lists inside Event Details with premium cards, empty states, and New Outfit actions.
- Outfit create/edit/detail/archive flows connected to Supabase.
- Outfit status workflow helpers, badges, timeline, archive-only destructive action, and Vitest coverage.
- Private Supabase Storage outfit gallery with signed URLs, upload compression, thumbnail strip, full-screen preview, primary image ordering, delete, and reorder controls.
- Shopping/reference link management with URL validation, provider detection, cards, copy/edit/delete/open actions, delete confirmation, and five-link cap handling.
- Production dashboard home screen using Supabase progress views for wedding readiness, event progress, participant insights, outfit analytics, upcoming timeline, today tasks, pending invitations, family summary, and quick actions.
- User management with invitation sending, pending invite actions, role-derived permission matrix, and deactivate guard.
- Public invite response page for authenticated accept/reject flows.
- Route-level code splitting with Suspense to keep the initial production bundle smaller.
- Vitest unit coverage for participant duplicate/search validation.

## Documentation

- [Product Requirements](docs/PRD.md)
- [System Design](docs/SDD.md)
- [Database Design](docs/DATABASE.md)
- [Infrastructure](docs/INFRASTRUCTURE.md)
- [Migrations](docs/MIGRATIONS.md)
- [Decision Log](docs/DECISIONS.md)
- [Work Log](docs/log.md)

