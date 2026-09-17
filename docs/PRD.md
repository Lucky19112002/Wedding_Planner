# Wedding Planner – Phase 1 Product Requirements Document

**Product:** Wedding Planner  
**Document type:** Product Requirements Document (PRD)  
**Phase:** 1 – Documentation only  
**Audience:** Product, design, and engineering  
**Initial wedding:** Lucky and Kareena  
**Seeded Super Admin:** Lucky  

This phase delivers documentation only. It does not specify code, user interface layouts, SQL, or database schema.

---

## 1. Executive Summary

Wedding Planner is a **mobile-first web application** for coordinating a wedding across family members. The first production use is **Lucky and Kareena’s wedding**. The product must not be a one-off personal checklist: it must support **multiple weddings over time** and **additional family members** without changing the product model.

The product’s core job is to keep **events**, **people**, and **outfits** in one shared place, with clear ownership and permissions. Every wedding is made of **dynamic events**. Every event has **multiple participants**. Every participant can have **multiple outfits**. Each outfit carries practical planning details: dress type, colour, quantity, notes, status, up to **five reference images**, and up to **five shopping or reference URLs**.

**Lucky** is the initial seeded **Super Admin**. Additional Super Admins can be created later. All other users are created and managed in the product; they are not hardcoded.

Phase 1 defines **what** the product must do and **the rules** it must obey. Later phases will cover experience design, technical design, and implementation. The application will later be **installable as a Progressive Web App (PWA)**; Phase 1 requires the product to be specified as **mobile-first** so that later PWA work is a packaging and installability step, not a redesign.

---

## 2. Project Goals

### 2.1 Primary goals

- Give Lucky, Kareena, and family a single source of truth for wedding events, participants, and outfits.
- Support **multiple concurrent or future weddings** under the same product, with isolated data per wedding.
- Make **users, roles, events, participants, and outfits fully dynamic** so the system grows as the family grows.
- Enforce **View, Edit, Create, and Admin** permissions so sensitive planning stays controlled.
- Optimize the experience for **phones first**, then tablets and desktop.

### 2.2 Success outcomes

- A Super Admin can create a wedding, invite users, create events, assign participants, and manage outfits without engineering help.
- A participant can see the events they belong to and manage or view outfits according to their permissions.
- Outfit planning is complete enough to shop from: type, colour, quantity, notes, status, images, and links.
- The same product can be reused for a later wedding without rewriting requirements.

### 2.3 Non-goals for this document

- Visual design, component libraries, or screen mockups.
- Technical architecture, APIs, or data models.
- Implementation of notifications, payments, or PWA install prompts.

---

## 3. Scope

### 3.1 In scope (product definition for Phase 1 and subsequent build phases)

- Multi-wedding product concept, with Lucky and Kareena’s wedding as the first instance.
- Dynamic user management (create, update, deactivate; Super Admin seeding).
- Role-based access with View, Edit, Create, and Admin capabilities.
- Dynamic event management, including multiple participants per event.
- Outfit management per participant, including dress type, colour, quantity, notes, status.
- Up to 5 reference images and up to 5 shopping/reference URLs per outfit.
- Outfit and event status workflow at the business-rule level.
- Mobile-first product requirements and future PWA installability as a stated constraint.
- Future-ready notification **hooks** (what would notify whom), not a live notification system.

### 3.2 Out of scope

- Native iOS or Android apps.
- Guest RSVP websites, public invitation pages, or seating charts.
- Vendor marketplaces, in-app purchasing, or payment processing.
- Live chat, comments threads, or social feeds.
- Calendar sync with Google/Apple (may be considered in a later phase).
- Automated shopping, price tracking, or affiliate checkout.
- Email/SMS/push notification **delivery** in the first implementation phase after this PRD.
- AI outfit recommendations or image generation.
- Multi-language as a launch requirement (English is the working language; localization may follow).
- Printing, PDF run-of-show export, and budget/accounting modules (unless added in a later PRD).

---

## 4. User Roles

Roles describe **who someone is** in the product. Permissions (Section 5) describe **what they can do**. A user has exactly one role per wedding unless a Super Admin grants a higher product-wide role.

### 4.1 Super Admin

- Highest authority in the product.
- **Lucky** is the initial seeded Super Admin.
- Additional Super Admins may be created by an existing Super Admin.
- Can create and manage weddings, users, roles, events, participants, outfits, and product-level settings defined in later phases.
- Can grant or revoke any permission, including promoting another Super Admin.
- Can deactivate users; Super Admins should not be able to lock the product out of all Super Admins (see Business Rules).

