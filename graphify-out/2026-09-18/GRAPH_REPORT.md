# Graph Report - WeddingPlanner  (2026-09-18)

## Corpus Check
- 63 files · ~37,860 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 9, .css 1)

## Summary
- 466 nodes · 614 edges · 50 communities (26 shown, 24 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `409e29ab`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CHANGELOG
- migrate.py
- react
- PRD
- package.json
- LoginPage.tsx
- compilerOptions
- devDependencies
- @supabase/supabase-js
- compilerOptions
- dependencies
- 002_rls_policies.sql
- manifest.json
- 001_initial_schema.sql
- AppHomePage.tsx
- tsconfig.json
- auth.ts
- DATABASE
- public.profiles
- SDD
- DECISIONS
- log
- Wedding Planner
- public.outfits
- public.participants
- public.events
- public.invitations
- public.wedding_memberships
- public.sync_outfit_child_wedding
- AGENTS.md
- trg_events_confirm
- trg_urls_cap
- trg_images_activity
- trg_outfits_activity
- trg_profiles_last_sa
- trg_outfits_denorm
- trg_participants_wedding
- public.activity_logs
- public.events
- public.invitations
- public.outfit_images
- public.outfit_urls
- public.outfits
- public.participants

## God Nodes (most connected - your core abstractions)
1. `SDD` - 21 edges
2. `DATABASE` - 20 edges
3. `compilerOptions` - 19 edges
4. `PRD` - 19 edges
5. `log` - 18 edges
6. `DECISIONS` - 17 edges
7. `public.profiles` - 15 edges
8. `CHANGELOG` - 15 edges
9. `MIGRATIONS` - 14 edges
10. `README` - 14 edges

## Surprising Connections (you probably didn't know these)
- `Setup` --references--> `psql()`  [INFERRED]
  README.md → scripts/migrate.py
- `Added` --references--> `main()`  [INFERRED]
  CHANGELOG.md → scripts/migrate.py
- `Branch Workflow` --references--> `main()`  [INFERRED]
  README.md → scripts/migrate.py
- `DATABASE` --references--> `README`  [EXTRACTED]
  docs/DATABASE.md → schema/README.md
- `README` --references--> `log`  [EXTRACTED]
  schema/README.md → docs/log.md

## Import Cycles
- None detected.

## Communities (50 total, 24 thin omitted)

### Community 0 - "CHANGELOG"
Cohesion: 0.12
Nodes (21): CHANGELOG, Documentation version history, Phase 3.2 migration readiness, Phase 3 database readiness, Deployment prerequisites, Environment variables, INFRASTRUCTURE, Supabase Auth configuration (+13 more)

### Community 1 - "migrate.py"
Cohesion: 0.09
Nodes (28): Added, Added, Changed, Changed, Changelog, Security, [v0.3.4-repository-workflow] - 2026-09-18, [v0.4.0-react-foundation] - 2026-09-18 (+20 more)

### Community 2 - "react"
Cohesion: 0.06
Nodes (19): ref_app_app, ref_app_providers_authcontext, ref_components_ui_slot, ref_lib_supabase, react, ref_react_dom_client, ref_store_authstore, ref_styles_index_css (+11 more)

### Community 3 - "PRD"
Cohesion: 0.14
Nodes (17): Archive restore and permanent delete, Audit and activity, Invitation onboarding, PHASE-2.1, Progress calculation, Archive restore and permanent delete, Audit and activity, Event management (+9 more)

### Community 4 - "package.json"
Cohesion: 0.07
Nodes (31): name, private, scripts, build, dev, format, lint, typecheck (+23 more)

### Community 5 - "LoginPage.tsx"
Cohesion: 0.06
Nodes (23): ref_app_providers_authprovider, ref_components_ui_button, ref_components_ui_card, ref_components_ui_input, ref_components_ui_loader, ref_hookform_resolvers_zod, ref_hooks_useauth, ref_layouts_applayout (+15 more)

### Community 6 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, allowJs, allowSyntheticDefaultImports, composite, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx (+12 more)

### Community 7 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, autoprefixer, eslint, eslint-config-prettier, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals (+10 more)

### Community 8 - "@supabase/supabase-js"
Cohesion: 0.12
Nodes (12): @supabase/supabase-js, zustand, AuthContext, AuthContextValue, isSupabaseConfigured, supabase, AuthStore, useAuthStore (+4 more)

### Community 9 - "compilerOptions"
Cohesion: 0.13
Nodes (14): compilerOptions, allowJs, composite, isolatedModules, lib, module, moduleResolution, noEmit (+6 more)

### Community 10 - "dependencies"
Cohesion: 0.20
Nodes (10): dependencies, @hookform/resolvers, react, react-dom, react-hook-form, react-router-dom, @supabase/supabase-js, @vitejs/plugin-react (+2 more)

### Community 11 - "002_rls_policies.sql"
Cohesion: 0.07
Nodes (8): public.handle_new_user, public.profiles, public.wedding_memberships, public.weddings, on_auth_user_created, public.is_current_user_active(), public.is_super_admin(), public.wedding_role()

### Community 12 - "manifest.json"
Cohesion: 0.22
Nodes (8): background_color, description, display, icons, name, short_name, start_url, theme_color

### Community 13 - "001_initial_schema.sql"
Cohesion: 0.13
Nodes (16): public.enforce_outfit_image_cap, public.enforce_outfit_status_fields, public.log_event_activity, public.set_updated_audit, trg_events_activity, trg_events_updated, trg_images_cap, trg_images_updated (+8 more)

### Community 20 - "DATABASE"
Cohesion: 0.14
Nodes (17): API, Archive RPCs, Invitation RPCs, Private outfit storage, Progress views, Row Level Security, Supabase PostgREST API, Archive lifecycle (+9 more)

### Community 21 - "public.profiles"
Cohesion: 0.20
Nodes (12): auth.users, idx_activity_entity, idx_activity_wedding_created, idx_outfit_urls_outfit, idx_profiles_super_admin, idx_weddings_archived, public.activity_logs, public.enforce_outfit_url_cap() (+4 more)

### Community 22 - "SDD"
Cohesion: 0.17
Nodes (12): Wedding-scoped data isolation, User roles and permissions, Archive and audit alignment, GitHub Pages hosting, Image storage lifecycle, Module boundaries, Permission model, PWA readiness (+4 more)

### Community 23 - "DECISIONS"
Cohesion: 0.18
Nodes (11): Versioned migrations, DEC-001 React frontend, DEC-002 Supabase backend, DEC-003 GitHub Pages hosting, DEC-004 PWA readiness, DEC-005 Multi-wedding architecture, DEC-006 Archive and audit history, DEC-007 Wedding ID denormalization (+3 more)

### Community 24 - "log"
Cohesion: 0.18
Nodes (11): log, Phase 2.1 documentation revision, Phase 3.1 infrastructure work, Phase 3.2 migration work, Phase 3 database work, Event management, Outfit management, Plan (+3 more)

### Community 25 - "Wedding Planner"
Cohesion: 0.25
Nodes (7): Architecture, Commit Convention, Documentation, Folder Structure, Release Workflow, Roadmap, Wedding Planner

### Community 26 - "public.outfits"
Cohesion: 0.25
Nodes (8): idx_outfit_images_outfit, idx_outfits_owner, idx_outfits_participant, idx_outfits_wedding, public.enforce_outfit_image_cap(), public.outfit_images, public.outfits, public.sync_outfit_child_wedding()

### Community 27 - "public.participants"
Cohesion: 0.25
Nodes (8): idx_participants_event, idx_participants_wedding, public.enforce_event_confirm_rules(), public.participants, public.sync_outfit_denorm(), public.v_outfit_progress, public.v_participant_progress, uq_participants_event_user

### Community 28 - "public.events"
Cohesion: 0.33
Nodes (6): idx_events_wedding, public.events, public.sync_participant_wedding(), public.v_event_progress, public.v_wedding_progress, uq_events_active_name

### Community 29 - "public.invitations"
Cohesion: 0.40
Nodes (5): idx_invitations_email, idx_invitations_expires, idx_invitations_wedding, public.invitations, uq_invitations_pending_email

### Community 30 - "public.wedding_memberships"
Cohesion: 0.50
Nodes (4): idx_memberships_active, idx_memberships_user, idx_memberships_wedding, public.wedding_memberships

### Community 31 - "public.sync_outfit_child_wedding"
Cohesion: 0.67
Nodes (3): public.sync_outfit_child_wedding, trg_images_wedding, trg_urls_wedding

## Knowledge Gaps
- **171 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+166 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 276 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `@supabase/supabase-js`, `package.json`, `LoginPage.tsx`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Why does `react-router-dom` connect `LoginPage.tsx` to `package.json`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `Wedding Planner` connect `Wedding Planner` to `migrate.py`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _171 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CHANGELOG` be split into smaller, more focused modules?**
  _Cohesion score 0.12380952380952381 - nodes in this community are weakly interconnected._
- **Should `migrate.py` be split into smaller, more focused modules?**
  _Cohesion score 0.09195402298850575 - nodes in this community are weakly interconnected._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.06153846153846154 - nodes in this community are weakly interconnected._