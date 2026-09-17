# Graph Report - Wedding_Planner  (2026-09-17)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 108 nodes · 174 edges · 7 communities
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- CHANGELOG / Documentation version history
- CompletedProcess / hashlib
- API / Archive RPCs
- Archive restore and permanent delete / Audit and activity
- Wedding-scoped data isolation / User roles and permissions
- Versioned migrations / DEC-001 React frontend
- Event management / Outfit management

## God Nodes (most connected - your core abstractions)
1. `SDD` - 20 edges
2. `DATABASE` - 19 edges
3. `PRD` - 18 edges
4. `log` - 16 edges
5. `DECISIONS` - 16 edges
6. `CHANGELOG` - 15 edges
7. `README` - 14 edges
8. `MIGRATIONS` - 13 edges
9. `API` - 13 edges
10. `INFRASTRUCTURE` - 12 edges

## Surprising Connections (you probably didn't know these)
- `DATABASE` --references--> `README`  [EXTRACTED]
  docs/DATABASE.md → schema/README.md
- `Plan` --semantically_similar_to--> `PRD`  [INFERRED] [semantically similar]
  docs/Plan.md → docs/PRD.md
- `CHANGELOG` --references--> `README`  [EXTRACTED]
  docs/CHANGELOG.md → schema/README.md
- `INFRASTRUCTURE` --references--> `README`  [EXTRACTED]
  docs/INFRASTRUCTURE.md → schema/README.md
- `README` --references--> `log`  [EXTRACTED]
  schema/README.md → docs/log.md

## Import Cycles
- None detected.

## Communities (7 total, 0 thin omitted)

### Community 0 - "CHANGELOG / Documentation version history"
Cohesion: 0.11
Nodes (26): CHANGELOG, Documentation version history, Phase 3.2 migration readiness, Phase 3 database readiness, Deployment prerequisites, Environment variables, INFRASTRUCTURE, Supabase Auth configuration (+18 more)

### Community 1 - "CompletedProcess / hashlib"
Cohesion: 0.17
Nodes (18): CompletedProcess, hashlib, os, Path, pathlib, re, checksum(), db_url() (+10 more)

### Community 2 - "API / Archive RPCs"
Cohesion: 0.14
Nodes (17): API, Archive RPCs, Invitation RPCs, Private outfit storage, Progress views, Row Level Security, Supabase PostgREST API, Archive lifecycle (+9 more)

### Community 3 - "Archive restore and permanent delete / Audit and activity"
Cohesion: 0.14
Nodes (17): Archive restore and permanent delete, Audit and activity, Invitation onboarding, PHASE-2.1, Progress calculation, Archive restore and permanent delete, Audit and activity, Event management (+9 more)

### Community 4 - "Wedding-scoped data isolation / User roles and permissions"
Cohesion: 0.17
Nodes (12): Wedding-scoped data isolation, User roles and permissions, Archive and audit alignment, GitHub Pages hosting, Image storage lifecycle, Module boundaries, Permission model, PWA readiness (+4 more)

### Community 5 - "Versioned migrations / DEC-001 React frontend"
Cohesion: 0.18
Nodes (11): Versioned migrations, DEC-001 React frontend, DEC-002 Supabase backend, DEC-003 GitHub Pages hosting, DEC-004 PWA readiness, DEC-005 Multi-wedding architecture, DEC-006 Archive and audit history, DEC-007 Wedding ID denormalization (+3 more)

### Community 6 - "Event management / Outfit management"
Cohesion: 0.33
Nodes (6): Event management, Outfit management, Plan, Reference images and links, User roles and permissions, Wedding project

## Knowledge Gaps
- **46 isolated node(s):** `Documentation version history`, `Phase 3.2 migration readiness`, `Phase 3 database readiness`, `Deployment prerequisites`, `Environment variables` (+41 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 61 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `SDD` connect `Wedding-scoped data isolation / User roles and permissions` to `CHANGELOG / Documentation version history`, `API / Archive RPCs`, `Archive restore and permanent delete / Audit and activity`, `Versioned migrations / DEC-001 React frontend`, `Event management / Outfit management`?**
  _High betweenness centrality (0.170) - this node is a cross-community bridge._
- **Why does `DATABASE` connect `API / Archive RPCs` to `CHANGELOG / Documentation version history`, `Archive restore and permanent delete / Audit and activity`, `Wedding-scoped data isolation / User roles and permissions`, `Versioned migrations / DEC-001 React frontend`?**
  _High betweenness centrality (0.150) - this node is a cross-community bridge._
- **Why does `PRD` connect `Archive restore and permanent delete / Audit and activity` to `CHANGELOG / Documentation version history`, `API / Archive RPCs`, `Wedding-scoped data isolation / User roles and permissions`, `Versioned migrations / DEC-001 React frontend`, `Event management / Outfit management`?**
  _High betweenness centrality (0.148) - this node is a cross-community bridge._
- **What connects `Documentation version history`, `Phase 3.2 migration readiness`, `Phase 3 database readiness` to the rest of the system?**
  _46 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CHANGELOG / Documentation version history` be split into smaller, more focused modules?**
  _Cohesion score 0.1076923076923077 - nodes in this community are weakly interconnected._
- **Should `API / Archive RPCs` be split into smaller, more focused modules?**
  _Cohesion score 0.13970588235294118 - nodes in this community are weakly interconnected._
- **Should `Archive restore and permanent delete / Audit and activity` be split into smaller, more focused modules?**
  _Cohesion score 0.13970588235294118 - nodes in this community are weakly interconnected._