import { beforeEach, describe, expect, it, vi } from 'vitest';

const { rpc, signInWithPassword } = vi.hoisted(() => ({
  rpc: vi.fn(),
  signInWithPassword: vi.fn(),
}));

vi.mock('@/lib/supabase', () => ({
  supabase: {
    rpc,
    auth: {
      signInWithPassword,
    },
  },
}));

describe('createInvitedAccountAndAccept', () => {
  beforeEach(() => {
    rpc.mockReset();
    signInWithPassword.mockReset();
  });

  it('creates a confirmed invited account through the token-bound RPC before accepting', async () => {
    const { createInvitedAccountAndAccept } = await import('./invitation.service');

    rpc.mockResolvedValueOnce({ data: 'user-1', error: null });
    signInWithPassword.mockResolvedValueOnce({
      data: { session: { user: { id: 'user-1' } } },
      error: null,
    });
    rpc.mockResolvedValueOnce({ data: null, error: null });

    await expect(
      createInvitedAccountAndAccept({
        token: 'invite-token',
        email: 'new@example.com',
        password: '123456',
        displayName: 'new',
      }),
    ).resolves.toBe('user-1');

    expect(rpc).toHaveBeenNthCalledWith(1, 'create_invited_auth_user', {
      p_token: 'invite-token',
      p_password: '123456',
      p_display_name: 'new',
    });
    expect(signInWithPassword).toHaveBeenCalledWith({ email: 'new@example.com', password: '123456' });
    expect(rpc).toHaveBeenNthCalledWith(2, 'accept_invitation', { p_token: 'invite-token' });
  });
});
