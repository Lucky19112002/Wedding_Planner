import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { TextArea } from '@/components/ui/TextArea';
import { getAllowedOutfitStatuses, outfitStatusLabels, outfitStatuses } from '@/utils/outfitWorkflow';
import type { Outfit, OutfitInput } from '@/types/domain';

const outfitFormSchema = z.object({
  dressType: z.string().trim().min(1, 'Dress type is required.'),
  colour: z.string().trim().min(1, 'Colour is required.'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1.'),
  status: z.enum(outfitStatuses),
  notes: z.string(),
});

type OutfitFormValues = z.infer<typeof outfitFormSchema>;

type OutfitFormProps = {
  outfit?: Outfit;
  participantId: string;
  isSaving: boolean;
  submitLabel: string;
  onSubmit: (input: OutfitInput) => Promise<void>;
  children?: ReactNode;
};

function toValues(outfit?: Outfit): OutfitFormValues {
  return {
    dressType: outfit?.dressType ?? '',
    colour: outfit?.colour ?? '',
    quantity: outfit?.quantity ?? 1,
    status: outfit?.status ?? 'idea',
    notes: outfit?.notes ?? '',
  };
}

export function OutfitForm({ children, isSaving, onSubmit, outfit, participantId, submitLabel }: OutfitFormProps) {
  const form = useForm<OutfitFormValues>({
    resolver: zodResolver(outfitFormSchema),
    defaultValues: toValues(outfit),
  });
  const statusOptions = outfit ? getAllowedOutfitStatuses(outfit.status) : getAllowedOutfitStatuses();

  useEffect(() => {
    form.reset(toValues(outfit));
  }, [form, outfit]);

  async function handleSubmit(values: OutfitFormValues) {
    await onSubmit({
      participantId,
      dressType: values.dressType.trim(),
      colour: values.colour.trim(),
      quantity: values.quantity,
      notes: values.notes.trim() || null,
      status: values.status,
    });
  }

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
      <Input label="Outfit Name" placeholder="Sherwani, lehenga, suit..." {...form.register('dressType')} />
      {form.formState.errors.dressType ? (
        <p className="text-sm text-rose-600">{form.formState.errors.dressType.message}</p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Colour" placeholder="Ivory, maroon, gold..." {...form.register('colour')} />
        <Input label="Quantity" min={1} type="number" {...form.register('quantity', { valueAsNumber: true })} />
      </div>
      {form.formState.errors.colour || form.formState.errors.quantity ? (
        <p className="text-sm text-rose-600">
          {form.formState.errors.colour?.message ?? form.formState.errors.quantity?.message}
        </p>
      ) : null}

      <Select label="Status" {...form.register('status')}>
        {statusOptions.map((status) => (
          <option key={status} value={status}>
            {outfitStatusLabels[status]}
          </option>
        ))}
      </Select>

      <TextArea label="Notes" placeholder="Tailor, fabric, shopping reminders..." {...form.register('notes')} />

      {children}

      <Button className="w-full sm:w-auto" isLoading={isSaving} type="submit">
        {submitLabel}
      </Button>
    </form>
  );
}