### 4.2 Admin

- Wedding-level operator for a specific wedding (or weddings they are assigned to).
- Can create and manage events, participants, and outfits within assigned weddings.
- Can invite or add users to that wedding within the limits Super Admin defines.
- Cannot create Super Admins or change product-wide Super Admin membership.
- Cannot delete a wedding unless Super Admin later grants that as an explicit Admin capability (default: wedding deletion is Super Admin only).

### 4.3 Member

- Typical family participant.
- Assigned to one or more events as a participant.
- Can view wedding information they are allowed to see.
- Can create and edit **their own outfits** when they have Create/Edit on outfits; cannot change other people’s outfits unless granted Edit more broadly.
- Cannot manage users or wedding-level settings.

### 4.4 Viewer

- Read-only participant or family member who needs visibility without changing plans.
- Can view events, participants, and outfits they are permitted to see.
- Cannot create, edit, or administer any records.

### 4.5 Dynamic users

- Users are not a fixed list in the product definition.
- Any person (bride, groom, parents, siblings, relatives, coordinators) can be added as a user and assigned a role.
- A user may participate in multiple events and, in future, multiple weddings.
- Display name and relationship-to-couple are user profile attributes, not separate hardcoded roles.

---

## 5. Permission Matrix

Permissions are **capabilities**, independent of the four roles. Roles receive a default set of capabilities; Super Admins may adjust defaults in later configuration work, but the product must always be able to express these four capabilities on each major resource.

**Capabilities**

- **View:** See the resource and its allowed details.
- **Edit:** Change existing records the user is allowed to touch.
- **Create:** Add new records of that type.
- **Admin:** Manage the resource class: assign access, delete within policy, change status beyond normal Edit, and configure rules for that area.

**Default capability by role and resource** (bullet matrix; no implementation implied)

**Weddings (the wedding instance)**

- Super Admin: View, Edit, Create, Admin
- Admin: View, Edit (assigned weddings only); no Create of new weddings; no Admin
- Member: View (assigned wedding only)
- Viewer: View (assigned wedding only)

**Users**

- Super Admin: View, Edit, Create, Admin
- Admin: View; Create (invite/add to assigned wedding); Edit (profile fields of users in that wedding, excluding role promotion to Super Admin); no Admin
- Member: View (users visible in their wedding/events); Edit (own profile only)
- Viewer: View (users visible in their wedding/events)

**Events**

- Super Admin: View, Edit, Create, Admin
- Admin: View, Edit, Create, Admin (within assigned wedding)
- Member: View (events they participate in or are granted); no Create; Edit only if explicitly granted
- Viewer: View (granted events only)

**Participants (assignment of users to events)**

- Super Admin: View, Edit, Create, Admin
- Admin: View, Edit, Create, Admin (within assigned wedding)
- Member: View (same event visibility as events); no Create/Edit/Admin unless granted
- Viewer: View only

**Outfits**

- Super Admin: View, Edit, Create, Admin
- Admin: View, Edit, Create, Admin (within assigned wedding)
- Member: View (outfits they are allowed to see); Create and Edit **own** outfits; no Admin
- Viewer: View only (outfits they are allowed to see)

**Reference images and shopping URLs** (follow parent outfit permissions)

- Whoever can **View** an outfit can view its images and URLs (subject to any later privacy flag).
- Whoever can **Edit** an outfit can add, replace, reorder, or remove images and URLs within the caps of 5 each.
- **Admin** on outfits includes overriding another user’s outfit media and links.

**Visibility rule:** A user never sees a wedding, event, or outfit they are not permitted to View. Cross-wedding leakage is not allowed.

---

## 6. Functional Requirements

IDs are stable requirement identifiers for later tracing. They are not a technical specification.

### 6.1 Access and identity

- **FR-01** Users must sign in before accessing wedding data. Exact identity provider is out of scope for this PRD.
- **FR-02** The product must seed **Lucky** as the first Super Admin so the system is usable on first launch.
- **FR-03** Super Admins can create additional Super Admins.
- **FR-04** Super Admins and permitted Admins can create, update, and deactivate users.
- **FR-05** Each user has a role and a set of effective permissions derived from that role and any explicit grants.

### 6.2 Weddings

- **FR-06** The product supports more than one wedding over its lifetime.
- **FR-07** Super Admins can create a new wedding instance (name, couple names, optional date, optional notes).
- **FR-08** Users are associated to weddings; they only access weddings they belong to, except Super Admins who may access all.

