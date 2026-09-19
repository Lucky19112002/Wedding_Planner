import { create } from 'zustand';
import {
  acceptInvitation,
  cancelInvitation,
  getPendingInvitations,
  rejectInvitation,
  resendInvitation,
  sendInvitation,
} from '@/services/invitation.service';
import type { Invitation, InvitationInput, SentInvitation } from '@/types/domain';

type InvitationStore = {
  pendingInvitations: Invitation[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  lastInviteUrl: string | null;
  loadPendingInvitations: (weddingId: string) => Promise<void>;
  sendInvitation: (input: InvitationInput) => Promise<SentInvitation>;
  resendInvitation: (invitationId: string, weddingId: string) => Promise<string>;
  cancelInvitation: (invitationId: string, weddingId: string) => Promise<void>;
  acceptInvitation: (token: string) => Promise<void>;
  rejectInvitation: (token: string) => Promise<void>;
  clearInviteUrl: () => void;
};

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export const useInvitationStore = create<InvitationStore>((set) => ({
  pendingInvitations: [],
  loading: false,
  saving: false,
  error: null,
  lastInviteUrl: null,
  loadPendingInvitations: async (weddingId) => {
    set({ loading: true, error: null });
    try {
      set({ pendingInvitations: await getPendingInvitations(weddingId), loading: false });
    } catch (error) {
      set({
        error: getErrorMessage(error, 'Invitations could not be loaded.'),
        loading: false,
      });
    }
  },
  sendInvitation: async (input) => {
    set({ saving: true, error: null, lastInviteUrl: null });
    try {
      const result = await sendInvitation(input);
      set({
        pendingInvitations: await getPendingInvitations(input.weddingId),
        lastInviteUrl: result.inviteUrl,
        saving: false,
      });
      return result;
    } catch (error) {
      set({
        error: getErrorMessage(error, 'Invitation could not be sent.'),
        saving: false,
      });
      throw error;
    }
  },
  resendInvitation: async (invitationId, weddingId) => {
    set({ saving: true, error: null, lastInviteUrl: null });
    try {
      const inviteUrl = await resendInvitation(invitationId, weddingId);
      const pendingInvitations = await getPendingInvitations(weddingId);
      set({ pendingInvitations, lastInviteUrl: inviteUrl, saving: false });
      return inviteUrl;
    } catch (error) {
      set({
        error: getErrorMessage(error, 'Invitation could not be resent.'),
        saving: false,
      });
      throw error;
    }
  },
  cancelInvitation: async (invitationId, weddingId) => {
    set({ saving: true, error: null });
    try {
      await cancelInvitation(invitationId);
      set({ pendingInvitations: await getPendingInvitations(weddingId), saving: false });
    } catch (error) {
      set({
        error: getErrorMessage(error, 'Invitation could not be cancelled.'),
        saving: false,
      });
      throw error;
    }
  },
  acceptInvitation: async (token) => {
    set({ saving: true, error: null });
    try {
      await acceptInvitation(token);
      set({ saving: false });
    } catch (error) {
      set({ error: getErrorMessage(error, 'Invitation could not be accepted.'), saving: false });
      throw error;
    }
  },
  rejectInvitation: async (token) => {
    set({ saving: true, error: null });
    try {
      await rejectInvitation(token);
      set({ saving: false });
    } catch (error) {
      set({ error: getErrorMessage(error, 'Invitation could not be rejected.'), saving: false });
      throw error;
    }
  },
  clearInviteUrl: () => set({ lastInviteUrl: null }),
}));
