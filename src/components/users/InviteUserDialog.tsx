import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { TextArea } from '@/components/ui/TextArea';
import type { InvitationInput, Wedding, WeddingRole } from '@/types/domain';
import { weddingRoleLabels } from '@/utils/permissions';

const inviteSchema = z.object({
  displayName: z.string().trim().min(1, 'Display name is required.'),
  email: z.string().trim().email('Enter a valid email.'),
  invitedRole: z.enum(['admin', 'member', 'viewer']),
  optionalMessage: z.string().trim().optional(),
  weddingId: z.string().min(1, 'Wedding is required.'),
});

type InviteForm = z.infer<typeof inviteSchema>;

type InviteUserDialogProps = {
  activeWeddingId: string;
  isOpen: boolean;
  isSaving?: boolean;
  weddings: Wedding[];
  onClose: () => void;
  onSubmit: (input: InvitationInput) => Promise<void>;
};

export function InviteUserDialog({
  activeWeddingId,
  isOpen,
  isSaving = false,
  onClose,
  onSubmit,
  weddings,
}: InviteUserDialogProps) {
  const form = useForm<InviteForm>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      displayName: '',
      email: '',
      invitedRole: 'viewer',
      optionalMessage: '',
      weddingId: activeWeddingId,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        displayName: '',
        email: '',
        invitedRole: 'viewer',
        optionalMessage: '',
        weddingId: activeWeddingId,
      });
    }
  }, [activeWeddingId, form, isOpen]);

  async function handleSubmit(values: InviteForm) {
    try {
      await onSubmit({
        weddingId: values.weddingId,
        email: values.email,
        displayName: values.displayName,
        invitedRole: values.invitedRole,
        optionalMessage: values.optionalMessage?.trim() || null,
      });
      form.reset();
    } catch {
      // The store exposes the error in the page; keep the dialog values for correction.
    }
  }

  return (
    <Modal isOpen={isOpen} title="Invite user" onClose={onClose}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <Input label="Display name" {...form.register('displayName')} />
        {form.formState.errors.displayName ? (
          <p className="text-sm text-red-600">{form.formState.errors.displayName.message}</p>
        ) : null}
        <Input label="Email" type="email" {...form.register('email')} />
        {form.formState.errors.email ? (
          <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
        ) : null}
        <Select label="Wedding" {...form.register('weddingId')}>
          {weddings.map((wedding) => (
            <option key={wedding.id} value={wedding.id}>
              {wedding.name}
            </option>
          ))}
        </Select>
        <Select label="Wedding role" {...form.register('invitedRole')}>
          {(['viewer', 'member', 'admin'] as WeddingRole[]).map((role) => (
            <option key={role} value={role}>
              {weddingRoleLabels[role]}
            </option>
          ))}
        </Select>
        <TextArea label="Optional message" {...form.register('optionalMessage')} />
        <p className="text-xs text-slate-500">
          Invitations expire after 14 days. Super Admin access cannot be granted through invitations.
        </p>
        <Button className="w-full" type="submit" isLoading={isSaving || form.formState.isSubmitting}>
          Send invitation
        </Button>
      </form>
    </Modal>
  );
}
