# Architecture Decision Log

Owner: Software architecture. Newest decisions first. Do not delete entries; mark them superseded.

Canonical narrative also appears in [SDD.md](SDD.md) Section 12.

---

## DEC-009 – Versioned migrations are mandatory

- **Status:** Accepted
- **Date:** 2026-09-17
- **Context:** Phase 3.2. Phase 3 locked SQL in `/schema` (`001`–`004`). Manual Dashboard tables would drift from git, RLS, and seed Lucky.
- **Decision:** All database change goes through numbered `/schema/NNN_*.sql` files applied once by `scripts/migrate.py`. History records version, file name, timestamp, success, and checksum. Completed files are never re-run. Applied files are immutable; fixes are new versions. Table Editor DDL is forbidden.
- **Why:** The wedding domain (invitations, archive, caps of five, progress views) only stays correct if production is a replay of git. CI can apply the same files the family production project uses.
- **Consequences:** Developers need `psql` and `SUPABASE_DB_URL`. `005_example.sql` is the first forward file. Domain design in `001`–`004` is not redesigned.

---

## DEC-008 – Progress is computed in SQL views, never stored

- **Status:** Accepted
- **Date:** 2026-09-17
- **Context:** Phase 3. PRD Section 19 requires identical client and server percentages.
- **Decision:** Publish `v_outfit_progress`, `v_participant_progress`, `v_event_progress`, `v_wedding_progress` with the locked weights. No progress column on weddings or events.
- **Why:** A stored percentage will drift from outfit status. Views are the single formula.
- **Consequences:** The later React app reads views (or RPC wrappers) and does not reimplement weights.

---

## DEC-007 – Denormalize wedding_id and wedding-scoped reads

- **Status:** Accepted
- **Date:** 2026-09-17
- **Context:** Phase 3 RLS must isolate weddings without deep joins on every policy. PRD Member event visibility is “participate or granted”; Viewer grant is wedding membership.
- **Decision:** Copy `wedding_id` onto participants, outfits, images, and URLs. Member and Viewer **SELECT** all non-archived rows in weddings they belong to. Writes stay Admin/Super Admin except Member own outfits.
- **Why:** Cross-wedding leakage is the real security boundary. The app may still filter Member home to their events.
- **Consequences:** Policies stay maintainable. Slightly broader reads than the strictest reading of PRD Member event lists.

---

## DEC-006 – Soft-delete (archive) and audit history are mandatory

- **Status:** Accepted
- **Date:** 2026-09-17
- **Context:** Phase 2.1 blocking gaps. Family data is easy to remove by mistake. Questions such as “Who changed Kareena’s outfit?” have no consistent answer without stamps and activity types. Using permanent delete as the default would make Restore and history impossible once Phase 3 exists.
- **Decision:** Soft-delete is mandatory: Archive and Restore are the default removal path for planning records. Permanent Delete is Super Admin, generally only after archive, and always confirmed. Every conceptual record stores created by, created date, last modified by, and last modified date. A minimum activity vocabulary (including invitation accepted, outfit updated, status changed, image added/removed) is mandatory. This is not a schema and not an API.
- **Why:** Prevents irreversible data loss during implementation; forces frontend and backend to share one progress and history story; does not reverse Phase 1 roles, outfit caps, or status workflows.
- **Consequences:** Phase 3 Database Design must include archive state and audit fields. Hard delete of active outfits or events as the normal path is non-compliant. See [PRD.md](PRD.md) Sections 18 and 20 and [PHASE-2.1.md](PHASE-2.1.md).

---

## DEC-005 – Multi-wedding architecture from day one

- **Status:** Accepted
- **Date:** 2026-09-17
- **Context:** First use is Lucky and Kareena Wedding 2026, but the family will not get a second product for the next wedding.
- **Decision:** Model Wedding Project as a first-class isolation boundary with unlimited projects and unlimited users.
- **Why:** Avoids a one-off checklist that cannot be reused; permissions and storage isolation need a wedding boundary from the start.
- **Consequences:** Every event, participant, outfit, and image is beneath a wedding. Super Admin is product-level so new weddings can be created without engineering.

---

## DEC-004 – Remain PWA-ready and adopt PWA later

- **Status:** Accepted
- **Date:** 2026-09-17
- **Context:** The PRD requires mobile-first use and later installability. Native stores are out of scope.
- **Decision:** Do not implement a full PWA in Phase 2; constrain architecture so a PWA can be added without redesign.
- **Why:** Home-screen install and an offline shell help during wedding week; a desktop-only first UI would force a rewrite.
- **Consequences:** Navigation and loading rules must work on small viewports first. Offline writes stay out of scope until designed.

---

## DEC-003 – Host the static app on GitHub Pages

- **Status:** Accepted
- **Date:** 2026-09-17
- **Context:** The client is a static single-page app. Wedding data must not live in git as a database.
- **Decision:** Deploy the React build to GitHub Pages.
- **Why:** HTTPS static hosting and a simple operations model; backend remains Supabase.
- **Consequences:** Pages cannot hold secrets or private images. GitHub Pages is untrusted for family data.

---

## DEC-002 – Use Supabase as backend platform

- **Status:** Accepted
- **Date:** 2026-09-17
- **Context:** The app needs authentication, relational data, isolation, and private images without a custom server.
- **Decision:** Use Supabase for authentication, database, and storage.
- **Why:** Fits multi-user authorization and unlimited weddings/users; keeps private data off GitHub Pages.
- **Consequences:** The React UI is not the security boundary. Physical schema is Phase 3. No SQL in Phase 2.

---

## DEC-001 – Use React for the frontend

- **Status:** Accepted
- **Date:** 2026-09-17
- **Context:** Mobile-first web app that must later install as a PWA, with rich client state.
- **Decision:** Build the user interface in React.
- **Why:** Component model fits lists of events and outfits; static GitHub Pages deploy; TypeScript-friendly domain types; no native app in scope.
- **Consequences:** Routing and installability must stay compatible with static hosting.
