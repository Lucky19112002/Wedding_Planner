export type WeddingRole = 'admin' | 'member' | 'viewer';

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

export type PermissionAction = 'view' | 'create' | 'edit' | 'admin';
export type PermissionResource = 'weddings' | 'users' | 'events' | 'participants' | 'outfits';

export type PermissionLevel = Record<PermissionAction, boolean>;
