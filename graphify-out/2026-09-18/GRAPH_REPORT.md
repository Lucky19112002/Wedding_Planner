# Graph Report - WeddingPlanner  (2026-09-18)

## Corpus Check
- 167 files · ~62,363 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 9, .css 1)

## Summary
- 1064 nodes · 1617 edges · 94 communities (65 shown, 29 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 36 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `852b7abf`
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
- invitation.service.ts
- compilerOptions
- AppLayout.tsx
- 002_rls_policies.sql
- manifest.json
- 001_initial_schema.sql
- permission.service.ts
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
- AppHomePage.tsx
- ref_types_domain
- participant.service.ts
- router.tsx
- domain.ts
- dashboard/index.ts
- Phase 5.2 Todo
- permissions.ts
- event.service.ts
- outfitImage.service.ts
- ref_components_ui_button
- AppErrorBoundary.tsx
- eventWorkflow.ts
- react
- App.tsx
- outfit.service.ts
- main.tsx
- EventParticipantsSection.tsx
- dashboard.service.ts
- outfitWorkflow.ts
- outfits/index.ts
- LoginPage.tsx
- events/index.ts
- shoppingLinks.ts
- dashboardStore.ts
- eventStore.ts
- weddingStore.ts
- outfitStore.ts
- outfitImageStore.ts
- participantStore.ts
- shoppingLinkStore.ts
- users/index.ts
- UsersPage
- zustand
- Slot.tsx
- permissionStore.ts
- invitationStore.ts
- classifyInviteError

## God Nodes (most connected - your core abstractions)
1. `react` - 30 edges
2. `react-router-dom` - 25 edges
3. `SDD` - 21 edges
4. `DATABASE` - 20 edges
5. `compilerOptions` - 19 edges
6. `PRD` - 19 edges
7. `log` - 18 edges
8. `DECISIONS` - 17 edges
9. `public.profiles` - 15 edges
10. `CHANGELOG` - 15 edges

## Surprising Connections (you probably didn't know these)
- `Setup` --references--> `psql()`  [INFERRED]
  README.md → scripts/migrate.py
- `Added` --references--> `main()`  [INFERRED]
  CHANGELOG.md → scripts/migrate.py
- `Branch Workflow` --references--> `main()`  [INFERRED]
  README.md → scripts/migrate.py
- `Added` --references--> `archiveEvent()`  [INFERRED]
  CHANGELOG.md → src/services/event.service.ts
- `Added` --references--> `archiveOutfit()`  [INFERRED]
  CHANGELOG.md → src/services/outfit.service.ts

## Import Cycles
- None detected.

## Communities (94 total, 29 thin omitted)

### Community 0 - "CHANGELOG"
Cohesion: 0.20
Nodes (11): CHANGELOG, Documentation version history, Phase 3.2 migration readiness, Phase 3 database readiness, Documentation governance, Project phase status, README, Locked baseline migrations (+3 more)

### Community 1 - "migrate.py"
Cohesion: 0.08
Nodes (32): Added, Changed, Security, [v0.3.4-repository-workflow] - 2026-09-18, CompletedProcess, hashlib, os, Path (+24 more)

### Community 2 - "ref_utils_cx"
Cohesion: 0.06
Nodes (16): ref_components_ui_slot, ref_utils_cx, ref_utils_eventworkflow, badgeClass, AvatarProps, ButtonProps, EmptyStateProps, ErrorStateProps (+8 more)

### Community 3 - "PRD"
Cohesion: 0.14
Nodes (17): Archive restore and permanent delete, Audit and activity, Invitation onboarding, PHASE-2.1, Progress calculation, Archive restore and permanent delete, Audit and activity, Event management (+9 more)

### Community 4 - "package.json"
Cohesion: 0.05
Nodes (42): dependencies, @hookform/resolvers, react, react-dom, react-hook-form, react-router-dom, @supabase/supabase-js, @vitejs/plugin-react (+34 more)

### Community 5 - "ref_lib_supabase"
Cohesion: 0.05
Nodes (29): ref_app_providers_authcontext, ref_lib_supabase, ref_services_auth_service, ref_services_profile_service, ref_store_authstore, ref_store_weddingstore, @supabase/supabase-js, AuthContext (+21 more)

### Community 6 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, allowJs, allowSyntheticDefaultImports, composite, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx (+12 more)

### Community 7 - "devDependencies"
Cohesion: 0.11
Nodes (19): devDependencies, autoprefixer, eslint, eslint-config-prettier, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals (+11 more)

### Community 8 - "invitation.service.ts"
Cohesion: 0.19
Nodes (21): acceptInvitation(), buildInviteUrl(), cancelInvitation(), generateInviteToken(), getErrorMessage(), getInvitationState(), getPendingInvitations(), getProfileByEmail() (+13 more)

### Community 9 - "compilerOptions"
Cohesion: 0.13
Nodes (14): compilerOptions, allowJs, composite, isolatedModules, lib, module, moduleResolution, noEmit (+6 more)

### Community 10 - "AppLayout.tsx"
Cohesion: 0.11
Nodes (15): ref_components_ui_badge, ref_components_ui_select, ref_store_uistore, ref_utils_permissions, formatDate(), PendingInvitationsSection(), PendingInvitationsSectionProps, actionLabels (+7 more)

### Community 11 - "002_rls_policies.sql"
Cohesion: 0.07
Nodes (8): public.handle_new_user, public.profiles, public.wedding_memberships, public.weddings, on_auth_user_created, public.is_current_user_active(), public.is_super_admin(), public.wedding_role()

### Community 12 - "manifest.json"
Cohesion: 0.22
Nodes (8): background_color, description, display, icons, name, short_name, start_url, theme_color

### Community 13 - "001_initial_schema.sql"
Cohesion: 0.13
Nodes (16): public.enforce_outfit_image_cap, public.enforce_outfit_status_fields, public.log_event_activity, public.set_updated_audit, trg_events_activity, trg_events_updated, trg_images_cap, trg_images_updated (+8 more)

### Community 14 - "permission.service.ts"
Cohesion: 0.24
Nodes (11): deactivateUser(), getPendingInvitationStatuses(), getProfiles(), getUsers(), InvitationRow, mapProfile(), mapUser(), MembershipRow (+3 more)

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
Nodes (22): ref_components_ui_textarea, ref_hookform_resolvers_zod, react-hook-form, zod, EventForm(), EventFormProps, eventFormSchema, EventFormValues (+14 more)

### Community 52 - "AppHomePage.tsx"
Cohesion: 0.20
Nodes (5): ref_components_dashboard, ref_components_ui_unauthorizedstate, ref_hooks_useprofile, ref_hooks_useweddingcontext, ref_store_dashboardstore

### Community 53 - "ref_types_domain"
Cohesion: 0.12
Nodes (9): ref_components_events_eventstatusbadge, ref_components_outfits_outfitimageplaceholder, ref_components_outfits_outfitstatusbadge, ref_components_participants_participantavatar, ref_components_participants_participantrolebadge, ref_types_domain, ref_utils_eventformat, EventHeaderProps (+1 more)

### Community 54 - "participant.service.ts"
Cohesion: 0.18
Nodes (20): Added, Changed, Notes, [v0.5.3-participant-management] - 2026-09-18, Verified, addParticipant(), archiveParticipant(), byId() (+12 more)

### Community 55 - "router.tsx"
Cohesion: 0.12
Nodes (16): ref_layouts_applayout, ref_layouts_publiclayout, ref_pages_apphomepage, ref_pages_events_eventcreatepage, ref_pages_events_eventdetailpage, ref_pages_events_eventeditpage, ref_pages_events_eventspage, ref_pages_invite_invitepage (+8 more)

### Community 56 - "domain.ts"
Cohesion: 0.06
Nodes (33): DashboardData, DashboardEventProgress, DashboardOutfitAnalytics, DashboardParticipantInsight, DashboardSummary, DashboardTimelineEvent, Event, EventInput (+25 more)

### Community 57 - "dashboard/index.ts"
Cohesion: 0.12
Nodes (5): ref_components_ui_avatar, ref_utils_dashboardmetrics, colorByStatus, actions, SummaryCardProps

### Community 58 - "Phase 5.2 Todo"
Cohesion: 0.33
Nodes (5): Phase 5.2 Todo, Task 1: Event Data Foundation, Task 2: Events Dashboard And Create Flow, Task 3: Details, Edit, And Archive, Task 4: Verification And Release

### Community 60 - "permissions.ts"
Cohesion: 0.19
Nodes (10): can(), full, getPermissionLevel(), getRolePermissionMatrix(), managedPermissionResources, none, permissionActions, rolePermissions() (+2 more)

### Community 61 - "event.service.ts"
Cohesion: 0.08
Nodes (32): Added, Added, Added, Added, Added, Changed, Changed, Changed (+24 more)

### Community 62 - "outfitImage.service.ts"
Cohesion: 0.19
Nodes (16): acceptedImageTypes, assertImageFile(), compressImage(), getOutfitImages(), getSignedUrl(), loadImage(), mapImage(), mapWithSignedUrls() (+8 more)

### Community 63 - "ref_components_ui_button"
Cohesion: 0.12
Nodes (8): ref_components_ui_button, ref_components_ui_modal, ref_utils_outfitformat, ArchiveDialogProps, ArchiveOutfitDialogProps, ImageViewerProps, RemoveParticipantDialogProps, DeactivateUserDialogProps

### Community 64 - "AppErrorBoundary.tsx"
Cohesion: 0.29
Nodes (3): AppErrorBoundary, AppErrorBoundaryProps, AppErrorBoundaryState

### Community 65 - "eventWorkflow.ts"
Cohesion: 0.29
Nodes (3): eventStatuses, eventStatusLabels, transitions

### Community 66 - "react"
Cohesion: 0.10
Nodes (22): ref_components_events, ref_components_outfits, ref_components_participants, ref_components_ui_card, ref_components_ui_errorstate, ref_components_ui_loader, ref_components_users, ref_hooks_usepermission (+14 more)

### Community 67 - "App.tsx"
Cohesion: 0.40
Nodes (3): ref_app_providers_authprovider, ref_components_common_apperrorboundary, ref_routes_router

### Community 68 - "outfit.service.ts"
Cohesion: 0.17
Nodes (21): Added, Changed, Notes, [v0.5.4-outfit-management] - 2026-09-18, Verified, archiveOutfit(), countByOutfit(), createOutfit() (+13 more)

### Community 69 - "main.tsx"
Cohesion: 0.50
Nodes (3): ref_app_app, ref_react_dom_client, ref_styles_index_css

### Community 70 - "EventParticipantsSection.tsx"
Cohesion: 0.08
Nodes (12): ref_components_outfits_participantoutfitssection, ref_components_participants_addparticipantdialog, ref_components_participants_participantcard, ref_components_participants_participantemptystate, ref_components_participants_participantlist, ref_components_participants_removeparticipantdialog, ref_store_participantstore, EventParticipantsSection() (+4 more)

### Community 71 - "dashboard.service.ts"
Cohesion: 0.08
Nodes (22): ref_utils_outfitworkflow, ref_utils_participantvalidation, ref_utils_shoppinglinks, vitest, badgeClass, ShoppingLinkCardProps, buildEventProgress(), buildParticipantInsights() (+14 more)

### Community 72 - "outfitWorkflow.ts"
Cohesion: 0.29
Nodes (3): outfitStatuses, outfitStatusLabels, transitions

### Community 73 - "outfits/index.ts"
Cohesion: 0.07
Nodes (13): ref_components_outfits_emptygallery, ref_components_outfits_gallerythumbnail, ref_components_outfits_imageuploader, ref_components_outfits_imageviewer, ref_components_outfits_outfitcard, ref_components_outfits_shoppinglinkcard, ref_components_outfits_shoppinglinkform, ref_components_outfits_uploadprogress (+5 more)

### Community 74 - "LoginPage.tsx"
Cohesion: 0.14
Nodes (8): ref_components_ui_input, ref_hooks_useauth, AddParticipantDialog(), AddParticipantDialogProps, roleSuggestions, LoginForm, LoginPage(), loginSchema

### Community 75 - "events/index.ts"
Cohesion: 0.17
Nodes (3): ref_components_events_eventcard, ref_components_ui_emptystate, UserEmptyStateProps

### Community 76 - "shoppingLinks.ts"
Cohesion: 0.33
Nodes (5): detectLinkProvider(), getLinkDomain(), LinkProvider, maxShoppingLinks, providers

### Community 78 - "dashboardStore.ts"
Cohesion: 0.50
Nodes (4): ref_services_dashboard_service, DashboardStore, getErrorMessage(), useDashboardStore

### Community 79 - "eventStore.ts"
Cohesion: 0.50
Nodes (4): ref_services_event_service, EventStore, getErrorMessage(), useEventStore

### Community 80 - "weddingStore.ts"
Cohesion: 0.40
Nodes (4): ref_services_membership_service, ref_services_wedding_service, useWeddingStore, WeddingStore

### Community 81 - "outfitStore.ts"
Cohesion: 0.50
Nodes (4): ref_services_outfit_service, getErrorMessage(), OutfitStore, useOutfitStore

### Community 82 - "outfitImageStore.ts"
Cohesion: 0.50
Nodes (4): ref_services_outfitimage_service, getErrorMessage(), OutfitImageStore, useOutfitImageStore

### Community 83 - "participantStore.ts"
Cohesion: 0.50
Nodes (4): ref_services_participant_service, getErrorMessage(), ParticipantStore, useParticipantStore

### Community 84 - "shoppingLinkStore.ts"
Cohesion: 0.50
Nodes (4): ref_services_shoppinglink_service, getErrorMessage(), ShoppingLinkStore, useShoppingLinkStore

### Community 85 - "users/index.ts"
Cohesion: 0.29
Nodes (6): ref_components_users_deactivateuserdialog, ref_components_users_inviteuserdialog, ref_components_users_pendinginvitationssection, ref_components_users_permissioneditor, ref_components_users_usercard, ref_components_users_useremptystate

### Community 87 - "zustand"
Cohesion: 0.50
Nodes (3): zustand, UiStore, useUiStore

### Community 89 - "permissionStore.ts"
Cohesion: 0.40
Nodes (5): ref_services_permission_service, getErrorMessage(), PermissionStore, usePermissionStore, UserStatusFilter

### Community 91 - "invitationStore.ts"
Cohesion: 0.50
Nodes (4): ref_services_invitation_service, getErrorMessage(), InvitationStore, useInvitationStore

### Community 92 - "classifyInviteError"
Cohesion: 0.83
Nodes (4): classifyInviteError(), InvitePage(), handleAccept(), handleReject()

## Knowledge Gaps
- **342 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+337 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 591 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **29 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Changelog` connect `event.service.ts` to `migrate.py`, `outfit.service.ts`, `participant.service.ts`?**
  _High betweenness centrality (0.160) - this node is a cross-community bridge._
- **Why does `log` connect `log` to `CHANGELOG`, `PRD`, `DATABASE`, `SDD`, `DECISIONS`, `Plan`, `event.service.ts`?**
  _High betweenness centrality (0.120) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `AppErrorBoundary.tsx`, `ref_utils_cx`, `package.json`, `ref_lib_supabase`, `EventParticipantsSection.tsx`, `main.tsx`, `outfits/index.ts`, `LoginPage.tsx`, `AppLayout.tsx`, `EventForm.tsx`, `AppHomePage.tsx`, `Slot.tsx`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _342 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `migrate.py` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `ref_utils_cx` be split into smaller, more focused modules?**
  _Cohesion score 0.05897435897435897 - nodes in this community are weakly interconnected._
- **Should `PRD` be split into smaller, more focused modules?**
  _Cohesion score 0.13970588235294118 - nodes in this community are weakly interconnected._