### 6.3 Events

- **FR-09** Events are fully dynamic: they are created, edited, cancelled, and completed in the product, not predefined as a fixed list.
- **FR-10** An event belongs to exactly one wedding.
- **FR-11** An event has a name, schedule information (date and optional time), optional location, optional notes, and a status.
- **FR-12** An event has **one or more participants**.
- **FR-13** The same user may be a participant in many events.

### 6.4 Outfits

- **FR-14** A participant may have **zero or more outfits** for a given event.
- **FR-15** Each outfit belongs to one participant on one event.
- **FR-16** Each outfit includes: dress type, colour, quantity, notes, status.
- **FR-17** Each outfit supports up to 5 reference images and up to 5 shopping/reference URLs.
- **FR-18** Users with Create on outfits can add outfits for participants they are allowed to manage (Members: themselves by default).

### 6.5 Collaboration

- **FR-19** Multiple users may work on the same wedding concurrently; last complete save of a field wins unless a later phase defines conflict handling.
- **FR-20** Destructive actions (deactivate user, cancel event, delete outfit) require confirmation in the experience (to be designed later) and must respect Admin/Super Admin policy.

### 6.6 Mobile-first product behavior

- **FR-21** Primary tasks (view today’s/upcoming events, open an outfit, update status, open a shopping link) must be specified and later designed for one-handed phone use.
- **FR-22** The product will be a web application that can later be installed as a PWA (home screen, offline shell to be defined later). Phase 1 only requires that no requirement depends on desktop-only interaction.

---

## 7. Business Rules

- **BR-01** Lucky is the initial seeded Super Admin.
- **BR-02** Additional Super Admins can be created only by an existing Super Admin.
- **BR-03** The product must not allow removal or demotion of the **last remaining** Super Admin.
- **BR-04** Users are fully dynamic; no family member except the seed Super Admin is assumed to exist at start.
- **BR-05** Events are fully dynamic; ceremony, mehndi, sangeet, reception, and similar events are examples only, not a fixed catalog.
- **BR-06** Every event must have at least one participant before it can be marked **Confirmed** or **Completed**.
- **BR-07** Every event may have multiple participants.
- **BR-08** Every participant may have multiple outfits.
- **BR-09** Quantity on an outfit must be a positive whole number (minimum 1).
- **BR-10** Dress type, colour, and status are required for an outfit to leave **Idea** status (see Status Workflow).
- **BR-11** Notes are optional.
- **BR-12** An outfit may have 0 to 5 reference images and 0 to 5 URLs; neither may exceed 5.
- **BR-13** Shopping/reference URLs must be valid web links; supported destinations include but are not limited to Amazon, Myntra, and Pinterest.
- **BR-14** Permissions always include the four capabilities View, Edit, Create, and Admin; a role may have none, some, or all of them per resource.
- **BR-15** Member Edit on outfits applies to **own** outfits by default; editing another participant’s outfits requires Admin on outfits or an explicit grant.
- **BR-16** Deactivated users cannot sign in; their historical events and outfits remain visible to permitted users.
- **BR-17** Data for Wedding A must not be visible in Wedding B except to Super Admins acting across weddings.
- **BR-18** The app is mobile-first and must remain installable as a PWA in a later phase without changing these business rules.

---

## 8. Event Management Requirements

### 8.1 What an event represents

An event is any scheduled wedding-related occasion that people attend in a defined look: for example engagement, mehndi, sangeet, ceremony, reception, or a family puja. Names are user-defined.

### 8.2 Required information

- Event name
- Wedding it belongs to
- Date (required for Confirmed/Completed)
- Optional start time and end time
- Optional location or venue text
- Optional notes
- Status (see Section 11)
- Participant list (one or more users)

### 8.3 Participant rules

- Adding a participant associates an existing user with the event.
- A participant may be marked with an optional role-in-event label (for example Bride, Groom, Brother, Guest of family). This label is descriptive, not a system security role.
- Removing a participant does not delete the user. Outfits tied to that participation are retained or archived according to Super Admin policy (default: retain, hide from active planning).

### 8.4 Operations

Permitted users must be able to:

- Create, edit, and cancel events
- Add and remove participants
- Change event status along the allowed workflow
- View a participant’s outfits for that event
- See a simple upcoming-event list suitable for a phone home screen (product requirement, not UI spec)

### 8.5 Multi-wedding

Event names may repeat across weddings. Uniqueness is per wedding, not global.

---

