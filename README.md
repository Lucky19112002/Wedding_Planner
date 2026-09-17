# Wedding Planner

Mobile-first wedding planning application for Lucky & Kareena Wedding 2026, designed to grow into a reusable multi-wedding family planning system.

## Architecture

- **Frontend:** React planned for Phase 4, hosted as a static app on GitHub Pages.
- **Backend:** Supabase Auth, PostgreSQL, Row Level Security, and private Storage.
- **Database changes:** Versioned SQL migrations in `/schema`, applied only through `scripts/migrate.py`.
- **Documentation:** Locked product and system design live in `/docs`.

## Folder Structure

```text
docs/      Product, system, infrastructure, migration, and release docs
schema/    Numbered Supabase/PostgreSQL migrations
scripts/   Local automation, including the migration runner
```

## Setup

1. Install PostgreSQL client tools so `psql` is available.
2. Confirm `.env` contains the current `SUPABASE_DB_URL`.
3. Run migrations from the project root:

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

End every completed phase with:

```text
git add .
git commit -m "docs(phase-x.y): describe completed phase"
git push origin dev
git checkout main
git merge dev
git push origin main
git tag -a vX.Y.Z-name -m "Release vX.Y.Z-name"
git push origin vX.Y.Z-name
git checkout dev
```

Planned tags:

- `v0.3.3-live-backend`
- `v0.4.0-react-foundation`
- `v0.5.0-business-modules`

## Roadmap

- Phase 3.4: Private repository and release workflow
- Phase 4: React foundation
- Phase 5: Business modules

## Documentation

- [Product Requirements](docs/PRD.md)
- [System Design](docs/SDD.md)
- [Database Design](docs/DATABASE.md)
- [Infrastructure](docs/INFRASTRUCTURE.md)
- [Migrations](docs/MIGRATIONS.md)
- [Decision Log](docs/DECISIONS.md)
- [Work Log](docs/log.md)
