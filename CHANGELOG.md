# Changelog

Newest entries first. This root changelog records repository and release milestones. Detailed product documentation changes remain in `/docs`.

## [v1.0.4] - 2026-09-20

### Added

- Event + user permission model with viewer-safe menu visibility and route access.
- Clothing menu for viewer and admin workflows, including event and person filters.
- Single Add Outfit flow with details, images, and reference URLs saved together.
- Admin-only outfit owner switching with live Supabase RPC enforcement.

### Changed

- Events page now uses one date-sorted list and shows outfit counts on event cards.
- Login/loading guards now wait for profile and wedding context before rendering protected pages.
- Graphify project graph was safely regenerated with semantic document nodes preserved.

### Verified

- Migration `013_switch_outfit_owner.sql` applied with `Pending: (none)`.
- `pnpm install`, `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, and `pnpm run build` passed.
- Browser checks covered admin and viewer clothing/outfit permission behavior.

---

## [v1.0.3] - 2026-09-19

### Fixed

- Invited first-time users are created through a token-bound backend RPC with confirmed email, so onboarding no longer stops at `Email not confirmed`.
- The invite page still keeps email locked to the token, preserves existing-user sign-in, and accepts the invitation only after a successful invited account sign-in.

### Verified

- Migration `010_confirm_invited_signup.sql` applied with `Pending: (none)`.
- Added regression coverage for the invited-account RPC path.

---

## [v1.0.2] - 2026-09-19

### Fixed

- Brand-new invited users can now create an account from the invitation page.
- Invitation pages now show wedding name, invited email, role, status, and expiry before authentication.
- New invited accounts automatically accept the invitation and enter the app after signup.

### Verified

- Migrations `008_invitation_onboarding_details.sql` and `009_invitation_details_wedding_date.sql` applied with `Pending: (none)`.
- Lint, tests, and build were run for the onboarding hotfix.

---

## [v1.0.1-hotfix] - 2026-09-19

### Fixed

- Pending invitations now refresh from Supabase immediately after a successful invite creation.
- Generated invite links now include the configured Vite base path for GitHub Pages while keeping localhost and root-domain deployments clean.

### Verified

- Added URL regression coverage for GitHub Pages and root-base invite links.
- Ran lint, tests, and build for the hotfix.

---

## [v1.0.1-production-seed] - 2026-09-19

### Added

- Migration `007_seed_production_wedding.sql` to reset application data and seed the real `K&L Weds` wedding.
- Production Auth/Profile users for Lucky, Kareena, and Mom.
- Five production events with Lucky/Kareena participant assignments.

### Verified

- `python3 scripts/migrate.py` applied migration `007`.
- Re-running the migration runner reports `Pending: (none)`.
- Direct idempotency rerun of migration `007` keeps exact counts: 1 wedding, 3 users, 5 events, 9 participants, 0 invitations, and 0 outfits.

### Notes

- No schema, RLS, functions, views, storage bucket, locked docs, or business rules were changed.

---

## [v1.0.0-stable] - 2026-09-18

### Added

- GitHub Pages CI/CD workflow for production deployment from `main`.
- Vite repository-base configuration for GitHub Pages asset paths.
- SPA refresh fallback through `404.html` artifact generation.
- Stable release documentation for Wedding Planner v1.0.0.

### Released

- Dashboard
- Invitations
- User Management
- Outfit Management
- Progress Tracking
- Supabase Integration
- Mobile-first UI
- Automated Database Migrations

### Verified

- `pnpm run lint`
- `pnpm run test`
- `pnpm run build`
- GitHub Pages production-base build

### Notes

- No PRD, SDD, DATABASE, MIGRATIONS, SQL schema, or business-rule changes were made.

---

## [v1.0.0-production-ready] - 2026-09-18

### Added

- Phase 6 production dashboard polish with today task count, pending invitations, and family member summary.
- Route-level lazy loading with React Suspense for public and protected pages.
- Shopping link copy action and delete confirmation.
- Reference image delete confirmation and clearer multi-image upload guidance.

### Changed

- Dashboard continues to use existing SQL progress views for percentages while adding lightweight Supabase summaries.
- Initial production bundle is split by route; the previous large single JS chunk warning is resolved.

### Verified

- `pnpm run typecheck`
- `pnpm run lint`
- `pnpm run test`
- `pnpm run build`

### Notes

- No PRD, SDD, DATABASE, MIGRATIONS, SQL schema, or business-rule changes were made.

---

## [v0.5.7-invitations-permissions] - 2026-09-18

### Added

- Phase 5.7 Invitations & Permission Management module.
- `/app/users` user management page with search, role filters, active/deactivated filters, profile cards, role management, and role-derived permission matrix.
- Invite User dialog with email validation, role selection, duplicate member prevention, pending invitation handling, and secure invite-link generation.
- Pending invitations section with resend and cancel actions using the existing Supabase invitation RPC workflow.
- Public `/invite/:token` response page for authenticated invite acceptance/rejection and terminal invite states.
- Invitation and permission services, Zustand stores, reusable user-management components, and permission matrix tests.

### Changed

- App navigation now includes Users.
- Permission labels and role-derived capability matrix are shared through the existing permission utility.

### Verified

- Browser-tested user management, invitation creation, duplicate pending-invite prevention, resend, cancel, invite state handling, role updates, permission matrix rendering, last-Super-Admin deactivation guard, and mobile layout.
- Live Supabase invitation acceptance was verified after migration `006`.
- `npx pnpm@latest run lint`
- `npx pnpm@latest run build`
- `npx pnpm@latest run test`

### Notes

- No PRD, SDD, DATABASE, MIGRATIONS, locked baseline migrations, or business rules were changed.

---

## [v0.3.3.2-migration-reconciliation] - 2026-09-18

### Fixed

- Added production baseline reconciliation for applied migrations `001` through `005` without editing live migration metadata.
- Added `006_fix_pgcrypto_invitation.sql` to repair invitation token hashing with a fully qualified `pgcrypto` call.

### Verified

- `python3 scripts/migrate.py` reconciles `001` through `005`, applies `006`, and reports `Pending: (none)`.
- Verified invitation creation, acceptance, membership creation, accepted-token invalidation, and duplicate acceptance prevention against live Supabase.

### Notes

- No business rules, existing baseline migration contents, tables, or schema metadata were manually edited.

---

## [v0.5.6-progress-dashboard] - 2026-09-18

### Added

- Phase 5.6 Progress Dashboard home screen.
- Dashboard service that reads existing Supabase progress views and active wedding tables without schema changes.
- Dashboard Zustand store with dashboard state, loading, refresh, and error handling.
- Reusable dashboard components for progress ring, summary cards, event progress, participant insights, outfit analytics, upcoming timeline, quick actions, and skeleton loading.
- Dashboard metric tests for readiness labels, clamped progress, day labels, and pending outfit status handling.

### Changed

- `/app` now shows wedding readiness analytics instead of the Phase 5.1 profile summary.

### Verified

- Browser-tested dashboard load, refresh, progress values against seeded Supabase QA data, event-card navigation, mobile layout, tablet layout, desktop layout, and clean console.
- `npx pnpm@latest run lint`
- `npx pnpm@latest run build`
- `npx pnpm@latest run test`

### Notes

- No schema, migration, PRD, SDD, DATABASE, or business-rule changes were made.

---

## [v0.5.5-images-shopping-links] - 2026-09-18

### Added

- Phase 5.5 Images & Shopping Links module.
- Private outfit image service with upload, delete, reorder, primary image ordering, and signed URL generation.
- Outfit image Zustand store with image list, upload progress, loading, error, and optimistic ordering state.
- Shopping link service and store for create, update, delete, validation, and active-link loading.
- Premium Outfit Details gallery with hero image, thumbnail strip, full-screen preview, upload panel, delete, reorder, and primary controls.
- Shopping link cards with provider detection, domain display, open/edit/delete actions, and add/edit form.
- Unit tests for shopping URL validation and provider detection.

### Changed

- Outfit list cards now render signed primary images when a reference exists.
- Outfit Details now manages real image gallery and shopping links instead of Phase 5.5 placeholders.

### Verified

- Browser-tested outfit image signed rendering, five-image cap rejection, reorder, set primary, delete, invalid URL rejection, add five links, five-link cap rejection, edit link, delete link, and open link.
- Browser console had no warnings or errors.
- `npx pnpm@latest run lint`
- `npx pnpm@latest run build`
- `npx pnpm@latest run test`

### Notes

- No schema, migration, PRD, SDD, DATABASE, or business-rule changes were made.

---

## [v0.5.4-outfit-management] - 2026-09-18

### Added

- Phase 5.4 Outfit Management module.
- Outfit service with `getOutfits`, `getOutfit`, `createOutfit`, `updateOutfit`, and `archiveOutfit`.
- Outfit Zustand store with outfits, selected outfit, loading, saving, and filter state.
- Protected outfit routes: `/app/outfits/:id`, `/app/outfits/:id/edit`, and `/app/participants/:participantId/outfits/new`.
- Participant-scoped outfit sections inside Event Details.
- Reusable outfit UI components for cards, form, status badge, timeline, gallery placeholder, empty state, and archive dialog.
- Outfit workflow tests for valid transitions, final Ready state, and Dropped progress exclusion.

### Changed

- Event Details now renders outfit planning beneath each participant instead of a generic event-level placeholder.
- Participant outfit counts now refresh from active outfit rows.

### Verified

- Browser-tested create outfit, quantity validation, edit outfit, status transition options, archive outfit, navigation, desktop layout, and mobile layout.
- Browser console had no warnings or errors.
- `npx pnpm@latest run lint`
- `npx pnpm@latest run build`
- `npx pnpm@latest run test`

### Notes

- Image upload/gallery management and shopping-link editing remain Phase 5.5. Phase 5.4 displays existing image/link counts and placeholders without schema changes.

---

## [v0.5.3-participant-management] - 2026-09-18

### Added

- Phase 5.3 Participant Management module inside Event Details.
- Participant service with `getParticipants`, `getParticipantCandidates`, `addParticipant`, `updateParticipant`, and `archiveParticipant`.
- Participant Zustand store with participants, candidates, loading, saving, selected participant, and search state.
- Reusable participant UI components: avatar, role badge, card, list, empty state, add/edit dialog, remove dialog, and event participants section.
- Vitest test runner plus participant duplicate/search validation tests.

### Changed

- Event Details now shows live participants instead of a placeholder while keeping Outfits as a Phase 5.4 placeholder.
- Participant candidate loading blocks users already assigned to the event, including archived assignments preserved by the locked schema.

### Verified

- Browser-tested add participant, edit participant role, remove/archive participant, duplicate prevention, member search, desktop layout, mobile layout, and navigation.
- Browser console had no warnings or errors.
- `npx pnpm@latest run lint`
- `npx pnpm@latest run build`
- `npx pnpm@latest run test`

### Notes

- Participant notes were not persisted because the locked live schema has no participant notes column; schema and migrations were intentionally not modified.

---

## [v0.5.2-event-management] - 2026-09-18

### Added

- Phase 5.2 Event Management module.
- Event service with `getEvents`, `getEvent`, `createEvent`, `updateEvent`, and `archiveEvent`.
- Event Zustand store with events, selected event, loading, saving, search, and status filter state.
- Protected event routes: `/app/events`, `/app/events/new`, `/app/events/:id`, and `/app/events/:id/edit`.
- Premium responsive event dashboard, event cards, status badges, form, details header, timeline, empty state, and archive dialog.

### Changed

- App navigation now includes Events.
- Tailwind CSS entrypoint now uses the Tailwind v4 CSS-first import so generated utilities render correctly in browser.

### Verified

- Browser-tested create, edit, archive, search, filter, desktop layout, and mobile layout.
- Browser console had no warnings or errors.
- `npx pnpm@latest run lint`
- `npx pnpm@latest run build`

---

## [v0.5.1-user-wedding-membership] - 2026-09-18

### Added

- Phase 5.1 user, wedding, and membership module.
- Profile, wedding, membership, and auth services with Supabase queries isolated from components.
- Expanded auth and wedding stores for profile loading, membership loading, active wedding selection, and local wedding restore.
- Responsive protected app shell with sidebar, top header, wedding switcher, profile block, and logout action.
- Reusable permission helpers plus loading, error, unauthorized, and empty states.
- Phase implementation plan and todo files under `tasks/`.

### Changed

- `/app` now shows the first business-module shell instead of the React foundation placeholder.
- README documents the current Phase 5.1 app surface.

### Verified

- `npx pnpm@latest run lint`
- `npx pnpm@latest run build`

---

## [v0.4.0-react-foundation] - 2026-09-18

### Added

- React, Vite, TypeScript, Tailwind CSS, React Router, Supabase JS, Zustand, React Hook Form, and Zod foundation.
- Supabase client, auth provider, session persistence, protected `/app` route, login route, logout handler, and loading state.
- Reusable UI primitives: Button, Card, Input, TextArea, Select, Badge, Avatar, Loader, Modal, and EmptyState.
- Public and app layouts with placeholder pages only.
- Empty auth, UI, and wedding stores.
- PWA manifest, favicon, and icon asset.

### Changed

- README setup now includes frontend install, build, lint, and public Supabase environment variables.

---

## [v0.3.4-repository-workflow] - 2026-09-18

### Added

- Root README with architecture, setup, branch workflow, commit convention, release workflow, roadmap, and documentation links.
- MIT license.
- Repository workflow standards for `main`, `dev`, Conventional Commits, and phase release tags.

### Changed

- Updated `.gitignore` to keep generated dependency/build output out of Git while allowing the private repo to track `.env`.

### Security

- Repository is private because `.env` is tracked for restore on a new PC.