## 9. Outfit Management Requirements

### 9.1 What an outfit represents

An outfit is a planned look for **one participant at one event**. Multiple outfits for the same person and event are allowed (for example ceremony vs. entry look, or backup option).

### 9.2 Required and optional fields

**Required (always)**

- Parent participant (and therefore event and wedding)
- Status

**Required to advance beyond Idea**

- Dress type (free text or a managed list maintained by Admins; the product must allow new types, not only a fixed enum of “saree/lehenga/suit”)
- Colour
- Quantity (positive integer, default 1)

**Optional**

- Notes
- Reference images (0–5)
- Shopping/reference URLs (0–5)

### 9.3 Operations

Permitted users must be able to:

- Create, edit, and delete (or archive) outfits
- Duplicate an outfit as a starting point for another option
- Change outfit status along the allowed workflow
- Attach, replace, and remove images and URLs within caps
- Open a shopping/reference URL in the device browser

### 9.4 Ownership

- The participant is the default owner of their outfits.
- Admins and Super Admins may create outfits on behalf of any participant in their wedding.
- Viewers never change outfits.

---

## 10. Reference Images and Shopping Links

### 10.1 Reference images

- Maximum **5** images per outfit.
- Purpose: visual reference for shopping, tailoring, or family alignment.
- Images are user-supplied (camera or library on a phone, or file on desktop).
- Users must be able to add, preview, reorder, and remove images they are allowed to Edit.
- If a sixth image is attempted, the product must refuse and explain the limit.
- Image rights and personal photos are the uploading user’s responsibility; the product is a private family planner, not a public gallery.

### 10.2 Shopping and reference URLs

- Maximum **5** URLs per outfit.
- Purpose: product pages, wishlists, or inspiration (Amazon, Myntra, Pinterest, boutique sites, WhatsApp catalog links, etc.).
- Each URL should support an optional label (for example “Myntra – maroon lehenga”) so the list is readable on a phone.
- Tapping a URL opens it externally; the product does not scrape prices or stock.
- Invalid or empty URLs must be rejected.
- If a sixth URL is attempted, the product must refuse and explain the limit.

### 10.3 Shared rule

Images and URLs are part of the outfit record. Permissions follow the outfit. Removing an outfit removes or archives its media and links with it.

---

## 11. Status Workflow

Statuses are product states with allowed transitions. They are not a technical state machine implementation.

### 11.1 Event status

**States:** Draft → Planned → Confirmed → Completed; and Cancelled from Draft, Planned, or Confirmed.

- **Draft:** Event created; details may be incomplete; date optional.
- **Planned:** Name and intent are clear; date should be present; participants may still change.
- **Confirmed:** Date required; at least one participant required; family should treat this as locked enough to shop against.
- **Completed:** Event has occurred; outfits remain for record.
- **Cancelled:** Event will not occur; outfits remain for history but are not active work.

**Transition rules**

- Any forward move can be done by users with Edit or Admin on events, except Completed and Cancelled which require Admin on events (or Super Admin).
- Completed events are read-only for Members and Viewers.
- Admins may reopen Completed → Confirmed if plans change.
- Cancelled may be restored to Draft or Planned by Admin.

### 11.2 Outfit status

**States:** Idea → Shortlisted → Ordered → Received → Altered → Ready; and Dropped from any non-Ready state.

- **Idea:** Rough concept; type/colour may still be missing.
- **Shortlisted:** Type, colour, and quantity are required; links or images recommended but not required.
- **Ordered:** Purchase or tailor booking is in progress or done.
- **Received:** Item is in hand.
- **Altered:** Tailoring or fitting work is in progress or done.
- **Ready:** Final look is approved for the event.
- **Dropped:** Option abandoned; kept for history.

**Transition rules**

- Members may move **their own** outfits along Idea → Ready, except they cannot mark another person’s outfit Ready.
- Admin or Super Admin may set any outfit to any allowed state, including Ready and Dropped.
- Dropped outfits can be restored to Idea by the owner (if Edit) or by Admin.
- Ready outfits become read-only for Members unless an Admin reopens them to Altered or Received.

---

## 12. Notifications (future-ready only)

This PRD **does not** require sending email, SMS, WhatsApp, or push messages in the phase that first implements the planner.

It **does** require that the product concept include **notification-worthy events**, so a later phase can attach delivery without changing core rules.

### 12.1 Events that should be notifiable later

