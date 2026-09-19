# Graph Report - WeddingPlanner  (2026-09-19)

## Corpus Check
- 176 files · ~72,584 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 11 file(s) not represented in the graph (top: (none) 10, .css 1)

## Summary
- 1155 nodes · 1713 edges · 119 communities (74 shown, 45 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 40 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f02bf29f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- EventParticipantsSection.tsx
- ParticipantCard.tsx
- package.json
- ref_utils_cx
- Changelog
- migrate.py
- domain.ts
- outfits/index.ts
- dashboard.service.ts
- outfit.service.ts
- ref_components_ui_card
- ref_types_domain
- invitation.service.ts
- participant.service.ts
- AppLayout.tsx
- compilerOptions
- DATABASE
- devDependencies
- ref_components_ui_errorstate
- authStore.ts
- router.tsx
- outfitImage.service.ts
- PRD
- AddParticipantDialog.tsx
- compilerOptions
- permissions.ts
- react
- permission.service.ts
- DECISIONS
- CHANGELOG
- MIGRATIONS
- log
- Implementation Plan: Phase 5.2 Event Management
- SDD
- manifest.json
- ref_utils_permissions
- ShoppingLinkForm.tsx
- AppErrorBoundary.tsx
- EventForm.tsx
- ref_lib_supabase
- OutfitForm.tsx
- UsersPage
- eventWorkflow.ts
- outfitWorkflow.ts
- shoppingLinks.ts
- Plan
- vitest
- dependencies
- permissionStore.ts
- InviteUserDialog.tsx
- Phase 5.2 Todo
- App.tsx
- zustand
- dashboardStore.ts
- eventStore.ts
- InvitePage.tsx
- weddingStore.ts
- outfitStore.ts
- outfitImageStore.ts
- participantStore.ts
- shoppingLinkStore.ts
- public.outfits
- main.tsx
- appUrl.ts
- public.get_invitation_details
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
- react-router-dom
- trg_images_activity
- trg_outfits_activity
- public.outfit_images
- public.outfit_urls
- public.outfits
- public.participants
- trg_profiles_last_sa
- scripts
- public.get_invitation_details
- public.sync_outfit_child_wedding
- trg_outfits_denorm
- trg_participants_wedding
- public.events
- public.invitations
- vite.config.ts
- public.wedding_memberships
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
- Slot.tsx

## God Nodes (most connected - your core abstractions)
1. `react` - 31 edges
2. `react-router-dom` - 25 edges
3. `SDD` - 21 edges
4. `DATABASE` - 20 edges
5. `compilerOptions` - 19 edges
6. `PRD` - 19 edges
7. `log` - 19 edges
8. `Changelog` - 17 edges
9. `DECISIONS` - 17 edges
10. `public.profiles` - 15 edges

## Surprising Connections (you probably didn't know these)
- `Setup` --references--> `psql()`  [INFERRED]
  README.md → scripts/migrate.py
- `Added` --references--> `main()`  [INFERRED]
  CHANGELOG.md → scripts/migrate.py
- `Added` --references--> `main()`  [INFERRED]
  CHANGELOG.md → scripts/migrate.py
- `Branch Workflow` --references--> `main()`  [INFERRED]
  README.md → scripts/migrate.py
- `Release Workflow` --references--> `main()`  [INFERRED]
  README.md → scripts/migrate.py

## Import Cycles
- None detected.

## Communities (119 total, 45 thin omitted)

### Community 0 - "EventParticipantsSection.tsx"
Cohesion: 0.05
Nodes (28): ref_components_outfits_participantoutfitssection, ref_components_participants_addparticipantdialog, ref_components_participants_participantcard, ref_components_participants_participantemptystate, ref_components_participants_participantlist, ref_components_participants_removeparticipantdialog, ref_components_ui_avatar, ref_components_ui_badge (+20 more)

### Community 1 - "ParticipantCard.tsx"
Cohesion: 0.40
Nodes (3): ref_components_participants_participantavatar, ref_components_participants_participantrolebadge, ParticipantCardProps

### Community 2 - "package.json"
Cohesion: 0.10
Nodes (22): name, private, type, version, autoprefixer, eslint, eslint-config-prettier, @eslint/js (+14 more)

### Community 3 - "ref_utils_cx"
Cohesion: 0.06
Nodes (16): ref_components_ui_slot, ref_utils_cx, ref_utils_eventworkflow, badgeClass, AvatarProps, ButtonProps, EmptyStateProps, ErrorStateProps (+8 more)

### Community 4 - "Changelog"
Cohesion: 0.04
Nodes (48): Added, Added, Added, Added, Added, Added, Added, Changed (+40 more)

### Community 5 - "migrate.py"
Cohesion: 0.07
Nodes (38): Added, Added, Changed, Notes, Released, Security, [v0.3.4-repository-workflow] - 2026-09-18, [v1.0.0-stable] - 2026-09-18 (+30 more)

### Community 6 - "domain.ts"
Cohesion: 0.06
Nodes (33): DashboardData, DashboardEventProgress, DashboardOutfitAnalytics, DashboardParticipantInsight, DashboardSummary, DashboardTimelineEvent, Event, EventInput (+25 more)

### Community 7 - "outfits/index.ts"
Cohesion: 0.13
Nodes (3): ref_components_outfits_outfitcard, ref_utils_outfitworkflow, badgeClass

### Community 8 - "dashboard.service.ts"
Cohesion: 0.18
Nodes (16): buildEventProgress(), buildParticipantInsights(), buildTimeline(), countBy(), EventProgressRow, EventRow, getDashboardData(), getInitialAnalytics() (+8 more)

### Community 9 - "outfit.service.ts"
Cohesion: 0.17
Nodes (21): Added, Changed, Notes, [v0.5.4-outfit-management] - 2026-09-18, Verified, archiveOutfit(), countByOutfit(), createOutfit() (+13 more)

### Community 10 - "ref_components_ui_card"
Cohesion: 0.11
Nodes (7): ref_components_dashboard, ref_components_ui_card, ref_store_dashboardstore, ref_utils_dashboardmetrics, colorByStatus, actions, SummaryCardProps

### Community 11 - "ref_types_domain"
Cohesion: 0.08
Nodes (11): ref_components_events_eventcard, ref_components_ui_button, ref_components_ui_modal, ref_types_domain, ref_utils_outfitformat, ArchiveDialogProps, ArchiveOutfitDialogProps, GalleryThumbnailProps (+3 more)

### Community 12 - "invitation.service.ts"
Cohesion: 0.11
Nodes (31): ref_utils_appurl, acceptInvitation(), buildInviteUrl(), cancelInvitation(), createInvitedAccountAndAccept(), generateInviteToken(), getErrorMessage(), getInvitationDetails() (+23 more)

### Community 13 - "participant.service.ts"
Cohesion: 0.18
Nodes (20): Added, Changed, Notes, [v0.5.3-participant-management] - 2026-09-18, Verified, addParticipant(), archiveParticipant(), byId() (+12 more)

### Community 14 - "AppLayout.tsx"
Cohesion: 0.09
Nodes (16): ref_components_events, ref_components_participants, ref_components_ui_loader, ref_components_ui_unauthorizedstate, ref_components_users, ref_hooks_useauth, ref_hooks_usepermission, ref_hooks_useprofile (+8 more)

### Community 15 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, allowJs, allowSyntheticDefaultImports, composite, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx (+12 more)

### Community 16 - "DATABASE"
Cohesion: 0.12
Nodes (19): API, Archive RPCs, Invitation RPCs, Private outfit storage, Row Level Security, Supabase PostgREST API, Archive lifecycle, Audit stamps (+11 more)

### Community 17 - "devDependencies"
Cohesion: 0.11
Nodes (19): devDependencies, autoprefixer, eslint, eslint-config-prettier, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals (+11 more)

### Community 18 - "ref_components_ui_errorstate"
Cohesion: 0.18
Nodes (7): ref_components_outfits, ref_components_ui_errorstate, ref_store_outfitstore, ParticipantOutfitsSectionProps, OutfitCreatePage(), OutfitDetailPage(), OutfitEditPage()

### Community 19 - "authStore.ts"
Cohesion: 0.18
Nodes (8): ref_services_profile_service, @supabase/supabase-js, AuthContext, AuthContextValue, isSupabaseConfigured, supabase, AuthStore, useAuthStore

### Community 20 - "router.tsx"
Cohesion: 0.11
Nodes (5): ref_layouts_applayout, ref_layouts_publiclayout, ref_routes_protectedroute, router, routes

### Community 21 - "outfitImage.service.ts"
Cohesion: 0.19
Nodes (16): acceptedImageTypes, assertImageFile(), compressImage(), getOutfitImages(), getSignedUrl(), loadImage(), mapImage(), mapWithSignedUrls() (+8 more)

### Community 22 - "PRD"
Cohesion: 0.14
Nodes (17): Archive restore and permanent delete, Audit and activity, Invitation onboarding, PHASE-2.1, Progress calculation, Archive restore and permanent delete, Audit and activity, Event management (+9 more)

### Community 23 - "AddParticipantDialog.tsx"
Cohesion: 0.20
Nodes (7): ref_components_ui_input, ref_utils_participantvalidation, AddParticipantDialog(), AddParticipantDialogProps, roleSuggestions, candidates, participant

### Community 24 - "compilerOptions"
Cohesion: 0.13
Nodes (14): compilerOptions, allowJs, composite, isolatedModules, lib, module, moduleResolution, noEmit (+6 more)

### Community 25 - "permissions.ts"
Cohesion: 0.19
Nodes (10): can(), full, getPermissionLevel(), getRolePermissionMatrix(), managedPermissionResources, none, permissionActions, rolePermissions() (+2 more)

### Community 26 - "react"
Cohesion: 0.12
Nodes (12): ref_components_outfits_emptygallery, ref_components_outfits_gallerythumbnail, ref_components_outfits_imageuploader, ref_components_outfits_imageviewer, ref_components_outfits_shoppinglinkcard, ref_components_outfits_shoppinglinkform, ref_components_outfits_uploadprogress, react (+4 more)

### Community 27 - "permission.service.ts"
Cohesion: 0.24
Nodes (11): deactivateUser(), getPendingInvitationStatuses(), getProfiles(), getUsers(), InvitationRow, mapProfile(), mapUser(), MembershipRow (+3 more)

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

### Community 35 - "ref_utils_permissions"
Cohesion: 0.22
Nodes (6): ref_components_ui_select, ref_utils_permissions, actionLabels, PermissionEditorProps, resourceLabels, lucky

### Community 36 - "ShoppingLinkForm.tsx"
Cohesion: 0.17
Nodes (9): react-hook-form, zod, LinkFormValues, linkSchema, ShoppingLinkForm(), ShoppingLinkFormProps, LoginForm, LoginPage() (+1 more)

### Community 37 - "AppErrorBoundary.tsx"
Cohesion: 0.29
Nodes (3): AppErrorBoundary, AppErrorBoundaryProps, AppErrorBoundaryState

### Community 38 - "EventForm.tsx"
Cohesion: 0.29
Nodes (6): ref_components_ui_textarea, EventForm(), EventFormProps, eventFormSchema, EventFormValues, toValues()

### Community 39 - "ref_lib_supabase"
Cohesion: 0.09
Nodes (28): Added, ref_lib_supabase, signOut(), archiveEvent(), createEvent(), EventRow, getEvent(), getEvents() (+20 more)

### Community 40 - "OutfitForm.tsx"
Cohesion: 0.29
Nodes (6): ref_hookform_resolvers_zod, OutfitForm(), OutfitFormProps, outfitFormSchema, OutfitFormValues, toValues()

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

### Community 46 - "vitest"
Cohesion: 0.25
Nodes (3): ref_utils_shoppinglinks, vitest, ShoppingLinkCardProps

### Community 47 - "dependencies"
Cohesion: 0.20
Nodes (10): dependencies, @hookform/resolvers, react, react-dom, react-hook-form, react-router-dom, @supabase/supabase-js, @vitejs/plugin-react (+2 more)

### Community 48 - "permissionStore.ts"
Cohesion: 0.40
Nodes (5): ref_services_permission_service, getErrorMessage(), PermissionStore, usePermissionStore, UserStatusFilter

### Community 49 - "InviteUserDialog.tsx"
Cohesion: 0.33
Nodes (4): InviteForm, inviteSchema, InviteUserDialog(), InviteUserDialogProps

### Community 51 - "Phase 5.2 Todo"
Cohesion: 0.33
Nodes (5): Phase 5.2 Todo, Task 1: Event Data Foundation, Task 2: Events Dashboard And Create Flow, Task 3: Details, Edit, And Archive, Task 4: Verification And Release

### Community 52 - "App.tsx"
Cohesion: 0.40
Nodes (3): ref_app_providers_authprovider, ref_components_common_apperrorboundary, ref_routes_router

### Community 53 - "zustand"
Cohesion: 0.50
Nodes (3): zustand, UiStore, useUiStore

### Community 54 - "dashboardStore.ts"
Cohesion: 0.50
Nodes (4): ref_services_dashboard_service, DashboardStore, getErrorMessage(), useDashboardStore

### Community 55 - "eventStore.ts"
Cohesion: 0.50
Nodes (4): ref_services_event_service, EventStore, getErrorMessage(), useEventStore

### Community 56 - "InvitePage.tsx"
Cohesion: 0.08
Nodes (23): ref_app_providers_authcontext, ref_services_auth_service, ref_services_invitation_service, ref_store_authstore, ref_store_invitationstore, ref_store_weddingstore, classifyInviteError(), formatDate() (+15 more)

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

### Community 64 - "appUrl.ts"
Cohesion: 0.60
Nodes (3): AppUrlOptions, buildAppUrl(), normalizeBase()

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
Nodes (8): public.handle_new_user, public.wedding_memberships, public.weddings, on_auth_user_created, public.is_current_user_active(), public.is_super_admin(), public.wedding_role(), public.profiles

### Community 81 - "react-router-dom"
Cohesion: 0.16
Nodes (6): ref_components_events_eventstatusbadge, ref_components_outfits_outfitimageplaceholder, ref_components_outfits_outfitstatusbadge, react-router-dom, ref_utils_eventformat, EventHeaderProps

### Community 89 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, dev, format, lint, test, typecheck

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
- **382 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+377 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 654 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **45 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Changelog` connect `Changelog` to `outfit.service.ts`, `participant.service.ts`, `migrate.py`?**
  _High betweenness centrality (0.169) - this node is a cross-community bridge._
- **Why does `log` connect `log` to `SDD`, `Changelog`, `Plan`, `DATABASE`, `PRD`, `DECISIONS`, `CHANGELOG`, `MIGRATIONS`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `EventParticipantsSection.tsx`, `package.json`, `ref_utils_cx`, `ShoppingLinkForm.tsx`, `AppErrorBoundary.tsx`, `EventForm.tsx`, `OutfitForm.tsx`, `ref_components_ui_card`, `AppLayout.tsx`, `InviteUserDialog.tsx`, `ref_components_ui_errorstate`, `authStore.ts`, `router.tsx`, `AddParticipantDialog.tsx`, `InvitePage.tsx`, `Slot.tsx`, `main.tsx`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _382 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `EventParticipantsSection.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.045328399629972246 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09666666666666666 - nodes in this community are weakly interconnected._
- **Should `ref_utils_cx` be split into smaller, more focused modules?**
  _Cohesion score 0.05897435897435897 - nodes in this community are weakly interconnected._