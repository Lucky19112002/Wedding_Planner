# Changelog

Newest entries first. This root changelog records repository and release milestones. Detailed product documentation changes remain in `/docs`.

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
