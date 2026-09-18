# Graph Report - WeddingPlanner  (2026-09-18)

## Corpus Check
- 107 files · ~47,159 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 9, .css 1)

## Summary
- 710 nodes · 1003 edges · 73 communities (46 shown, 27 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 24 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cc024596`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CHANGELOG
- migrate.py
- ui/index.ts
- PRD
- package.json
- ref_lib_supabase
- compilerOptions
- devDependencies
- zustand
- compilerOptions
- event.service.ts
- 002_rls_policies.sql
- manifest.json
- 001_initial_schema.sql
- react-router-dom
- tsconfig.json
- auth.ts
- DATABASE
- public.profiles
- SDD
- DECISIONS
- Plan
- log
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
- Implementation Plan: Phase 5.2 Event Management
- react
- AppLayout.tsx
- ref_components_ui_button
- participant.service.ts
- router.tsx
- domain.ts
- ref_types_domain
- Phase 5.2 Todo
- dependencies
- permissions.ts
- eslint.config.js
- scripts
- ArchiveDialog.tsx
- AppErrorBoundary.tsx
- eventWorkflow.ts
- EventEmptyState.tsx
- App.tsx
- participantValidation.test.ts
- EventParticipantsSection
- ParticipantList.tsx
- vite.config.ts
- tailwindcss

## God Nodes (most connected - your core abstractions)
1. `SDD` - 21 edges
2. `DATABASE` - 20 edges
3. `compilerOptions` - 19 edges
4. `PRD` - 19 edges
5. `log` - 18 edges
6. `react` - 17 edges
7. `DECISIONS` - 17 edges
8. `react-router-dom` - 15 edges
9. `public.profiles` - 15 edges
10. `CHANGELOG` - 15 edges

## Surprising Connections (you probably didn't know these)
- `Added` --references--> `main()`  [INFERRED]
  CHANGELOG.md → scripts/migrate.py
- `Setup` --references--> `psql()`  [INFERRED]
  README.md → scripts/migrate.py
- `Branch Workflow` --references--> `main()`  [INFERRED]
  README.md → scripts/migrate.py
- `Added` --references--> `archiveEvent()`  [INFERRED]
  CHANGELOG.md → src/services/event.service.ts
- `Added` --references--> `getEvents()`  [INFERRED]
  CHANGELOG.md → src/services/event.service.ts

## Import Cycles
- None detected.

## Communities (73 total, 27 thin omitted)

### Community 0 - "CHANGELOG"
Cohesion: 0.20
Nodes (11): CHANGELOG, Documentation version history, Phase 3.2 migration readiness, Phase 3 database readiness, Documentation governance, Project phase status, README, Locked baseline migrations (+3 more)

### Community 1 - "migrate.py"
Cohesion: 0.10
Nodes (28): CompletedProcess, hashlib, os, Path, pathlib, re, Architecture, Branch Workflow (+20 more)

### Community 2 - "ui/index.ts"
Cohesion: 0.07
Nodes (14): ref_components_ui_slot, ref_utils_cx, AvatarProps, ButtonProps, EmptyStateProps, ErrorStateProps, Input, InputProps (+6 more)

### Community 3 - "PRD"
Cohesion: 0.14
Nodes (17): Archive restore and permanent delete, Audit and activity, Invitation onboarding, PHASE-2.1, Progress calculation, Archive restore and permanent delete, Audit and activity, Event management (+9 more)

### Community 4 - "package.json"
Cohesion: 0.12
Nodes (15): name, private, type, version, autoprefixer, eslint, @hookform/resolvers, postcss (+7 more)

### Community 5 - "ref_lib_supabase"
Cohesion: 0.08
Nodes (15): ref_app_providers_authcontext, ref_lib_supabase, ref_services_auth_service, ref_store_authstore, ref_store_weddingstore, signOut(), listMemberships(), mapMembership() (+7 more)

### Community 6 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, allowJs, allowSyntheticDefaultImports, composite, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx (+12 more)

### Community 7 - "devDependencies"
Cohesion: 0.11
Nodes (19): devDependencies, autoprefixer, eslint, eslint-config-prettier, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals (+11 more)

### Community 8 - "zustand"
Cohesion: 0.07
Nodes (23): ref_services_event_service, ref_services_membership_service, ref_services_participant_service, ref_services_profile_service, ref_services_wedding_service, @supabase/supabase-js, zustand, AuthContext (+15 more)

### Community 9 - "compilerOptions"
Cohesion: 0.13
Nodes (14): compilerOptions, allowJs, composite, isolatedModules, lib, module, moduleResolution, noEmit (+6 more)

### Community 10 - "event.service.ts"
Cohesion: 0.11
Nodes (26): Added, Added, Added, Added, Changed, Changed, Changed, Changed (+18 more)

### Community 11 - "002_rls_policies.sql"
Cohesion: 0.07
Nodes (8): public.handle_new_user, public.profiles, public.wedding_memberships, public.weddings, on_auth_user_created, public.is_current_user_active(), public.is_super_admin(), public.wedding_role()

### Community 12 - "manifest.json"
Cohesion: 0.22
Nodes (8): background_color, description, display, icons, name, short_name, start_url, theme_color

### Community 13 - "001_initial_schema.sql"
Cohesion: 0.13
Nodes (16): public.enforce_outfit_image_cap, public.enforce_outfit_status_fields, public.log_event_activity, public.set_updated_audit, trg_events_activity, trg_events_updated, trg_images_cap, trg_images_updated (+8 more)

### Community 14 - "react-router-dom"
Cohesion: 0.15
Nodes (11): ref_components_events, ref_components_participants, ref_components_ui_errorstate, ref_components_ui_loader, ref_components_ui_select, ref_hooks_usepermission, react-router-dom, ref_store_eventstore (+3 more)

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

### Community 24 - "Plan"
Cohesion: 0.33
Nodes (6): Event management, Outfit management, Plan, Reference images and links, User roles and permissions, Wedding project

### Community 25 - "log"
Cohesion: 0.15
Nodes (15): Deployment prerequisites, Environment variables, INFRASTRUCTURE, Supabase Auth configuration, Supabase project setup, log, Phase 2.1 documentation revision, Phase 3.1 infrastructure work (+7 more)

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

### Community 50 - "Implementation Plan: Phase 5.2 Event Management"
Cohesion: 0.18
Nodes (10): Architecture Decisions, Implementation Plan: Phase 5.2 Event Management, Open Questions, Overview, Phase 1: Event Data Foundation, Phase 2: Events List And Create Flow, Phase 3: Details, Edit, And Archive, Phase 4: Polish, Docs, And Release (+2 more)

### Community 51 - "react"
Cohesion: 0.08
Nodes (21): ref_app_app, ref_components_ui_input, ref_components_ui_textarea, ref_hookform_resolvers_zod, react, ref_react_dom_client, react-hook-form, ref_styles_index_css (+13 more)

### Community 52 - "AppLayout.tsx"
Cohesion: 0.12
Nodes (10): ref_components_ui_avatar, ref_components_ui_badge, ref_components_ui_unauthorizedstate, ref_hooks_useauth, ref_hooks_useprofile, ref_hooks_useweddingcontext, ref_store_uistore, ref_utils_permissions (+2 more)

### Community 53 - "ref_components_ui_button"
Cohesion: 0.13
Nodes (11): ref_components_participants_addparticipantdialog, ref_components_participants_participantavatar, ref_components_participants_participantemptystate, ref_components_participants_participantlist, ref_components_participants_participantrolebadge, ref_components_participants_removeparticipantdialog, ref_components_ui_button, ref_components_ui_card (+3 more)

### Community 54 - "participant.service.ts"
Cohesion: 0.27
Nodes (13): addParticipant(), byId(), countOutfits(), getMembershipRoles(), getParticipantCandidates(), getParticipants(), getProfiles(), mapParticipant() (+5 more)

### Community 55 - "router.tsx"
Cohesion: 0.17
Nodes (11): ref_layouts_applayout, ref_layouts_publiclayout, ref_pages_apphomepage, ref_pages_events_eventcreatepage, ref_pages_events_eventdetailpage, ref_pages_events_eventeditpage, ref_pages_events_eventspage, ref_pages_loginpage (+3 more)

### Community 56 - "domain.ts"
Cohesion: 0.13
Nodes (14): Event, EventInput, EventStatus, Membership, Participant, ParticipantCandidate, ParticipantInput, ParticipantUpdateInput (+6 more)

### Community 57 - "ref_types_domain"
Cohesion: 0.10
Nodes (7): ref_components_events_eventcard, ref_components_events_eventstatusbadge, ref_types_domain, ref_utils_eventformat, ref_utils_eventworkflow, EventHeaderProps, badgeClass

### Community 58 - "Phase 5.2 Todo"
Cohesion: 0.33
Nodes (5): Phase 5.2 Todo, Task 1: Event Data Foundation, Task 2: Events Dashboard And Create Flow, Task 3: Details, Edit, And Archive, Task 4: Verification And Release

### Community 59 - "dependencies"
Cohesion: 0.20
Nodes (10): dependencies, @hookform/resolvers, react, react-dom, react-hook-form, react-router-dom, @supabase/supabase-js, @vitejs/plugin-react (+2 more)

### Community 60 - "permissions.ts"
Cohesion: 0.32
Nodes (6): can(), full, getPermissionLevel(), none, rolePermissions(), viewOnly

### Community 61 - "eslint.config.js"
Cohesion: 0.29
Nodes (6): eslint-config-prettier, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, typescript-eslint

### Community 62 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, dev, format, lint, test, typecheck

### Community 63 - "ArchiveDialog.tsx"
Cohesion: 0.29
Nodes (3): ref_components_ui_modal, ArchiveDialogProps, RemoveParticipantDialogProps

### Community 64 - "AppErrorBoundary.tsx"
Cohesion: 0.29
Nodes (3): AppErrorBoundary, AppErrorBoundaryProps, AppErrorBoundaryState

### Community 65 - "eventWorkflow.ts"
Cohesion: 0.29
Nodes (3): eventStatuses, eventStatusLabels, transitions

### Community 67 - "App.tsx"
Cohesion: 0.40
Nodes (3): ref_app_providers_authprovider, ref_components_common_apperrorboundary, ref_routes_router

### Community 68 - "participantValidation.test.ts"
Cohesion: 0.40
Nodes (4): ref_utils_participantvalidation, vitest, candidates, participant

### Community 71 - "vite.config.ts"
Cohesion: 0.50
Nodes (3): ref_node_url, vite, @vitejs/plugin-react

## Knowledge Gaps
- **242 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+237 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 410 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **27 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `name`, `private`, `version` to the rest of the system?**
  _242 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `migrate.py` be split into smaller, more focused modules?**
  _Cohesion score 0.09852216748768473 - nodes in this community are weakly interconnected._
- **Should `ui/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06951871657754011 - nodes in this community are weakly interconnected._
- **Should `PRD` be split into smaller, more focused modules?**
  _Cohesion score 0.13970588235294118 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Should `ref_lib_supabase` be split into smaller, more focused modules?**
  _Cohesion score 0.07936507936507936 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._