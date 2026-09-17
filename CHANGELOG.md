# Changelog

Newest entries first. This root changelog records repository and release milestones. Detailed product documentation changes remain in `/docs`.

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
