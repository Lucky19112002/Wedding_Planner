# Phase 2.1 – Documentation Revision

**Document type:** Blocking documentation fixes  
**Date:** 2026-09-17  
**Audience:** Product, architecture, engineering  
**Constraint:** No SQL, database schema, React code, APIs, or UI. Approved PRD Sections 1–16 and SDD Sections 1–14 are unchanged; this revision **adds** missing rules.

**Sources of truth updated:** [PRD.md](PRD.md) Sections 17–20, [SDD.md](SDD.md) Sections 10 and 15–18, [CHANGELOG.md](CHANGELOG.md), [DECISIONS.md](DECISIONS.md), [log.md](log.md).

---

## Fix 1 — Invitation and Onboarding System

### 1. Problem

The PRD defined roles and permissions (View, Create, Edit, Admin) and said users are fully dynamic, but it never defined **how a person joins a wedding**. Authentication could sign someone in without a membership path. Invite, pending, accept, reject, expiry, resend, and cancel were unnamed.

### 2. Why it matters

Without an invitation lifecycle, Phase 3 cannot model membership, Super Admin journeys (“Invite User”) stay incomplete, and family members have no safe way to receive Admin, Member, or Viewer access. Cross-wedding isolation depends on membership existing only after a controlled accept.

### 3. Revised requirement

Add PRD Section 17. Wedding-scoped Admin, Member, and Viewer access is created when a **valid invitation is accepted**. Lucky remains the seeded Super Admin and does not join by invite. Super Admin is never granted by invitation (existing BR-02).

Issuers: Super Admin (any wedding) or Admin (assigned wedding only). Delivery: email and/or unguessable secure link for the same pending invitation. Default expiry: 14 days from create or last resend. States: Pending, Accepted, Rejected, Expired, Cancelled. At most one Pending invite per email per wedding. After accept: Active membership with the invited role only.

### 4. Business rules

- Members and Viewers cannot send, resend, or cancel invitations.
- The **wedding owns** the invitation. Any current Super Admin or wedding Admin may resend or cancel, not only the original sender.
- Resend is allowed from Pending or Expired only; it resets expiry and invalidates the previous link.
- Cancel is allowed from Pending or Expired only, never after Accept.
- Reject creates no membership; a new invitation may be sent later.
- Pending is not membership: no wedding data until Accept.
- Existing users (another wedding) gain membership only; new emails create a user then membership.
- Deactivating the sender does not auto-cancel pending invitations.

### 5. Acceptance criteria

- A new family member cannot see Lucky and Kareena Wedding 2026 until they accept a Pending, non-expired invitation.
- Admin cannot invite to a wedding they are not assigned to.
- A sixth parallel Pending invite for the same email and wedding is refused.
- Expired links cannot be accepted until Resend.
- Super Admin promotion still cannot occur through an invitation.

---

## Fix 2 — Archive, Restore, and Permanent Delete Policy

### 1. Problem

Documents mentioned deactivation, cancel, and delete without distinguishing **Archive**, **Restore**, and **Permanent Delete**. Implementers could hard-delete outfits, events, or images and lose family history.

### 2. Why it matters

Wedding planning is error-prone. Removing a participant must not destroy the user. Removing an outfit must be reversible by default. Permanent delete without a policy will cause irreversible data loss in Phase 3.

### 3. Revised requirement

Add PRD Section 18. Three lifecycle operations apply conceptually to Wedding, User, Event, Participant, Outfit, Images, and Shopping Links.

Existing rules remain: user **deactivation** still blocks sign-in and keeps history visible (BR-16); event **Cancelled** and outfit **Dropped** remain statuses, not substitutes for archive.

Default “remove from planning” is **Archive**. Permanent Delete is Super Admin, generally only from Archived, with confirmation (FR-20).

### 4. Business rules

**Wedding:** Archive / Restore / Permanent Delete — Super Admin only. Archive preserves history and archives children (events through links and invitations). Permanent Delete of a wedding permanently deletes those children. User accounts are not deleted.

**User:** Product-wide off-switch remains **Deactivate** (Super Admin). Membership archive removes a person from one wedding. Permanent Delete of a user — Super Admin only, never the last Super Admin. Outfits on events remain with the participant policy.

**Event:** Archive / Restore — Super Admin or wedding Admin. Permanent Delete — Super Admin from Archived. Children (participants, outfits, images, links) follow the event.

**Participant:** Archive is the existing “remove participant” (user not deleted; outfits hidden from active planning). Restore — Super Admin or Admin. Permanent Delete — Super Admin from Archived; user account remains.

**Outfit:** Archive — Super Admin, Admin, or Member for own outfits (meaning of FR-20 delete). Restore — same actors for what they archived. Permanent Delete — Super Admin from Archived. Images and links follow the outfit.

