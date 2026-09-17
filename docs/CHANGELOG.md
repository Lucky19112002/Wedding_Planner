# Changelog

Newest version first. Follow the template in [SDD.md](SDD.md) Section 13.

---

## [docs-3.2] – 2026-09-17

### Added

- [MIGRATIONS.md](MIGRATIONS.md) — automated migration architecture and runner contract.
- `scripts/migrate.py` — applies pending `/schema` files in order with history and checksums.
- `schema/005_example.sql` — forward-only example (no domain table changes).
- DEC-009 — versioned migrations are mandatory.

### Changed

- [DATABASE.md](DATABASE.md) and [INFRASTRUCTURE.md](INFRASTRUCTURE.md) — apply path is the runner, not Dashboard DDL.
- [schema/README.md](../schema/README.md) — points at the migrate command.

### Fixed

- None.

### Notes

- `001`–`004` were not modified.
- No React UI.
- Progress recorded only in [log.md](log.md).
- Phase 3.2 Status: AUTOMATED DATABASE MIGRATION READY. READY FOR PHASE 4 — REACT FOUNDATION.

---

## [docs-3.0] – 2026-09-17

### Added

- [DATABASE.md](DATABASE.md) — physical PostgreSQL / Supabase design (12 sections).
- [API.md](API.md) — PostgREST resources, progress views, invitation and archive RPCs.
- `/schema/001_initial_schema.sql` through `004_seed_data.sql` and `/schema/README.md`.
- DEC-007 (denormalized `wedding_id`, wedding-scoped reads).
- DEC-008 (progress views, not stored percentages).

### Changed

- Documentation index: Phase 3 database ready; SQL lives only under `/schema`.
- Work log remains only in [log.md](log.md).

### Fixed

- None.

### Notes

- No React UI.
- Seed Super Admin Lucky and Lucky & Kareena Wedding 2026.
- Phase 3 Status: DATABASE READY FOR IMPLEMENTATION

---

## [docs-2.1] – 2026-09-17

### Added

- [PHASE-2.1.md](PHASE-2.1.md) — Documentation Revision (blocking fixes).
- PRD Sections 17–20: invitations and onboarding; archive / restore / permanent delete; progress calculation; audit and activity.
- SDD Sections 15–18: invitation flow, archive alignment, audit alignment, Phase 2.1 checklist.
- DEC-006 — soft-delete and audit history are mandatory.

### Changed

- SDD Section 10 progress text now states Dropped is not scored, archived events are omitted, and Completed events contribute EventProgress (not an automatic 100%).
- SDD User Management and Authentication now describe the invitation lifecycle.
- README current status set to Phase 1 and Phase 2 locked.

### Fixed

- Blocking gaps: join path, destructive-data policy, single progress specification, change-history requirements.

### Notes

- Approved Phase 1 and Phase 2 requirements were not reversed.
- No SQL, schema, React, APIs, or UI.
- Phase 1 Status: LOCKED. Phase 2 Status: LOCKED. Ready for Phase 3 – Database Design.

---

## [docs-2.0] – 2026-09-17

### Added

- System Design Document ([SDD.md](SDD.md)) — Phase 2 complete.
- Documentation index ([README.md](README.md)).
- Decision log file ([DECISIONS.md](DECISIONS.md)).
- Work log ([log.md](log.md)).
- Placeholders [DATABASE.md](DATABASE.md) and [API.md](API.md) for later phases.
- Canonical Product Requirements Document copy ([PRD.md](PRD.md)).

### Changed

- Documentation source of truth is the `docs/` folder, not chat-only plans.

### Fixed

- None.

### Notes

- Phase 2 is documentation only: no React code, SQL, Supabase tables, or UI screen specs.
- Phase 2 Status: READY FOR PHASE 3 — DATABASE DESIGN

---

## [docs-1.0] – 2026-09-17

### Added

- Phase 1 Product Requirements Document (canonical file: [PRD.md](PRD.md); draft: [Plan.md](Plan.md)).

### Changed

- None.

### Fixed

- None.

### Notes

- Phase 1 is documentation only.
