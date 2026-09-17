# Wedding Planner – Work Log

Newest entries first. Every document added or changed under `docs/` is recorded here.

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
