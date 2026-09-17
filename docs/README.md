# Wedding Planner – Documentation

This folder is the **source of truth**. Work only from these documents. Every addition or change is logged.

## How we work

1. Read [PRD.md](PRD.md) for product rules.
2. Read [SDD.md](SDD.md) for system design.
3. Add new phase documents in this folder.
4. Record the change in [CHANGELOG.md](CHANGELOG.md) and [log.md](log.md).
5. Record lasting technical choices in [DECISIONS.md](DECISIONS.md).

SQL migrations live in `/schema`. Do not put work logs there.

## Documents

| Document | Phase | Purpose |
| --- | --- | --- |
| [PRD.md](PRD.md) | 1 locked | Product requirements (Sections 17–20 added in 2.1) |
| [SDD.md](SDD.md) | 2 locked | System design |
| [PHASE-2.1.md](PHASE-2.1.md) | 2.1 complete | Blocking documentation revision |
| [DATABASE.md](DATABASE.md) | 3 locked | Physical data design |
| [MIGRATIONS.md](MIGRATIONS.md) | 3.2 complete | Automated schema migrations |
| [INFRASTRUCTURE.md](INFRASTRUCTURE.md) | 3.1 complete | Live Supabase project connection |
| [API.md](API.md) | 3 complete | Supabase table/RPC contracts |
| [CHANGELOG.md](CHANGELOG.md) | ongoing | Version history |
| [DECISIONS.md](DECISIONS.md) | ongoing | Architecture decisions |
| [log.md](log.md) | ongoing | Chronological work log (only log) |
| [Plan.md](Plan.md) | archive pointer | Original Phase 1 draft; canonical PRD is PRD.md |

SQL: [../schema/README.md](../schema/README.md)

## Current status

**Phase 1 Status: LOCKED**

**Phase 2 Status: LOCKED**

**Phase 3 Status: DATABASE READY FOR IMPLEMENTATION**

**Phase 3.2 Status: AUTOMATED DATABASE MIGRATION READY**

**READY FOR PHASE 4 — REACT FOUNDATION**