**Images and shopping links:** Archive with parent outfit. Detach on an Active outfit remains an edit (“Image removed”) per SDD storage rules. After outfit archive, only Super Admin permanently deletes remaining media/links. External shop pages are never deleted.

Archived records do not enter **active** progress averages.

### 5. Acceptance criteria

- Implementing “delete outfit” as hard delete without archive violates this PRD.
- Restoring an archived event restores its archived participants and outfits unless they were permanently deleted.
- A Member cannot permanently delete another person’s outfit.
- Last Super Admin still cannot be removed (BR-03).
- No database schema is implied.

---

## Fix 3 — Progress Calculation Specification

### 1. Problem

The SDD described a dashboard and listed weights, but the PRD had no single specification. Wedding progress versus “completed events” was easy to misread. Frontend and backend could diverge.

### 2. Why it matters

Different averages (count Ready outfits vs weight every status; drop Completed events vs keep them) produce different percentages for the same wedding. Lucky and Kareena Wedding 2026 would show inconsistent readiness.

### 3. Revised requirement

Add PRD Section 19 as the **only** formula. SDD Section 10 uses the same weights. Progress is derived. Users never type a percentage.

### 4. Business rules

**Outfit (active, not archived)**

- Idea = 0%
- Shortlisted = 20%
- Ordered = 40%
- Received = 60%
- Altered = 80%
- Ready = 100%
- Dropped = not scored; omitted from averages

Images and URLs do not affect the percentage.

**Participant:** If no active non-dropped outfits, 0%. Else average of those OutfitProgress values.

**Event:** Cancelled events are excluded from the wedding average. If no active participants, EventProgress = 0%. Else average of ParticipantProgress.

**Wedding / overall completion %:** Average of EventProgress for all events that are not Cancelled and not Archived. **Completed** events stay in the average. They contribute their rolled-up outfit readiness, not an automatic 100%. Finishing outfits on a completed event raises overall wedding readiness.

Archived and permanently deleted records are omitted.

### 5. Acceptance criteria

- Client and server documentation cite the same table and the same averages.
- Dropped outfits never inflate or deflate the average except by omission.
- A wedding with one Completed event at 50% participant readiness and no other eligible events shows 50% overall, not 100%.
- Cancelled events do not pull wedding progress down or up.

---

## Fix 4 — Audit and Activity Requirements

### 1. Problem

NFR-08 allowed a later lightweight “who last changed outfit status” idea, but the PRD never required created/modified stamps or a minimum activity list. “Who changed Kareena’s outfit?” could not be specified consistently.

### 2. Why it matters

Without a vocabulary and visibility rules, Phase 3 will invent incompatible history. Members might see other families’ edits, or Super Admins might lack a complete trail.

### 3. Revised requirement

Add PRD Section 20. This is a **business** requirement for later implementation, not an implementation design. It does not change Phase 1’s decision to skip building audit in Phase 1.

Every conceptual record remembers Created by, Created date, Last modified by, Last modified date.

### 4. Business rules

Minimum activity types:

- User created
- Event created
- Event edited
- Outfit updated
- Status changed
- Image added
- Image removed
- Invitation accepted

Visibility:

- Super Admin — complete activity
- Admin — assigned wedding activity only
- Members (and Viewers on records they can View) — only activity on records they can already access

Activity never crosses weddings. Stamps and activity survive Archive and Restore. Permanent Delete need not keep full history of the deleted parent; a minimal deletion activity may remain for Super Admin.

### 5. Acceptance criteria

- Every entity in the information architecture is covered by the four stamps conceptually.
- The eight activity types are named and available for Phase 3 modeling.
- A Member cannot be specified to see activity on outfits they cannot View.
- No audit table, SQL, or API is defined in this phase.

---

## Architecture decision added

**DEC-006 — Soft-delete (archive) and audit history are mandatory.** Archive/Restore is the default removal path; Permanent Delete is restricted; created/modified stamps and the activity vocabulary are required so Phase 3 does not implement silent hard delete. Recorded in [DECISIONS.md](DECISIONS.md) and SDD Section 12.

---

## Overall acceptance (Phase 2.1)

- PRD Sections 1–16 text of approved requirements was not rewritten to reverse roles, caps of five, status workflows, or Lucky as seed Super Admin.
- PRD Sections 17–20 exist and cover all four blocking gaps.
- SDD points at those sections and keeps the same progress weights.
- CHANGELOG, DECISIONS, and log record this revision.

---

**Phase 1 Status: LOCKED**

**Phase 2 Status: LOCKED**

**Ready for Phase 3 – Database Design**
