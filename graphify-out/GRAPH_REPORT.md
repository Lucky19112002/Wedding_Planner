# Graph Report - Wedding_Planner  (2026-09-20)

## Corpus Check
- 180 files · ~76,762 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 11 file(s) not represented in the graph (top: (none) 10, .css 1)

## Summary
- 1049 nodes · 1603 edges · 86 communities (60 shown, 26 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 40 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- EventParticipantsSection.tsx
- event.service.ts
- package.json
- ref_utils_cx
- Changelog
- migrate.py
- domain.ts
- AppHomePage.tsx
- dashboard.service.ts
- outfit.service.ts
- ref_components_ui_card
- ref_types_domain
- invitation.service.ts
- participant.service.ts
- react
- compilerOptions
- DATABASE
- devDependencies
- OutfitCreatePage
- users/index.ts
- router.tsx
- outfitImage.service.ts
- PRD
- ClothingPage.tsx
- compilerOptions
- permissions.ts
- outfits/index.ts
- permission.service.ts
- DECISIONS
- CHANGELOG
- MIGRATIONS
- log
- Implementation Plan: Phase 5.2 Event Management
- SDD
- manifest.json
- UserCard.tsx
- ref_components_ui_button
- AppErrorBoundary.tsx
- [v1.0.0-production-ready] - 2026-09-18
- ref_lib_supabase
- [v0.5.7-invitations-permissions] - 2026-09-18
- UsersPage
- eventWorkflow.ts
- outfitWorkflow.ts
- shoppingLinks.ts
- Plan
- [v0.5.6-progress-dashboard] - 2026-09-18
- [v0.5.5-images-shopping-links] - 2026-09-18
- zustand
- [v1.0.1-production-seed] - 2026-09-19
- Phase 5.2 Todo
- App.tsx
- [v0.5.1-user-wedding-membership] - 2026-09-18
- [v0.3.4-repository-workflow] - 2026-09-18
- [v0.3.3.2-migration-reconciliation] - 2026-09-18
- InvitePage.tsx
- PermissionEditor.tsx
- OutfitDetailPage
- [v1.0.2] - 2026-09-19
- [v1.0.1-hotfix] - 2026-09-19
- UserEmptyState.tsx
- main.tsx
- tsconfig.json
- AGENTS.md
- auth.ts
- ref_utils_eventformat
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
1. `react` - 33 edges
2. `react-router-dom` - 26 edges
3. `SDD` - 21 edges
4. `DATABASE` - 20 edges
5. `compilerOptions` - 19 edges
6. `PRD` - 19 edges
7. `log` - 19 edges
8. `Changelog` - 17 edges
9. `DECISIONS` - 17 edges
10. `CHANGELOG` - 15 edges

## Surprising Connections (you probably didn't know these)
- `Added` --references--> `main()`  [INFERRED]
  CHANGELOG.md → scripts/migrate.py
- `Setup` --references--> `psql()`  [INFERRED]
  README.md → scripts/migrate.py
- `Added` --references--> `main()`  [INFERRED]
  CHANGELOG.md → scripts/migrate.py
- `Branch Workflow` --references--> `main()`  [INFERRED]
  README.md → scripts/migrate.py
- `Release Workflow` --references--> `main()`  [INFERRED]
  README.md → scripts/migrate.py

## Import Cycles
- None detected.

## Communities (86 total, 26 thin omitted)

### Community 0 - "EventParticipantsSection.tsx"
Cohesion: 0.05
Nodes (20): ref_components_outfits_participantoutfitssection, ref_components_participants_addparticipantdialog, ref_components_participants_participantavatar, ref_components_participants_participantcard, ref_components_participants_participantemptystate, ref_components_participants_participantlist, ref_components_participants_participantrolebadge, ref_components_participants_removeparticipantdialog (+12 more)

### Community 1 - "event.service.ts"
Cohesion: 0.23
Nodes (17): Added, Changed, [v0.5.2-event-management] - 2026-09-18, Verified, archiveEvent(), countByEvent(), createEvent(), EventRow (+9 more)

### Community 2 - "package.json"
Cohesion: 0.05
Nodes (42): dependencies, @hookform/resolvers, react, react-dom, react-hook-form, react-router-dom, @supabase/supabase-js, @vitejs/plugin-react (+34 more)

### Community 3 - "ref_utils_cx"
Cohesion: 0.06
Nodes (16): ref_components_ui_slot, ref_utils_cx, ref_utils_eventworkflow, badgeClass, AvatarProps, ButtonProps, EmptyStateProps, ErrorStateProps (+8 more)

### Community 4 - "Changelog"
Cohesion: 0.25
Nodes (7): Added, Changed, Changelog, Fixed, [v0.4.0-react-foundation] - 2026-09-18, [v1.0.3] - 2026-09-19, Verified

### Community 5 - "migrate.py"
Cohesion: 0.08
Nodes (34): Added, Notes, Released, [v1.0.0-stable] - 2026-09-18, Verified, CompletedProcess, hashlib, os (+26 more)

### Community 6 - "domain.ts"
Cohesion: 0.06
Nodes (35): DashboardData, DashboardEventProgress, DashboardOutfitAnalytics, DashboardParticipantInsight, DashboardSummary, DashboardTimelineEvent, Event, EventInput (+27 more)

### Community 7 - "AppHomePage.tsx"
Cohesion: 0.20
Nodes (5): ref_components_dashboard, ref_components_ui_unauthorizedstate, ref_hooks_useprofile, ref_hooks_useweddingcontext, ref_store_dashboardstore

### Community 8 - "dashboard.service.ts"
Cohesion: 0.09
Nodes (24): ref_utils_outfitworkflow, ref_utils_participantvalidation, vitest, buildEventProgress(), buildParticipantInsights(), buildTimeline(), countBy(), EventProgressRow (+16 more)

### Community 9 - "outfit.service.ts"
Cohesion: 0.14
Nodes (26): Added, Changed, Notes, [v0.5.4-outfit-management] - 2026-09-18, Verified, archiveOutfit(), countByOutfit(), createOutfit() (+18 more)

### Community 10 - "ref_components_ui_card"
Cohesion: 0.10
Nodes (8): ref_components_outfits_shoppinglinkcard, ref_components_outfits_shoppinglinkform, ref_components_ui_avatar, ref_components_ui_card, ref_store_shoppinglinkstore, colorByStatus, actions, SummaryCardProps

### Community 11 - "ref_types_domain"
Cohesion: 0.10
Nodes (11): ref_components_events_eventcard, ref_components_outfits_outfitimageplaceholder, ref_components_outfits_outfitstatusbadge, ref_components_ui_modal, ref_types_domain, ref_utils_outfitformat, ArchiveDialogProps, ArchiveOutfitDialogProps (+3 more)

### Community 12 - "invitation.service.ts"
Cohesion: 0.11
Nodes (31): ref_utils_appurl, acceptInvitation(), buildInviteUrl(), cancelInvitation(), createInvitedAccountAndAccept(), generateInviteToken(), getErrorMessage(), getInvitationDetails() (+23 more)

### Community 13 - "participant.service.ts"
Cohesion: 0.18
Nodes (20): Added, Changed, Notes, [v0.5.3-participant-management] - 2026-09-18, Verified, addParticipant(), archiveParticipant(), byId() (+12 more)

### Community 14 - "react"
Cohesion: 0.12
Nodes (20): ref_components_events, ref_components_outfits, ref_components_participants, ref_components_ui_errorstate, ref_components_ui_loader, ref_hooks_usepermission, react, react-router-dom (+12 more)

### Community 15 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, allowJs, allowSyntheticDefaultImports, composite, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx (+12 more)

### Community 16 - "DATABASE"
Cohesion: 0.12
Nodes (19): API, Archive RPCs, Invitation RPCs, Private outfit storage, Row Level Security, Supabase PostgREST API, Archive lifecycle, Audit stamps (+11 more)

### Community 17 - "devDependencies"
Cohesion: 0.11
Nodes (19): devDependencies, autoprefixer, eslint, eslint-config-prettier, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals (+11 more)

### Community 18 - "OutfitCreatePage"
Cohesion: 0.50
Nodes (3): OutfitCreatePage(), handleSubmit(), validateReferences()

### Community 19 - "users/index.ts"
Cohesion: 0.29
Nodes (6): ref_components_users_deactivateuserdialog, ref_components_users_inviteuserdialog, ref_components_users_pendinginvitationssection, ref_components_users_permissioneditor, ref_components_users_usercard, ref_components_users_useremptystate

### Community 20 - "router.tsx"
Cohesion: 0.10
Nodes (5): ref_layouts_applayout, ref_layouts_publiclayout, ref_routes_protectedroute, router, routes

### Community 21 - "outfitImage.service.ts"
Cohesion: 0.19
Nodes (16): acceptedImageTypes, assertImageFile(), compressImage(), getOutfitImages(), getSignedUrl(), loadImage(), mapImage(), mapWithSignedUrls() (+8 more)

### Community 22 - "PRD"
Cohesion: 0.14
Nodes (17): Archive restore and permanent delete, Audit and activity, Invitation onboarding, PHASE-2.1, Progress calculation, Archive restore and permanent delete, Audit and activity, Event management (+9 more)

### Community 23 - "ClothingPage.tsx"
Cohesion: 0.16
Nodes (10): ref_components_ui_input, ref_components_users, ref_services_event_service, ref_store_permissionstore, AddParticipantDialog(), AddParticipantDialogProps, roleSuggestions, ClothingPage() (+2 more)

### Community 24 - "compilerOptions"
Cohesion: 0.13
Nodes (14): compilerOptions, allowJs, composite, isolatedModules, lib, module, moduleResolution, noEmit (+6 more)

### Community 25 - "permissions.ts"
Cohesion: 0.19
Nodes (10): can(), full, getPermissionLevel(), getRolePermissionMatrix(), managedPermissionResources, none, permissionActions, rolePermissions() (+2 more)

### Community 26 - "outfits/index.ts"
Cohesion: 0.06
Nodes (12): ref_components_outfits_emptygallery, ref_components_outfits_gallerythumbnail, ref_components_outfits_imageuploader, ref_components_outfits_imageviewer, ref_components_outfits_outfitcard, ref_components_outfits_uploadprogress, ref_store_outfitimagestore, ref_utils_shoppinglinks (+4 more)

### Community 27 - "permission.service.ts"
Cohesion: 0.16
Nodes (14): deactivateUser(), EventPermissionRow, getMyEventPermission(), getMyParticipantEventPermission(), getPendingInvitationStatuses(), getProfiles(), getUsers(), InvitationRow (+6 more)

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

### Community 35 - "UserCard.tsx"
Cohesion: 0.33
Nodes (5): ref_utils_permissions, formatDate(), UserCard(), UserCardProps, lucky

### Community 36 - "ref_components_ui_button"
Cohesion: 0.14
Nodes (8): ref_components_ui_button, ref_components_ui_emptystate, ref_components_ui_select, ref_hooks_useauth, ref_store_uistore, LoginForm, LoginPage(), loginSchema

### Community 37 - "AppErrorBoundary.tsx"
Cohesion: 0.29
Nodes (3): AppErrorBoundary, AppErrorBoundaryProps, AppErrorBoundaryState

### Community 38 - "[v1.0.0-production-ready] - 2026-09-18"
Cohesion: 0.40
Nodes (5): Added, Changed, Notes, [v1.0.0-production-ready] - 2026-09-18, Verified

### Community 39 - "ref_lib_supabase"
Cohesion: 0.05
Nodes (29): ref_app_providers_authcontext, ref_lib_supabase, ref_services_auth_service, ref_services_profile_service, ref_store_authstore, ref_store_weddingstore, @supabase/supabase-js, AuthContext (+21 more)

### Community 40 - "[v0.5.7-invitations-permissions] - 2026-09-18"
Cohesion: 0.40
Nodes (5): Added, Changed, Notes, [v0.5.7-invitations-permissions] - 2026-09-18, Verified

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

### Community 46 - "[v0.5.6-progress-dashboard] - 2026-09-18"
Cohesion: 0.40
Nodes (5): Added, Changed, Notes, [v0.5.6-progress-dashboard] - 2026-09-18, Verified

### Community 47 - "[v0.5.5-images-shopping-links] - 2026-09-18"
Cohesion: 0.40
Nodes (5): Added, Changed, Notes, [v0.5.5-images-shopping-links] - 2026-09-18, Verified

### Community 48 - "zustand"
Cohesion: 0.05
Nodes (37): ref_services_dashboard_service, ref_services_invitation_service, ref_services_membership_service, ref_services_outfitimage_service, ref_services_participant_service, ref_services_shoppinglink_service, ref_services_wedding_service, zustand (+29 more)

### Community 49 - "[v1.0.1-production-seed] - 2026-09-19"
Cohesion: 0.50
Nodes (4): Added, Notes, [v1.0.1-production-seed] - 2026-09-19, Verified

### Community 51 - "Phase 5.2 Todo"
Cohesion: 0.33
Nodes (5): Phase 5.2 Todo, Task 1: Event Data Foundation, Task 2: Events Dashboard And Create Flow, Task 3: Details, Edit, And Archive, Task 4: Verification And Release

### Community 52 - "App.tsx"
Cohesion: 0.40
Nodes (3): ref_app_providers_authprovider, ref_components_common_apperrorboundary, ref_routes_router

### Community 53 - "[v0.5.1-user-wedding-membership] - 2026-09-18"
Cohesion: 0.50
Nodes (4): Added, Changed, [v0.5.1-user-wedding-membership] - 2026-09-18, Verified

### Community 54 - "[v0.3.4-repository-workflow] - 2026-09-18"
Cohesion: 0.50
Nodes (4): Added, Changed, Security, [v0.3.4-repository-workflow] - 2026-09-18

### Community 55 - "[v0.3.3.2-migration-reconciliation] - 2026-09-18"
Cohesion: 0.50
Nodes (4): Fixed, Notes, [v0.3.3.2-migration-reconciliation] - 2026-09-18, Verified

### Community 56 - "InvitePage.tsx"
Cohesion: 0.06
Nodes (37): ref_components_ui_textarea, ref_hookform_resolvers_zod, react-hook-form, ref_store_invitationstore, zod, EventForm(), EventFormProps, eventFormSchema (+29 more)

### Community 57 - "PermissionEditor.tsx"
Cohesion: 0.67
Nodes (3): getLevel(), PermissionEditor(), PermissionEditorProps

### Community 59 - "[v1.0.2] - 2026-09-19"
Cohesion: 0.67
Nodes (3): Fixed, [v1.0.2] - 2026-09-19, Verified

### Community 60 - "[v1.0.1-hotfix] - 2026-09-19"
Cohesion: 0.67
Nodes (3): Fixed, [v1.0.1-hotfix] - 2026-09-19, Verified

### Community 63 - "main.tsx"
Cohesion: 0.50
Nodes (3): ref_app_app, ref_react_dom_client, ref_styles_index_css

### Community 81 - "ref_utils_eventformat"
Cohesion: 0.19
Nodes (4): ref_components_events_eventstatusbadge, ref_utils_dashboardmetrics, ref_utils_eventformat, EventHeaderProps

## Knowledge Gaps
- **386 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+381 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 600 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Changelog` connect `Changelog` to `event.service.ts`, `migrate.py`, `[v1.0.0-production-ready] - 2026-09-18`, `[v0.5.7-invitations-permissions] - 2026-09-18`, `outfit.service.ts`, `participant.service.ts`, `[v0.5.6-progress-dashboard] - 2026-09-18`, `[v0.5.5-images-shopping-links] - 2026-09-18`, `[v1.0.1-production-seed] - 2026-09-19`, `[v0.5.1-user-wedding-membership] - 2026-09-18`, `[v0.3.4-repository-workflow] - 2026-09-18`, `[v0.3.3.2-migration-reconciliation] - 2026-09-18`, `[v1.0.2] - 2026-09-19`, `[v1.0.1-hotfix] - 2026-09-19`?**
  _High betweenness centrality (0.265) - this node is a cross-community bridge._
- **Why does `log` connect `log` to `SDD`, `Changelog`, `Plan`, `DATABASE`, `PRD`, `DECISIONS`, `CHANGELOG`, `MIGRATIONS`?**
  _High betweenness centrality (0.138) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `EventParticipantsSection.tsx`, `package.json`, `ref_utils_cx`, `UserCard.tsx`, `AppErrorBoundary.tsx`, `ref_components_ui_button`, `ref_lib_supabase`, `AppHomePage.tsx`, `ref_components_ui_card`, `router.tsx`, `ClothingPage.tsx`, `InvitePage.tsx`, `outfits/index.ts`, `Slot.tsx`, `main.tsx`?**
  _High betweenness centrality (0.107) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _386 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `EventParticipantsSection.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05263157894736842 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.04927536231884058 - nodes in this community are weakly interconnected._
- **Should `ref_utils_cx` be split into smaller, more focused modules?**
  _Cohesion score 0.05897435897435897 - nodes in this community are weakly interconnected._