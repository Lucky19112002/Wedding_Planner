export type WeddingRole = 'admin' | 'member' | 'viewer';
export type InvitationStatus = 'pending' | 'accepted' | 'rejected' | 'expired' | 'cancelled';
export type EventStatus = 'draft' | 'planned' | 'confirmed' | 'completed' | 'cancelled';
export type OutfitStatus = 'idea' | 'shortlisted' | 'ordered' | 'received' | 'altered' | 'ready' | 'dropped';

export type Profile = {
  id: string;
  email: string;
  displayName: string;
  isSuperAdmin: boolean;
  isDeactivated: boolean;
  relationshipNote: string | null;
};

export type Wedding = {
  id: string;
  name: string;
  coupleNames: string | null;
  weddingDate: string | null;
  notes: string | null;
};

export type Membership = {
  id: string;
  weddingId: string;
  userId: string;
  role: WeddingRole;
};

export type Event = {
  id: string;
  weddingId: string;
  name: string;
  eventDate: string | null;
  startTime: string | null;
  endTime: string | null;
  location: string | null;
  notes: string | null;
  status: EventStatus;
  participantCount: number;
  outfitCount: number;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
};

export type EventInput = {
  weddingId: string;
  name: string;
  eventDate: string;
  startTime: string | null;
  endTime: string | null;
  location: string | null;
  notes: string | null;
  status: EventStatus;
};

export type Participant = {
  id: string;
  eventId: string;
  weddingId: string;
  userId: string | null;
  displayName: string;
  email: string | null;
  relationshipNote: string | null;
  roleInEvent: string | null;
  memberRole: WeddingRole | null;
  outfitCount: number;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
};

export type ParticipantInput = {
  eventId: string;
  weddingId: string;
  userId: string;
  roleInEvent: string;
};

export type ParticipantUpdateInput = {
  roleInEvent: string;
};

export type ParticipantCandidate = {
  userId: string;
  displayName: string;
  email: string;
  relationshipNote: string | null;
  memberRole: WeddingRole;
  isAlreadyParticipant: boolean;
};

export type Outfit = {
  id: string;
  participantId: string;
  participantName?: string;
  participantEmail?: string | null;
  eventId: string;
  weddingId: string;
  ownerUserId: string | null;
  dressType: string | null;
  colour: string | null;
  quantity: number;
  notes: string | null;
  status: OutfitStatus;
  primaryImagePath: string | null;
  primaryImageUrl: string | null;
  imageCount: number;
  shoppingLinkCount: number;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
};

export type OutfitInput = {
  participantId: string;
  dressType: string;
  colour: string;
  quantity: number;
  notes: string | null;
  status: OutfitStatus;
};

export type OutfitImage = {
  id: string;
  outfitId: string;
  weddingId: string;
  storagePath: string;
  sortOrder: number;
  signedUrl: string | null;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
};

export type ShoppingLink = {
  id: string;
  outfitId: string;
  weddingId: string;
  url: string;
  label: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
};

export type ShoppingLinkInput = {
  outfitId: string;
  weddingId: string;
  url: string;
  label: string | null;
};

export type DashboardSummary = {
  completedEvents: number;
  familyMembers: number;
  overallCompletionPct: number;
  pendingOutfits: number;
  pendingInvitations: number;
  readyOutfits: number;
  todaysTasks: number;
  totalEvents: number;
  totalOutfits: number;
  totalParticipants: number;
  upcomingEvents: number;
};

export type DashboardEventProgress = {
  eventDate: string | null;
  eventId: string;
  location: string | null;
  name: string;
  participantCount: number;
  progressPct: number;
  readyOutfitCount: number;
  status: EventStatus;
};

export type DashboardParticipantInsight = {
  displayName: string;
  email: string | null;
  eventId: string;
  participantId: string;
  pendingOutfits: number;
  progressPct: number;
  readyOutfits: number;
  relationshipNote: string | null;
};

export type DashboardTimelineEvent = {
  daysRemaining: number;
  eventDate: string;
  eventId: string;
  location: string | null;
  name: string;
  status: EventStatus;
};

export type DashboardOutfitAnalytics = Record<OutfitStatus, number>;

export type DashboardData = {
  eventProgress: DashboardEventProgress[];
  outfitAnalytics: DashboardOutfitAnalytics;
  participantInsights: DashboardParticipantInsight[];
  summary: DashboardSummary;
  timeline: DashboardTimelineEvent[];
};

export type PermissionAction = 'view' | 'create' | 'edit' | 'admin';
export type PermissionResource = 'weddings' | 'users' | 'events' | 'participants' | 'outfits';
export type ManagedPermissionResource = 'users' | 'events' | 'participants' | 'outfits';
export type EventPermissionLevel = 'view' | 'edit';

export type PermissionLevel = Record<PermissionAction, boolean>;

export type Invitation = {
  id: string;
  weddingId: string;
  weddingName: string | null;
  email: string;
  invitedRole: WeddingRole;
  status: InvitationStatus;
  expiresAt: string;
  invitedBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export type InvitationInput = {
  weddingId: string;
  email: string;
  displayName: string;
  invitedRole: WeddingRole;
  optionalMessage: string | null;
};

export type SentInvitation = {
  invitation: Invitation;
  inviteUrl: string;
  existingUser: Profile | null;
};

export type ManagedUser = {
  userId: string;
  membershipId: string;
  displayName: string;
  email: string;
  systemRole: 'super_admin' | 'user';
  weddingRole: WeddingRole;
  invitationStatus: InvitationStatus | 'none';
  isDeactivated: boolean;
  relationshipNote: string | null;
  updatedAt: string;
};

export type PermissionMatrix = Record<ManagedPermissionResource, PermissionLevel>;

export type UserEventPermission = {
  eventId: string;
  userId: string;
  level: EventPermissionLevel;
};
