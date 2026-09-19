import { describe, expect, it } from 'vitest';
import type { Profile } from '@/types/domain';
import { getRolePermissionMatrix, isLastSuperAdmin } from '@/utils/permissions';

const lucky: Profile = {
  id: 'lucky',
  email: 'lucky@example.com',
  displayName: 'Lucky',
  isSuperAdmin: true,
  isDeactivated: false,
  relationshipNote: null,
};

describe('permission matrix', () => {
  it('gives wedding admins full planning capabilities except product-level super admin powers', () => {
    const matrix = getRolePermissionMatrix('admin');

    expect(matrix.events).toEqual({ view: true, create: true, edit: true, admin: true });
    expect(matrix.participants).toEqual({ view: true, create: true, edit: true, admin: true });
    expect(matrix.outfits).toEqual({ view: true, create: true, edit: true, admin: true });
    expect(matrix.users).toEqual({ view: true, create: true, edit: true, admin: true });
  });

  it('keeps viewers read-only across managed resources', () => {
    const matrix = getRolePermissionMatrix('viewer');

    expect(Object.values(matrix)).toEqual([
      { view: true, create: false, edit: false, admin: false },
      { view: true, create: false, edit: false, admin: false },
      { view: true, create: false, edit: false, admin: false },
      { view: true, create: false, edit: false, admin: false },
    ]);
  });

  it('detects when a deactivation would remove the last active super admin', () => {
    expect(isLastSuperAdmin(lucky, [lucky])).toBe(true);
    expect(isLastSuperAdmin(lucky, [{ ...lucky }, { ...lucky, id: 'other' }])).toBe(false);
    expect(isLastSuperAdmin({ ...lucky, isSuperAdmin: false }, [lucky])).toBe(false);
  });
});
