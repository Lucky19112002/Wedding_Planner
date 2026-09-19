# Graph Report - WeddingPlanner  (2026-09-19)

## Corpus Check
- 169 files · ~64,292 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 11 file(s) not represented in the graph (top: (none) 10, .css 1)

## Summary
- 1108 nodes · 1651 edges · 120 communities (76 shown, 44 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 38 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0c6e5feb`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ref_lib_supabase
- EventParticipantsSection.tsx
- package.json
- ref_utils_cx
- Changelog
- migrate.py
- domain.ts
- ref_types_domain
- dashboard.service.ts
- outfit.service.ts
- ref_utils_eventformat
- ref_components_ui_button
- invitation.service.ts
- participant.service.ts
- AppLayout.tsx
- compilerOptions
- DATABASE
- devDependencies
- react
- event.service.ts
- router.tsx
- outfitImage.service.ts
- PRD
- UserCard.tsx
- compilerOptions
- permissions.ts
- OutfitGallery.tsx
- authStore.ts
- DECISIONS
- CHANGELOG
- MIGRATIONS
- log
- Implementation Plan: Phase 5.2 Event Management
- SDD
- manifest.json
- vitest
- OutfitForm.tsx
- InviteUserDialog.tsx
- ShoppingLinkForm.tsx
- AppErrorBoundary.tsx
- EventForm.tsx
- UsersPage
- eventWorkflow.ts
- outfitWorkflow.ts
- shoppingLinks.ts
- Plan
- UsersPage.tsx
- dependencies
- permissionStore.ts
- events/index.ts
- Phase 5.2 Todo
- App.tsx
- ref_utils_outfitworkflow
- dashboardStore.ts
- eventStore.ts
- invitationStore.ts
- weddingStore.ts
- outfitStore.ts
- outfitImageStore.ts
- participantStore.ts
- shoppingLinkStore.ts
- public.outfits
- main.tsx
- zustand
- classifyInviteError
- tsconfig.json
- AGENTS.md
- auth.ts
- public.profiles
- public.activity_logs
- trg_events_confirm
- 001_initial_schema.sql
- public.participants
- trg_urls_cap
- public.events
- 002_rls_policies.sql
- public.invitations
- eslint.config.js
- trg_images_activity
- trg_outfits_activity
- public.outfit_images
- public.outfit_urls
- public.outfits
- public.participants
- trg_profiles_last_sa
- scripts
- users/index.ts
- public.sync_outfit_child_wedding
- trg_outfits_denorm
- trg_participants_wedding
- public.events
- public.invitations
- vite.config.ts
- public.wedding_memberships
- Slot.tsx
- UserEmptyState.tsx
- tailwindcss
- ref_pages_apphomepage
- ref_pages_events_eventcreatepage
- ref_pages_events_eventdetailpage
- ref_pages_events_eventeditpage
- ref_pages_events_eventspage
- ref_pages_invite_invitepage
- ref_pages_loginpage
- ref_pages_outfits_outfitcreatepage
- ref_pages_outfits_outfitdetailpage
- ref_pages_outfits_outfiteditpage
- ref_pages_publichomepage
- ref_pages_users_userspage

## God Nodes (most connected - your core abstractions)
1. `react` - 31 edges
2. `react-router-dom` - 25 edges
3. `SDD` - 21 edges
4. `DATABASE` - 20 edges
5. `compilerOptions` - 19 edges
6. `PRD` - 19 edges
7. `log` - 19 edges
8. `DECISIONS` - 17 edges
9. `public.profiles` - 15 edges
10. `CHANGELOG` - 15 edges

## Surprising Connections (you probably didn't know these)
- `Added` --references--> `main()`  [INFERRED]
  CHANGELOG.md → scripts/migrate.py
- `Added` --references--> `main()`  [INFERRED]
  CHANGELOG.md → scripts/migrate.py
- `Setup` --references--> `psql()`  [INFERRED]
  README.md → scripts/migrate.py
- `Branch Workflow` --references--> `main()`  [INFERRED]
  README.md → scripts/migrate.py
- `Release Workflow` --references--> `main()`  [INFERRED]
  README.md → scripts/migrate.py

## Import Cycles
- None detected.

## Communities (120 total, 44 thin omitted)

### Community 0 - "ref_lib_supabase"
Cohesion: 0.05
Nodes (32): ref_app_providers_authcontext, ref_lib_supabase, ref_services_auth_service, ref_store_authstore, ref_store_weddingstore, signOut(), listMemberships(), mapMembership() (+24 more)

### Community 1 - "EventParticipantsSection.tsx"
Cohesion: 0.06
Nodes (15): ref_components_outfits_participantoutfitssection, ref_components_participants_addparticipantdialog, ref_components_participants_participantavatar, ref_components_participants_participantcard, ref_components_participants_participantemptystate, ref_components_participants_participantlist, ref_components_participants_participantrolebadge, ref_components_participants_removeparticipantdialog (+7 more)

### Community 2 - "package.json"
Cohesion: 0.12
Nodes (15): name, private, type, version, autoprefixer, eslint, @hookform/resolvers, postcss (+7 more)

### Community 3 - "ref_utils_cx"
Cohesion: 0.07
Nodes (14): ref_components_ui_slot, ref_utils_cx, AvatarProps, ButtonProps, EmptyStateProps, ErrorStateProps, Input, InputProps (+6 more)

### Community 4 - "Changelog"
Cohesion: 0.05
Nodes (41): Added, Added, Added, Added, Added, Added, Added, Added (+33 more)

### Community 5 - "migrate.py"
Cohesion: 0.10
Nodes (29): CompletedProcess, hashlib, os, Path, pathlib, re, Architecture, Branch Workflow (+21 more)

### Community 6 - "domain.ts"
Cohesion: 0.06
Nodes (33): DashboardData, DashboardEventProgress, DashboardOutfitAnalytics, DashboardParticipantInsight, DashboardSummary, DashboardTimelineEvent, Event, EventInput (+25 more)

### Community 7 - "ref_types_domain"
Cohesion: 0.09
Nodes (10): ref_components_outfits_outfitcard, ref_components_outfits_outfitimageplaceholder, ref_components_outfits_outfitstatusbadge, ref_components_outfits_shoppinglinkcard, ref_components_outfits_shoppinglinkform, ref_store_shoppinglinkstore, ref_types_domain, ref_utils_outfitformat (+2 more)

### Community 8 - "dashboard.service.ts"
Cohesion: 0.18
Nodes (16): buildEventProgress(), buildParticipantInsights(), buildTimeline(), countBy(), EventProgressRow, EventRow, getDashboardData(), getInitialAnalytics() (+8 more)

### Community 9 - "outfit.service.ts"
Cohesion: 0.17
Nodes (21): Added, Changed, Notes, [v0.5.4-outfit-management] - 2026-09-18, Verified, archiveOutfit(), countByOutfit(), createOutfit() (+13 more)

### Community 10 - "ref_utils_eventformat"
Cohesion: 0.10
Nodes (7): ref_components_events_eventstatusbadge, ref_components_ui_avatar, ref_utils_dashboardmetrics, ref_utils_eventformat, actions, SummaryCardProps, EventHeaderProps

### Community 11 - "ref_components_ui_button"
Cohesion: 0.11
Nodes (7): ref_components_ui_button, ref_components_ui_emptystate, ref_components_ui_modal, ArchiveDialogProps, ImageViewerProps, RemoveParticipantDialogProps, DeactivateUserDialogProps

### Community 12 - "invitation.service.ts"
Cohesion: 0.17
Nodes (21): acceptInvitation(), buildInviteUrl(), cancelInvitation(), generateInviteToken(), getErrorMessage(), getInvitationState(), getPendingInvitations(), getProfileByEmail() (+13 more)

### Community 13 - "participant.service.ts"
Cohesion: 0.18
Nodes (20): Added, Changed, Notes, [v0.5.3-participant-management] - 2026-09-18, Verified, addParticipant(), archiveParticipant(), byId() (+12 more)

### Community 14 - "AppLayout.tsx"
Cohesion: 0.13
Nodes (8): ref_components_dashboard, ref_components_ui_unauthorizedstate, ref_hooks_useauth, ref_hooks_useprofile, ref_hooks_useweddingcontext, ref_store_dashboardstore, ref_store_uistore, navItems

### Community 15 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, allowJs, allowSyntheticDefaultImports, composite, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx (+12 more)

### Community 16 - "DATABASE"
Cohesion: 0.12
Nodes (19): API, Archive RPCs, Invitation RPCs, Private outfit storage, Row Level Security, Supabase PostgREST API, Archive lifecycle, Audit stamps (+11 more)

### Community 17 - "devDependencies"
Cohesion: 0.11
Nodes (19): devDependencies, autoprefixer, eslint, eslint-config-prettier, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals (+11 more)

### Community 18 - "react"
Cohesion: 0.11
Nodes (19): ref_components_events, ref_components_outfits, ref_components_participants, ref_components_ui_card, ref_components_ui_errorstate, ref_components_ui_loader, ref_hooks_usepermission, react (+11 more)

### Community 19 - "event.service.ts"
Cohesion: 0.26
Nodes (14): Added, Changed, [v0.5.2-event-management] - 2026-09-18, Verified, archiveEvent(), createEvent(), EventRow, getEvent() (+6 more)

### Community 20 - "router.tsx"
Cohesion: 0.11
Nodes (5): ref_layouts_applayout, ref_layouts_publiclayout, ref_routes_protectedroute, router, routes

### Community 21 - "outfitImage.service.ts"
Cohesion: 0.19
Nodes (16): acceptedImageTypes, assertImageFile(), compressImage(), getOutfitImages(), getSignedUrl(), loadImage(), mapImage(), mapWithSignedUrls() (+8 more)

### Community 22 - "PRD"
Cohesion: 0.14
Nodes (17): Archive restore and permanent delete, Audit and activity, Invitation onboarding, PHASE-2.1, Progress calculation, Archive restore and permanent delete, Audit and activity, Event management (+9 more)

### Community 23 - "UserCard.tsx"
Cohesion: 0.21
Nodes (9): ref_components_ui_badge, ref_utils_permissions, formatDate(), PendingInvitationsSection(), PendingInvitationsSectionProps, formatDate(), UserCard(), UserCardProps (+1 more)

### Community 24 - "compilerOptions"
Cohesion: 0.13
Nodes (14): compilerOptions, allowJs, composite, isolatedModules, lib, module, moduleResolution, noEmit (+6 more)

### Community 25 - "permissions.ts"
Cohesion: 0.19
Nodes (10): can(), full, getPermissionLevel(), getRolePermissionMatrix(), managedPermissionResources, none, permissionActions, rolePermissions() (+2 more)

### Community 26 - "OutfitGallery.tsx"
Cohesion: 0.17
Nodes (8): ref_components_outfits_emptygallery, ref_components_outfits_gallerythumbnail, ref_components_outfits_imageuploader, ref_components_outfits_imageviewer, ref_components_outfits_uploadprogress, ref_store_outfitimagestore, ImageUploader(), ImageUploaderProps

### Community 27 - "authStore.ts"
Cohesion: 0.18
Nodes (8): ref_services_profile_service, @supabase/supabase-js, AuthContext, AuthContextValue, isSupabaseConfigured, supabase, AuthStore, useAuthStore

### Community 28 - "DECISIONS"
Cohesion: 0.18
Nodes (11): Progress views, Progress views, DEC-001 React frontend, DEC-002 Supabase backend, DEC-003 GitHub Pages hosting, DEC-004 PWA readiness, DEC-005 Multi-wedding architecture, DEC-006 Archive and audit history (+3 more)

### Community 29 - "CHANGELOG"
Cohesion: 0.20
Nodes (11): CHANGELOG, Documentation version history, Phase 3.2 migration readiness, Phase 3 database readiness, Documentation governance, Project phase status, README, Locked baseline migrations (+3 more)

### Community 30 - "MIGRATIONS"
Cohesion: 0.20
Nodes (10): Deployment prerequisites, Environment variables, INFRASTRUCTURE, Supabase Auth configuration, Supabase project setup, CI migration gate, Forward-only rollback, Migration history and checksums (+2 more)

### Community 31 - "log"
Cohesion: 0.18
Nodes (10): log, Phase 2.1 documentation revision, Phase 3.1 infrastructure work, Phase 3.2 migration work, Phase 3 database work, Drift Cause, Migration Reconciliation, Production Baseline (+2 more)

### Community 32 - "Implementation Plan: Phase 5.2 Event Management"
Cohesion: 0.18
Nodes (10): Architecture Decisions, Implementation Plan: Phase 5.2 Event Management, Open Questions, Overview, Phase 1: Event Data Foundation, Phase 2: Events List And Create Flow, Phase 3: Details, Edit, And Archive, Phase 4: Polish, Docs, And Release (+2 more)

### Community 33 - "SDD"
Cohesion: 0.20
Nodes (10): User roles and permissions, Archive and audit alignment, GitHub Pages hosting, Image storage lifecycle, Module boundaries, Permission model, PWA readiness, React frontend (+2 more)

### Community 34 - "manifest.json"
Cohesion: 0.22
Nodes (8): background_color, description, display, icons, name, short_name, start_url, theme_color

### Community 35 - "vitest"
Cohesion: 0.18
Nodes (6): ref_utils_participantvalidation, ref_utils_shoppinglinks, vitest, ShoppingLinkCardProps, candidates, participant

### Community 36 - "OutfitForm.tsx"
Cohesion: 0.29
Nodes (6): zod, OutfitForm(), OutfitFormProps, outfitFormSchema, OutfitFormValues, toValues()

### Community 37 - "InviteUserDialog.tsx"
Cohesion: 0.29
Nodes (5): ref_components_ui_textarea, InviteForm, inviteSchema, InviteUserDialog(), InviteUserDialogProps

### Community 38 - "ShoppingLinkForm.tsx"
Cohesion: 0.29
Nodes (5): react-hook-form, LinkFormValues, linkSchema, ShoppingLinkForm(), ShoppingLinkFormProps

### Community 39 - "AppErrorBoundary.tsx"
Cohesion: 0.29
Nodes (3): AppErrorBoundary, AppErrorBoundaryProps, AppErrorBoundaryState

### Community 40 - "EventForm.tsx"
Cohesion: 0.29
Nodes (6): ref_hookform_resolvers_zod, EventForm(), EventFormProps, eventFormSchema, EventFormValues, toValues()

### Community 42 - "eventWorkflow.ts"
Cohesion: 0.29
Nodes (3): eventStatuses, eventStatusLabels, transitions

### Community 43 - "outfitWorkflow.ts"
Cohesion: 0.29
Nodes (3): outfitStatuses, outfitStatusLabels, transitions

### Community 44 - "shoppingLinks.ts"
Cohesion: 0.33
Nodes (5): detectLinkProvider(), getLinkDomain(), LinkProvider, maxShoppingLinks, providers

### Community 45 - "Plan"
Cohesion: 0.33
Nodes (6): Event management, Outfit management, Plan, Reference images and links, User roles and permissions, Wedding project

### Community 46 - "UsersPage.tsx"
Cohesion: 0.10
Nodes (14): ref_components_ui_input, ref_components_ui_select, ref_components_users, ref_store_invitationstore, ref_store_permissionstore, AddParticipantDialog(), AddParticipantDialogProps, roleSuggestions (+6 more)

### Community 47 - "dependencies"
Cohesion: 0.20
Nodes (10): dependencies, @hookform/resolvers, react, react-dom, react-hook-form, react-router-dom, @supabase/supabase-js, @vitejs/plugin-react (+2 more)

### Community 48 - "permissionStore.ts"
Cohesion: 0.40
Nodes (5): ref_services_permission_service, getErrorMessage(), PermissionStore, usePermissionStore, UserStatusFilter

### Community 49 - "events/index.ts"
Cohesion: 0.22
Nodes (3): ref_components_events_eventcard, ref_utils_eventworkflow, badgeClass

### Community 51 - "Phase 5.2 Todo"
Cohesion: 0.33
Nodes (5): Phase 5.2 Todo, Task 1: Event Data Foundation, Task 2: Events Dashboard And Create Flow, Task 3: Details, Edit, And Archive, Task 4: Verification And Release

### Community 52 - "App.tsx"
Cohesion: 0.40
Nodes (3): ref_app_providers_authprovider, ref_components_common_apperrorboundary, ref_routes_router

### Community 53 - "ref_utils_outfitworkflow"
Cohesion: 0.20
Nodes (3): ref_utils_outfitworkflow, colorByStatus, badgeClass

### Community 54 - "dashboardStore.ts"
Cohesion: 0.50
Nodes (4): ref_services_dashboard_service, DashboardStore, getErrorMessage(), useDashboardStore

### Community 55 - "eventStore.ts"
Cohesion: 0.50
Nodes (4): ref_services_event_service, EventStore, getErrorMessage(), useEventStore

### Community 56 - "invitationStore.ts"
Cohesion: 0.50
Nodes (4): ref_services_invitation_service, getErrorMessage(), InvitationStore, useInvitationStore

### Community 57 - "weddingStore.ts"
Cohesion: 0.40
Nodes (4): ref_services_membership_service, ref_services_wedding_service, useWeddingStore, WeddingStore

### Community 58 - "outfitStore.ts"
Cohesion: 0.50
Nodes (4): ref_services_outfit_service, getErrorMessage(), OutfitStore, useOutfitStore

### Community 59 - "outfitImageStore.ts"
Cohesion: 0.50
Nodes (4): ref_services_outfitimage_service, getErrorMessage(), OutfitImageStore, useOutfitImageStore

### Community 60 - "participantStore.ts"
Cohesion: 0.50
Nodes (4): ref_services_participant_service, getErrorMessage(), ParticipantStore, useParticipantStore

### Community 61 - "shoppingLinkStore.ts"
Cohesion: 0.50
Nodes (4): ref_services_shoppinglink_service, getErrorMessage(), ShoppingLinkStore, useShoppingLinkStore

### Community 62 - "public.outfits"
Cohesion: 0.25
Nodes (8): idx_outfit_images_outfit, idx_outfits_owner, idx_outfits_participant, idx_outfits_wedding, public.enforce_outfit_image_cap(), public.outfit_images, public.outfits, public.sync_outfit_child_wedding()

### Community 63 - "main.tsx"
Cohesion: 0.50
Nodes (3): ref_app_app, ref_react_dom_client, ref_styles_index_css

### Community 64 - "zustand"
Cohesion: 0.50
Nodes (3): zustand, UiStore, useUiStore

### Community 65 - "classifyInviteError"
Cohesion: 0.83
Nodes (4): classifyInviteError(), InvitePage(), handleAccept(), handleReject()

### Community 71 - "public.profiles"
Cohesion: 0.20
Nodes (12): auth.users, idx_activity_entity, idx_activity_wedding_created, idx_outfit_urls_outfit, idx_profiles_super_admin, idx_weddings_archived, public.activity_logs, public.enforce_outfit_url_cap() (+4 more)

### Community 75 - "001_initial_schema.sql"
Cohesion: 0.13
Nodes (16): public.enforce_outfit_image_cap, public.enforce_outfit_status_fields, public.log_event_activity, public.set_updated_audit, trg_events_activity, trg_events_updated, trg_images_cap, trg_images_updated (+8 more)

### Community 76 - "public.participants"
Cohesion: 0.25
Nodes (8): idx_participants_event, idx_participants_wedding, public.enforce_event_confirm_rules(), public.participants, public.sync_outfit_denorm(), public.v_outfit_progress, public.v_participant_progress, uq_participants_event_user

### Community 79 - "002_rls_policies.sql"
Cohesion: 0.07
Nodes (8): public.handle_new_user, public.profiles, public.wedding_memberships, public.weddings, on_auth_user_created, public.is_current_user_active(), public.is_super_admin(), public.wedding_role()

### Community 81 - "eslint.config.js"
Cohesion: 0.29
Nodes (6): eslint-config-prettier, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, typescript-eslint

### Community 89 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, dev, format, lint, test, typecheck

### Community 90 - "users/index.ts"
Cohesion: 0.29
Nodes (6): ref_components_users_deactivateuserdialog, ref_components_users_inviteuserdialog, ref_components_users_pendinginvitationssection, ref_components_users_permissioneditor, ref_components_users_usercard, ref_components_users_useremptystate

### Community 91 - "public.sync_outfit_child_wedding"
Cohesion: 0.67
Nodes (3): public.sync_outfit_child_wedding, trg_images_wedding, trg_urls_wedding

### Community 94 - "public.events"
Cohesion: 0.33
Nodes (6): idx_events_wedding, public.events, public.sync_participant_wedding(), public.v_event_progress, public.v_wedding_progress, uq_events_active_name

### Community 95 - "public.invitations"
Cohesion: 0.40
Nodes (5): idx_invitations_email, idx_invitations_expires, idx_invitations_wedding, public.invitations, uq_invitations_pending_email

### Community 97 - "vite.config.ts"
Cohesion: 0.50
Nodes (3): ref_node_url, vite, @vitejs/plugin-react

### Community 98 - "public.wedding_memberships"
Cohesion: 0.50
Nodes (4): idx_memberships_active, idx_memberships_user, idx_memberships_wedding, public.wedding_memberships

## Knowledge Gaps
- **362 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+357 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 626 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **44 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Changelog` connect `Changelog` to `outfit.service.ts`, `event.service.ts`, `participant.service.ts`?**
  _High betweenness centrality (0.190) - this node is a cross-community bridge._
- **Why does `log` connect `log` to `SDD`, `Changelog`, `Plan`, `DATABASE`, `PRD`, `DECISIONS`, `CHANGELOG`, `MIGRATIONS`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `ref_lib_supabase`, `EventParticipantsSection.tsx`, `package.json`, `ref_utils_cx`, `OutfitForm.tsx`, `Slot.tsx`, `ShoppingLinkForm.tsx`, `AppErrorBoundary.tsx`, `EventForm.tsx`, `ref_types_domain`, `InviteUserDialog.tsx`, `UsersPage.tsx`, `AppLayout.tsx`, `router.tsx`, `UserCard.tsx`, `OutfitGallery.tsx`, `authStore.ts`, `main.tsx`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _362 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ref_lib_supabase` be split into smaller, more focused modules?**
  _Cohesion score 0.05319148936170213 - nodes in this community are weakly interconnected._
- **Should `EventParticipantsSection.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._