- User is added to a wedding or an event
- Outfit is assigned or created on the user’s behalf
- Outfit status changes to Ordered, Received, or Ready
- Event status changes to Confirmed, Cancelled, or date/time changes
- Super Admin or Admin requests action (for example “upload reference image”)

### 12.2 Future-ready rules

- Notification preferences (on/off per type) should be assumable per user later.
- Super Admins should be able to disable notifications globally later.
- No requirement in Phase 1 or the first build phase to choose a vendor or template.

---

## 13. Non-Functional Requirements

- **NFR-01 Mobile-first:** Core flows must be usable on a typical smartphone viewport as the primary device.
- **NFR-02 Responsive:** Tablet and desktop must work; they are secondary.
- **NFR-03 PWA-ready:** Architecture and UX must not block later install-to-home-screen, offline shell, and app-like navigation.
- **NFR-04 Privacy:** Wedding data is private to permitted users; no public indexing of family photos or plans.
- **NFR-05 Integrity:** Permission checks apply to every view and change; View does not imply Edit.
- **NFR-06 Availability:** Suitable for family use around peak wedding weeks; exact SLA is deferred.
- **NFR-07 Usability:** Primary actions reachable with clear language; avoid desktop-only patterns (hover-only, tiny hit targets).
- **NFR-08 Auditability (lightweight):** The product should later be able to show who last changed an outfit status; full audit log is not a Phase 1 implementation requirement.
- **NFR-09 Localization:** English first; names may include Indian languages in free text fields.
- **NFR-10 Performance:** Event and outfit lists must feel immediate on mobile networks; specific metrics belong in a later technical spec.

---

## 14. Acceptance Criteria

Phase 1 (this document) is accepted when the following are true **as written requirements**, not as a running app.

- **AC-01** The PRD includes all sixteen mandated sections.
- **AC-02** Lucky is documented as the initial seeded Super Admin, with additional Super Admins allowed later.
- **AC-03** Users, events, participants, and outfits are documented as fully dynamic.
- **AC-04** Multiple participants per event and multiple outfits per participant are mandatory rules.
- **AC-05** Outfit fields include dress type, colour, quantity, notes, status, up to 5 images, and up to 5 URLs.
- **AC-06** Permissions are expressed as View, Edit, Create, and Admin across weddings, users, events, participants, and outfits.
- **AC-07** Status workflows for events and outfits are defined with allowed transitions.
- **AC-08** Notifications are specified as future-ready only.
- **AC-09** Mobile-first and later PWA installability are explicit constraints.
- **AC-10** The document contains no database tables, SQL, UI mock specifications, or code.

**Product acceptance (for a later implementation phase, traced to this PRD)**

- Super Admin can create a wedding, users, events, participants, and outfits.
- A Member can manage own outfits within caps and cannot administer users.
- A Viewer cannot change data.
- Sixth image or sixth URL is rejected.
- Last Super Admin cannot be demoted.

---

## 15. Risks and Assumptions

### 15.1 Assumptions

- First wedding in the product is Lucky and Kareena’s.
- Family members will share phones and expect WhatsApp-like familiarity; the planner complements chat, it does not replace it.
- English is sufficient for launch.
- Photos will include personal family images; private hosting is required in implementation phases.
- “Dress type” must remain open-ended because wedding clothing is diverse.
- One person may need different outfits for the same event.

### 15.2 Risks

- **Permission complexity:** Over-customizing grants per user could confuse family Admins. Mitigation: ship strong role defaults; custom grants later.
- **Scope creep:** Budget, vendors, RSVP, and chat will be requested. Mitigation: keep them out of scope until a new PRD.
- **PWA deferred too late:** If the first UI is desktop-centric, PWA work becomes a rewrite. Mitigation: mobile-first is mandatory from the first experience phase.
- **Link rot:** Shopping URLs will expire. Mitigation: images and notes remain the source of truth; URLs are helpers.
- **Single Super Admin bottleneck:** If only Lucky can administer, progress stalls. Mitigation: BR-02 allows more Super Admins; Kareena or a parent can be promoted.

---

## 16. Phase Completion Checklist

Phase 1 is **documentation only**. Check each item before closing the phase.

- Executive Summary completed
- Project Goals completed
- Scope (in and out) completed
- User Roles completed
- Permission Matrix completed (View, Edit, Create, Admin)
- Functional Requirements completed
- Business Rules completed (including Lucky as seeded Super Admin)
- Event Management Requirements completed (dynamic events, multiple participants)
- Outfit Management Requirements completed (dynamic outfits, required fields)
- Reference Images and Shopping Links completed (caps of 5)
- Status Workflow completed (events and outfits)
- Notifications documented as future-ready only
- Non-Functional Requirements completed (mobile-first, PWA-later)
- Acceptance Criteria completed
- Risks and Assumptions completed
- No code, SQL, UI specs, or database schema included
- Deliverables list below completed

