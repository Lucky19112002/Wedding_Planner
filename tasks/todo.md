# Phase 5.2 Todo

## Task 1: Event Data Foundation
- [x] Event types added without `any`
- [x] Event service owns all Supabase event queries
- [x] Event store tracks events, selected event, loading, search, and filters
- [x] Status workflow helper prevents invalid transitions

## Task 2: Events Dashboard And Create Flow
- [x] `/app/events` route renders premium mobile-first dashboard
- [x] Upcoming/all events, search, filter, empty state, and floating New Event action work
- [x] `/app/events/new` creates events through Supabase
- [x] Form validates name, date, and end time after start time

## Task 3: Details, Edit, And Archive
- [x] `/app/events/:id` shows hero, info, venue, notes, timeline, audit fields, placeholders
- [x] `/app/events/:id/edit` pre-fills and updates event fields
- [x] Archive uses confirmation modal and `archive_event`
- [x] No permanent delete is exposed

## Task 4: Verification And Release
- [x] Browser-tested create, edit, archive, search, filter, desktop layout, mobile layout
- [x] Console has no errors or warnings
- [x] README.md updated
- [x] CHANGELOG.md updated
- [x] docs/log.md updated
- [x] Lint passes
- [x] Build passes
- [x] Graphify updated
- [ ] Commit and push dev
