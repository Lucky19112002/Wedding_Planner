# Graph Report - WeddingPlanner  (2026-09-18)

## Corpus Check
- 140 files · ~54,974 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 9, .css 1)

## Summary
- 893 nodes · 1323 edges · 78 communities (55 shown, 23 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 35 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c37bf7e9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CHANGELOG
- migrate.py
- ref_utils_cx
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
- ref_components_ui_card
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
- EventForm.tsx
- ref_components_ui_loader
- outfits/index.ts
- participant.service.ts
- router.tsx
- domain.ts
- ParticipantCard.tsx
- Phase 5.2 Todo
- ref_types_domain
- permissions.ts
- Changelog
- outfitImage.service.ts
- ref_components_ui_button
- ref_components_ui_errorstate
- eventWorkflow.ts
- react-router-dom
- App.tsx
- outfit.service.ts
- react
- AppLayout.tsx
- events/index.ts
- outfitWorkflow.ts
- OutfitGallery.tsx
- ShoppingLinkCard.tsx
- OutfitForm.tsx
- shoppingLinks.ts
- ShoppingLinksPanel.tsx

## God Nodes (most connected - your core abstractions)
1. `react` - 25 edges
2. `react-router-dom` - 21 edges
3. `SDD` - 21 edges
4. `DATABASE` - 20 edges
5. `compilerOptions` - 19 edges
6. `PRD` - 19 edges
7. `log` - 18 edges
8. `DECISIONS` - 17 edges
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
- `Added` --references--> `archiveOutfit()`  [INFERRED]
  CHANGELOG.md → src/services/outfit.service.ts

## Import Cycles
- None detected.

## Communities (78 total, 23 thin omitted)

### Community 0 - "CHANGELOG"
Cohesion: 0.20
Nodes (11): CHANGELOG, Documentation version history, Phase 3.2 migration readiness, Phase 3 database readiness, Documentation governance, Project phase status, README, Locked baseline migrations (+3 more)

### Community 1 - "migrate.py"
Cohesion: 0.10
Nodes (28): CompletedProcess, hashlib, os, Path, pathlib, re, Architecture, Branch Workflow (+20 more)

### Community 2 - "ref_utils_cx"
Cohesion: 0.09
Nodes (12): ref_components_ui_slot, ref_utils_cx, AvatarProps, ButtonProps, EmptyStateProps, Input, InputProps, LoaderProps (+4 more)

### Community 3 - "PRD"
Cohesion: 0.14
Nodes (17): Archive restore and permanent delete, Audit and activity, Invitation onboarding, PHASE-2.1, Progress calculation, Archive restore and permanent delete, Audit and activity, Event management (+9 more)

### Community 4 - "package.json"
Cohesion: 0.05
Nodes (42): dependencies, @hookform/resolvers, react, react-dom, react-hook-form, react-router-dom, @supabase/supabase-js, @vitejs/plugin-react (+34 more)

### Community 5 - "ref_lib_supabase"
Cohesion: 0.07
Nodes (21): ref_app_providers_authcontext, ref_lib_supabase, ref_services_auth_service, ref_store_authstore, ref_store_weddingstore, signOut(), listMemberships(), mapMembership() (+13 more)

### Community 6 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, allowJs, allowSyntheticDefaultImports, composite, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx (+12 more)

### Community 7 - "devDependencies"
Cohesion: 0.11
Nodes (19): devDependencies, autoprefixer, eslint, eslint-config-prettier, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals (+11 more)

### Community 8 - "zustand"
Cohesion: 0.05
Nodes (35): ref_services_event_service, ref_services_membership_service, ref_services_outfit_service, ref_services_outfitimage_service, ref_services_participant_service, ref_services_profile_service, ref_services_shoppinglink_service, ref_services_wedding_service (+27 more)

### Community 9 - "compilerOptions"
Cohesion: 0.13
Nodes (14): compilerOptions, allowJs, composite, isolatedModules, lib, module, moduleResolution, noEmit (+6 more)

### Community 10 - "event.service.ts"
Cohesion: 0.26
Nodes (14): Added, Changed, [v0.5.2-event-management] - 2026-09-18, Verified, archiveEvent(), createEvent(), EventRow, getEvent() (+6 more)

### Community 11 - "002_rls_policies.sql"
Cohesion: 0.07
Nodes (8): public.handle_new_user, public.profiles, public.wedding_memberships, public.weddings, on_auth_user_created, public.is_current_user_active(), public.is_super_admin(), public.wedding_role()

### Community 12 - "manifest.json"
Cohesion: 0.22
Nodes (8): background_color, description, display, icons, name, short_name, start_url, theme_color

### Community 13 - "001_initial_schema.sql"
Cohesion: 0.13
Nodes (16): public.enforce_outfit_image_cap, public.enforce_outfit_status_fields, public.log_event_activity, public.set_updated_audit, trg_events_activity, trg_events_updated, trg_images_cap, trg_images_updated (+8 more)

### Community 14 - "ref_components_ui_card"
Cohesion: 0.15
Nodes (9): ref_components_events, ref_components_participants, ref_components_ui_card, ref_components_ui_select, ref_hooks_usepermission, ref_store_eventstore, EventCreatePage(), EventDetailPage() (+1 more)

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

### Community 51 - "EventForm.tsx"
Cohesion: 0.09
Nodes (19): ref_components_ui_input, ref_hookform_resolvers_zod, react-hook-form, zod, EventForm(), EventFormProps, eventFormSchema, EventFormValues (+11 more)

### Community 52 - "ref_components_ui_loader"
Cohesion: 0.29
Nodes (3): ref_components_ui_loader, ref_components_ui_unauthorizedstate, ref_hooks_useauth

### Community 53 - "outfits/index.ts"
Cohesion: 0.11
Nodes (6): ref_components_outfits_outfitcard, ref_components_outfits_outfitimageplaceholder, ref_components_outfits_outfitstatusbadge, ref_utils_outfitformat, ArchiveOutfitDialogProps, GalleryThumbnailProps

### Community 54 - "participant.service.ts"
Cohesion: 0.25
Nodes (16): Added, addParticipant(), archiveParticipant(), byId(), countOutfits(), getEventParticipantUserIds(), getMembershipRoles(), getParticipantCandidates() (+8 more)

### Community 55 - "router.tsx"
Cohesion: 0.13
Nodes (14): ref_layouts_applayout, ref_layouts_publiclayout, ref_pages_apphomepage, ref_pages_events_eventcreatepage, ref_pages_events_eventdetailpage, ref_pages_events_eventeditpage, ref_pages_events_eventspage, ref_pages_loginpage (+6 more)

### Community 56 - "domain.ts"
Cohesion: 0.10
Nodes (20): Event, EventInput, EventStatus, Membership, Outfit, OutfitImage, OutfitInput, OutfitStatus (+12 more)

### Community 57 - "ParticipantCard.tsx"
Cohesion: 0.18
Nodes (6): ref_components_events_eventstatusbadge, ref_components_participants_participantavatar, ref_components_participants_participantrolebadge, ref_utils_eventformat, EventHeaderProps, ParticipantCardProps

### Community 58 - "Phase 5.2 Todo"
Cohesion: 0.33
Nodes (5): Phase 5.2 Todo, Task 1: Event Data Foundation, Task 2: Events Dashboard And Create Flow, Task 3: Details, Edit, And Archive, Task 4: Verification And Release

### Community 59 - "ref_types_domain"
Cohesion: 0.11
Nodes (3): ref_types_domain, ref_utils_outfitworkflow, badgeClass

### Community 60 - "permissions.ts"
Cohesion: 0.32
Nodes (6): can(), full, getPermissionLevel(), none, rolePermissions(), viewOnly

### Community 61 - "Changelog"
Cohesion: 0.08
Nodes (25): Added, Added, Added, Added, Changed, Changed, Changed, Changed (+17 more)

### Community 62 - "outfitImage.service.ts"
Cohesion: 0.19
Nodes (16): acceptedImageTypes, assertImageFile(), compressImage(), getOutfitImages(), getSignedUrl(), loadImage(), mapImage(), mapWithSignedUrls() (+8 more)

### Community 63 - "ref_components_ui_button"
Cohesion: 0.10
Nodes (9): ref_components_ui_button, ref_components_ui_emptystate, ref_components_ui_modal, ArchiveDialogProps, ImageViewerProps, ParticipantEmptyStateProps, RemoveParticipantDialogProps, ErrorStateProps (+1 more)

### Community 64 - "ref_components_ui_errorstate"
Cohesion: 0.25
Nodes (4): ref_components_ui_errorstate, AppErrorBoundary, AppErrorBoundaryProps, AppErrorBoundaryState

### Community 65 - "eventWorkflow.ts"
Cohesion: 0.29
Nodes (3): eventStatuses, eventStatusLabels, transitions

### Community 66 - "react-router-dom"
Cohesion: 0.15
Nodes (7): ref_components_outfits, react-router-dom, ref_store_outfitstore, ParticipantOutfitsSectionProps, OutfitCreatePage(), OutfitDetailPage(), OutfitEditPage()

### Community 67 - "App.tsx"
Cohesion: 0.40
Nodes (3): ref_app_providers_authprovider, ref_components_common_apperrorboundary, ref_routes_router

### Community 68 - "outfit.service.ts"
Cohesion: 0.23
Nodes (17): Added, archiveOutfit(), countByOutfit(), createOutfit(), getOutfit(), getOutfitMeta(), getOutfits(), getParticipant() (+9 more)

### Community 69 - "react"
Cohesion: 0.25
Nodes (5): ref_app_app, react, ref_react_dom_client, ref_styles_index_css, SlotProps

### Community 70 - "AppLayout.tsx"
Cohesion: 0.07
Nodes (18): ref_components_outfits_participantoutfitssection, ref_components_participants_addparticipantdialog, ref_components_participants_participantcard, ref_components_participants_participantemptystate, ref_components_participants_participantlist, ref_components_participants_removeparticipantdialog, ref_components_ui_avatar, ref_components_ui_badge (+10 more)

### Community 71 - "events/index.ts"
Cohesion: 0.18
Nodes (3): ref_components_events_eventcard, ref_utils_eventworkflow, badgeClass

### Community 72 - "outfitWorkflow.ts"
Cohesion: 0.29
Nodes (3): outfitStatuses, outfitStatusLabels, transitions

### Community 73 - "OutfitGallery.tsx"
Cohesion: 0.17
Nodes (8): ref_components_outfits_emptygallery, ref_components_outfits_gallerythumbnail, ref_components_outfits_imageuploader, ref_components_outfits_imageviewer, ref_components_outfits_uploadprogress, ref_store_outfitimagestore, ImageUploader(), ImageUploaderProps

### Community 74 - "ShoppingLinkCard.tsx"
Cohesion: 0.18
Nodes (6): ref_utils_participantvalidation, ref_utils_shoppinglinks, vitest, ShoppingLinkCardProps, candidates, participant

### Community 75 - "OutfitForm.tsx"
Cohesion: 0.29
Nodes (6): ref_components_ui_textarea, OutfitForm(), OutfitFormProps, outfitFormSchema, OutfitFormValues, toValues()

### Community 76 - "shoppingLinks.ts"
Cohesion: 0.33
Nodes (5): detectLinkProvider(), getLinkDomain(), LinkProvider, maxShoppingLinks, providers

### Community 77 - "ShoppingLinksPanel.tsx"
Cohesion: 0.40
Nodes (3): ref_components_outfits_shoppinglinkcard, ref_components_outfits_shoppinglinkform, ref_store_shoppinglinkstore

## Knowledge Gaps
- **289 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+284 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 501 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Changelog` connect `Changelog` to `event.service.ts`?**
  _High betweenness centrality (0.189) - this node is a cross-community bridge._
- **Why does `log` connect `log` to `CHANGELOG`, `PRD`, `DATABASE`, `SDD`, `DECISIONS`, `Plan`, `Changelog`?**
  _High betweenness centrality (0.138) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `ref_components_ui_errorstate`, `react-router-dom`, `ref_utils_cx`, `package.json`, `ref_lib_supabase`, `AppLayout.tsx`, `zustand`, `OutfitGallery.tsx`, `OutfitForm.tsx`, `ShoppingLinksPanel.tsx`, `ref_components_ui_card`, `EventForm.tsx`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _289 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `migrate.py` be split into smaller, more focused modules?**
  _Cohesion score 0.09852216748768473 - nodes in this community are weakly interconnected._
- **Should `ref_utils_cx` be split into smaller, more focused modules?**
  _Cohesion score 0.0873015873015873 - nodes in this community are weakly interconnected._
- **Should `PRD` be split into smaller, more focused modules?**
  _Cohesion score 0.13970588235294118 - nodes in this community are weakly interconnected._