---

## 17. Invitation and Onboarding

This section is additive. It does not change roles, permissions, or Super Admin seeding in Sections 4–7. **Lucky** remains the seeded Super Admin and does not join through an invitation.

A person becomes a member of a wedding only by **accepting a valid invitation**, except Lucky (seed) and any Super Admin who creates or is granted product-level Super Admin access (BR-02). Super Admins may still open every wedding; wedding-scoped Admin, Member, and Viewer access requires membership created from an accepted invitation (or an equivalent Super Admin assignment of membership that follows the same rules).

### 17.1 Invitation lifecycle

1. **Create** — Super Admin or wedding Admin issues an invitation for one wedding, one recipient, and one role (Admin, Member, or Viewer). Super Admin cannot be granted by invitation.
2. **Pending** — invitation is open, not expired, not cancelled, not accepted, not rejected. This is the only state that can be accepted.
3. **Accept** — recipient confirms; wedding membership is created with the invited role.
4. **Reject** — recipient declines; no membership is created.
5. **Expire** — pending invitation passes its expiry instant; it cannot be accepted until resent.
6. **Cancel** — issuer-side withdrawal of a pending or expired invitation; it cannot be accepted.
7. **Resend** — a pending or expired invitation is renewed (new expiry; previous secure link is no longer valid).

Terminal states: Accepted, Rejected, Cancelled. Expired is retryable via Resend.

### 17.2 Who can send invitations

- **Super Admin:** any wedding.
- **Admin:** only an assigned wedding.
- **Member and Viewer:** cannot send, resend, or cancel invitations.

### 17.3 Invite by email or secure link

An invitation may be delivered as:

- **Email** to the recipient address, and/or
- **Secure link** that the issuer can share in an existing family channel (for example WhatsApp).

Both methods refer to the same pending invitation. The link must be unguessable. Accepting consumes the pending invitation. A rejected, cancelled, expired, or already-accepted link cannot create membership.

### 17.4 Invitation expiry

- Default pending lifetime is **14 days** from create or last resend.
- After expiry the invitation stays visible to Super Admin and the wedding’s Admins as Expired until cancelled or resent.
- Expired invitations never create membership.

### 17.5 Accept, reject, resend, cancel

- **Accept:** recipient must match the invitation (signed-in user with that email, or new user completing onboarding for that email). Result: active wedding membership with the invited role. If the person already has an account from another wedding, only membership is added. If they are new, the user record is created (dynamic users) and then membership is added.
- **Reject:** no membership; the same email may be invited again later (new invitation).
- **Resend:** Super Admin or wedding Admin only; allowed from Pending or Expired; not allowed from Accepted, Rejected, or Cancelled. Resend resets expiry and invalidates the previous secure link.
- **Cancel:** Super Admin or wedding Admin only; allowed from Pending or Expired; not allowed after Accept.

### 17.6 Pending invitation state

- At most **one Pending** invitation per email per wedding.
- A second invite to the same email and wedding while Pending is refused; the issuer must resend or cancel first.
- Pending invitations are not memberships. Recipients have no wedding data access until Accept.
- Pending invitations are visible to Super Admins and to Admins of that wedding, not to Members or Viewers (except the recipient, who sees only their own invite at accept/reject time).

### 17.7 Wedding membership after acceptance

- Membership is **Active** and scoped to that wedding only.
- Role is exactly the role on the invitation.
- Cross-wedding isolation is unchanged: accepting Wedding A grants nothing on Wedding B.
- Notifications remain future-ready (Section 12); “user added to a wedding” is the matching future hook.

### 17.8 Invitation ownership (business rules)

- The **wedding** owns the invitation record.
- **Created by** is the sending Super Admin or Admin (audit stamps in Section 20).
- Cancel and resend may be performed by any Super Admin or any current Admin of that wedding, not only the original sender.
- If the original sender loses Admin on that wedding, they cannot manage the invitation unless they are Super Admin.
- Deactivating the sender does not cancel pending invitations; another Admin or Super Admin may still resend or cancel.
- Invitation history is preserved through archive of the wedding (Section 18).

---

## 18. Archive, Restore, and Permanent Delete

