export type WeddingRole = 'admin' | 'member' | 'viewer';
export type EventStatus = 'draft' | 'planned' | 'confirmed' | 'completed' | 'cancelled';

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

export type PermissionAction = 'view' | 'create' | 'edit' | 'admin';
export type PermissionResource = 'weddings' | 'users' | 'events' | 'participants' | 'outfits';

export type PermissionLevel = Record<PermissionAction, boolean>;
