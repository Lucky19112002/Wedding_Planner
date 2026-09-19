# Implementation Plan: Phase 5.2 Event Management

## Overview
Build the Event Management module on the existing React/Supabase foundation. The module adds protected event routes, isolated event services, an event store, event list/search/filter UI, create/edit forms, detail view, archive confirmation, and browser verification. No participant, outfit, invitation, schema, or migration work is included.

## Architecture Decisions
- Keep all Supabase event access in `src/services/event.service.ts`.
- Add event types to the existing domain model and keep status workflow helpers in `src/utils`.
- Use native date/time inputs and the existing UI primitives before adding any dependency.
- Keep participant and outfit sections as visual placeholders only.
- Use archive RPC only; no permanent delete UI or service.

## Task List

### Phase 1: Event Data Foundation
- [ ] Add Event types, status workflow helpers, event service, and event store.
- [ ] Verify lint/build after the foundation compiles.

### Phase 2: Events List And Create Flow
- [ ] Add `/app/events` and `/app/events/new`.
- [ ] Build dashboard, search, status filter, empty state, floating New Event action, and create form.
- [ ] Verify create event works against Supabase in browser.

### Phase 3: Details, Edit, And Archive
- [ ] Add `/app/events/:id` and `/app/events/:id/edit`.
- [ ] Build details page, edit form, optimistic update, status timeline, placeholders, and archive dialog.
- [ ] Verify edit and archive work against Supabase in browser.

### Phase 4: Polish, Docs, And Release
- [ ] Test desktop and mobile browser layouts.
- [ ] Update only `README.md`, `CHANGELOG.md`, and `docs/log.md`.
- [ ] Run lint, build, Graphify update, commit, and push `dev`.

## Risks and Mitigations
| Risk | Impact | Mitigation |
| --- | --- | --- |
| Confirmed/Completed requires participants in DB | Create/edit may fail before Phase 5.3 | Surface Supabase validation clearly and guide users to Draft/Planned until participants exist |
| Broad event read permissions differ from strict member event visibility | Members may see wedding rows allowed by current RLS | Follow existing DEC-007 and do not add fake client security |
| Premium UI scope balloons | Slow delivery and brittle components | Reuse current primitives, native controls, and simple cards |

## Open Questions
- None blocking. Event participants and outfits remain placeholders until later phases.