This section is additive. It clarifies destructive actions named in FR-20 and BR-16. It does not remove **user deactivation**, **event Cancelled status**, or **outfit Dropped status**. Those remain status or access rules. Archive is a **lifecycle** on the record.

### 18.1 Definitions

- **Active:** visible in normal planning lists (subject to permissions).
- **Archive:** reversible hide from active planning. History is preserved. Child records are archived with the parent unless a more specific rule says otherwise.
- **Restore:** returns an archived record (and archived children that were archived with it) to Active, unless a child was permanently deleted.
- **Permanent Delete:** irreversible removal. Allowed only where stated. Requires confirmation (FR-20).
- **User deactivation (existing):** the person cannot sign in; historical events and outfits remain visible to permitted users (BR-16). Deactivation is not Permanent Delete.

Default “remove from planning” for events, participants, outfits, images, and links is **Archive**, not Permanent Delete.

### 18.2 Policy by record type

**Wedding**

- Archive: Super Admin only.
- Restore: Super Admin only.
- Permanent Delete: Super Admin only, and only from Archived (not directly from Active).
- History preserved on archive: yes.
- Children: all events, participants, outfits, images, shopping links, invitations, and memberships of that wedding are archived with it. Restore restores them. Permanent Delete of a wedding permanently deletes those children. Users themselves are not deleted (they may belong to other weddings).

**User**

- Archive: not used as a separate wedding-hide; use **membership archive** to remove someone from one wedding, and **deactivation** to block sign-in product-wide.
- Deactivate: Super Admin (existing). Admins do not deactivate product-wide accounts.
- Restore (reactivate): Super Admin only, if not permanently deleted.
- Permanent Delete: Super Admin only, never for the last remaining Super Admin (BR-03).
- History preserved on deactivation: yes (BR-16).
- Children: deactivation does not archive other people’s records. Permanent Delete of a user does not destroy other weddings’ events; it removes or anonymizes that user’s identity on stamps and removes their memberships. Outfits they participated in remain with the event, archived against the participant record per participant rules.

**Event**

- Archive: Super Admin or wedding Admin. Distinct from status **Cancelled**. A cancelled event may also be archived.
- Restore: Super Admin or wedding Admin.
- Permanent Delete: Super Admin only, from Archived.
- History preserved on archive: yes.
- Children: participants, outfits, images, and links of that event are archived and restored with it.

**Participant**

- Archive: Super Admin or wedding Admin. This is the meaning of “remove participant” in Section 8.3 (user is not deleted; outfits retained and hidden from active planning).
- Restore: Super Admin or wedding Admin.
- Permanent Delete: Super Admin only, from Archived. The user account is not deleted.
- History preserved on archive: yes.
- Children: outfits (and their images and links) are archived and restored with the participant.

**Outfit**

- Archive: Super Admin, wedding Admin, or Member for **own** outfits (this is the default meaning of “delete outfit” in FR-20).
- Restore: Super Admin, wedding Admin, or Member for own outfits they archived.
- Permanent Delete: Super Admin only, from Archived.
- History preserved on archive: yes.
- Children: images and shopping links are archived and restored with the outfit. Active-list image caps (max 5) count only Active outfits’ active images.

**Images**

- Archive: follows parent outfit. Detaching an image from an **Active** outfit remains a content edit (Section 10 / SDD storage detach) and records activity “Image removed.”
- Restore: follows restored parent outfit if the image was archived with it and not permanently deleted.
- Permanent Delete: Super Admin, or wedding Admin / owner Member while editing an Active outfit (detach). After outfit archive, only Super Admin permanently deletes.
- History preserved on archive-with-parent: yes. After detach/permanent delete, the file is not kept for planning (storage lifecycle in SDD).
- Children: none.

**Shopping links**

- Archive: follows parent outfit.
- Restore: follows parent outfit.
- Permanent Delete: same actors as Images (reference text is removed; the external Amazon/Myntra page is unaffected).
- History preserved on archive-with-parent: yes.
- Children: none.

### 18.3 Progress and lists

Archived and permanently deleted records do not contribute to **active** progress. Cancelled events remain excluded from wedding progress as already specified. Dropped outfits remain excluded from outfit averages as already specified.

---

## 19. Progress Calculation Specification

This section is the **product specification** for completion percentages. It matches the Phase 2 SDD weights. Frontend and backend must use the same formulas. Progress is derived; users do not type a percentage.

Archived records are omitted from all averages below. Permanently deleted records do not exist for calculation.

### 19.1 Outfit progress

