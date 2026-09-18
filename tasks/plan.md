# Implementation Plan: Phase 5.1 User, Wedding & Membership Module

## Overview
Implement the first business module on top of the existing React/Supabase foundation: authenticated app shell, profile loading, wedding membership loading, active wedding selection, permission helpers, and reusable loading/error/unauthorized states. No event, participant, outfit, invitation, dashboard, or progress UI.

## Architecture Decisions
- Keep Supabase access isolated in small services under `src/services`.
- Store only session, profile, memberships, active wedding, and shell UI state.
- Persist only the active wedding id in localStorage; derive role and permissions from loaded membership.
- Use existing UI primitives and native controls before adding dependencies.

## Task List

### Phase 1: Data Contracts and Services
- [ ] Add strict TypeScript domain types for profiles, weddings, memberships, and permissions.
- [ ] Add auth, profile, wedding, and membership services.

### Phase 2: State and Routing
- [ ] Expand auth and wedding stores to load profile/memberships and choose an active wedding.
- [ ] Add hooks/utilities for current profile, active wedding, membership role, and permission checks.
- [ ] Keep protected routing session-aware and add unauthorized/empty/error states.

### Phase 3: App Shell
- [ ] Replace placeholder `/app` shell with responsive sidebar, header, wedding switcher, profile panel, and logout.
- [ ] Keep home content scoped to user/wedding summary only.

### Phase 4: Verification and Docs
- [ ] Update README.md, CHANGELOG.md, and docs/log.md.
- [ ] Run lint, typecheck/build, refresh Graphify, commit, and push dev.

## Risks and Mitigations
| Risk | Impact | Mitigation |
| --- | --- | --- |
| RLS hides rows for unauthenticated/deactivated users | User sees empty/error shell | Explicit unauthorized/empty screens |
| Persisted wedding id becomes invalid | Wrong context after membership changes | Validate against loaded memberships and auto-select fallback |
| Business module grows into later phases | Scope creep | No event/outfit/invitation/progress queries or widgets |

## Open Questions
- None blocking; use current Supabase schema and locked product rules.