| Status | Conceptual completion | In active average |
| --- | --- | --- |
| Idea | 0% | Yes |
| Shortlisted | 20% | Yes |
| Ordered | 40% | Yes |
| Received | 60% | Yes |
| Altered | 80% | Yes |
| Ready | 100% | Yes |
| Dropped | Not scored (abandoned option) | No |

Images and shopping URLs do not change the percentage.

**OutfitProgress(outfit) = weight(status)** for active, non-dropped outfits.

### 19.2 Participant progress

Participant outfit readiness is the average of that participant’s **active, non-dropped** outfits on that event.

- If there are no such outfits: **ParticipantProgress = 0%**.
- Else: **ParticipantProgress = average(OutfitProgress)** over those outfits.

### 19.3 Event progress

Event completion is the average of its **active** participants’ progress (archived participants omitted).

- If the event is **Cancelled**: excluded from wedding progress; not averaged as a percentage into the wedding.
- If there are no active participants: **EventProgress = 0%**.
- Else: **EventProgress = average(ParticipantProgress)** over active participants.

### 19.4 Wedding progress and completed events

Wedding readiness is the average of **EventProgress** for every event of that wedding that is **not Cancelled** and **not Archived**. Draft, Planned, Confirmed, and **Completed** events all sit in this average with equal weight.

**How Completed events contribute:** a Completed event is not removed from the wedding average. Its EventProgress (from participant outfit readiness) continues to contribute. When outfits on that event reach Ready, that event’s percentage rises and therefore **overall wedding readiness rises**. An unfinished Completed event (outfits still Idea) keeps wedding progress down, which is intentional.

- If there are no eligible events: **WeddingProgress = 0%**.
- Else: **WeddingProgress = average(EventProgress)** over eligible events.

**Overall completion % = WeddingProgress** for that wedding.

Lucky and Kareena Wedding 2026 uses the same specification as every future wedding. Unrelated weddings are never averaged into one product-wide percentage.

---

## 20. Audit and Activity Requirements

This section is additive. It does not change permissions. NFR-08 stated that a full audit log was not a Phase 1 **implementation** requirement; this section defines the **business** requirement for later phases so questions such as “Who changed Kareena’s outfit?” have a consistent answer. No implementation is specified here.

### 20.1 Record stamps (every record)

Every conceptual record (wedding, user, membership, invitation, event, participant, outfit, image reference, shopping link) must remember:

- **Created by**
- **Created date**
- **Last modified by**
- **Last modified date**

System seed actions (Lucky as initial Super Admin) use a documented system actor plus the seed date.

### 20.2 Activity types (minimum vocabulary)

The product must be able to represent at least:

- User created
- Event created
- Event edited
- Outfit updated
- Status changed
- Image added
- Image removed
- Invitation accepted

Additional types (invitation sent, archived, restored, permanently deleted) may be added later without changing this minimum list.

### 20.3 Visibility

- **Super Admin:** complete activity across weddings.
- **Admin:** activity for their assigned wedding only.
- **Member and Viewer:** only activity on records they are already allowed to View (for example a Member sees outfit updates on outfits they can access, not on hidden family members).

Activity never reveals cross-wedding data. Viewers cannot perform the actions, but they may see activity on records they can view.

### 20.4 Retention

Activity and stamps survive **Archive** and **Restore**. They do not need to survive **Permanent Delete** of the parent record, except Super Admin may retain a minimal deletion activity (“record permanently deleted”) at wedding or product level.

---

## Deliverables (Phase 1 complete)

When this PRD is stored in the repository as a professional Markdown document, **Phase 1 is complete**.

1. **Product Requirements Document** covering sections 1–16 above.
2. **Role and permission definition** sufficient for a later experience and technical design phase.
3. **Event, outfit, media, and link rules** sufficient for later design without inventing data storage.
4. **Status workflows** for events and outfits.
5. **Future-ready notification catalog** (no delivery design).
6. **Explicit out-of-scope list** to prevent scope creep.
7. **Phase 1 completion checklist** signed off by product owner.

**Canonical file:** [PRD.md](PRD.md)

**Explicitly not delivered in Phase 1:** application code, UI, API contracts, SQL, or database schema.

**Phase 2.1 additions (locked with Phase 1 rules):** Sections 17–20 — invitations and onboarding; archive / restore / permanent delete; progress calculation; audit and activity. See [PHASE-2.1.md](PHASE-2.1.md).

**Status:** Phase 1 LOCKED. Phase 2 LOCKED. Ready for Phase 3 – Database Design.