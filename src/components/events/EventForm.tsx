import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { TextArea } from '@/components/ui/TextArea';
import { eventStatuses, eventStatusLabels, getAllowedEventStatuses } from '@/utils/eventWorkflow';
import type { Event, EventInput, EventStatus } from '@/types/domain';

const eventFormSchema = z
  .object({
    name: z.string().trim().min(1, 'Event name is required.'),
    eventDate: z.string().min(1, 'Date is required.'),
    startTime: z.string(),
    endTime: z.string(),
    location: z.string(),
    notes: z.string(),
    status: z.enum(eventStatuses),
  })
  .refine((data) => !data.startTime || !data.endTime || data.endTime >= data.startTime, {
    message: 'End time must be after start time.',
    path: ['endTime'],
  });

type EventFormValues = z.infer<typeof eventFormSchema>;

type EventFormProps = {
  event?: Event;
  isSaving: boolean;
  submitLabel: string;
  weddingId: string;
  onSubmit: (input: EventInput) => Promise<void>;
};

function toValues(event?: Event): EventFormValues {
  return {
    name: event?.name ?? '',
    eventDate: event?.eventDate ?? '',
    startTime: event?.startTime ?? '',
    endTime: event?.endTime ?? '',
    location: event?.location ?? '',
    notes: event?.notes ?? '',
    status: event?.status ?? 'draft',
  };
}

export function EventForm({ event, isSaving, onSubmit, submitLabel, weddingId }: EventFormProps) {
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: toValues(event),
  });
  const statusOptions = event ? getAllowedEventStatuses(event.status) : eventStatuses;

  useEffect(() => {
    form.reset(toValues(event));
  }, [event, form]);

  async function handleSubmit(values: EventFormValues) {
    await onSubmit({
      weddingId,
      name: values.name.trim(),
      eventDate: values.eventDate,
      startTime: values.startTime || null,
      endTime: values.endTime || null,
      location: values.location.trim() || null,
      notes: values.notes.trim() || null,
      status: values.status as EventStatus,
    });
  }

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
      <Input label="Event Name" {...form.register('name')} />
      {form.formState.errors.name ? (
        <p className="text-sm text-rose-600">{form.formState.errors.name.message}</p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <Input label="Date" type="date" {...form.register('eventDate')} />
        <Input label="Start Time" type="time" {...form.register('startTime')} />
        <Input label="End Time" type="time" {...form.register('endTime')} />
      </div>
      {form.formState.errors.eventDate || form.formState.errors.endTime ? (
        <p className="text-sm text-rose-600">
          {form.formState.errors.eventDate?.message ?? form.formState.errors.endTime?.message}
        </p>
      ) : null}

      <Input label="Venue" {...form.register('location')} />
      <TextArea label="Notes" {...form.register('notes')} />

      <Select label="Status" {...form.register('status')}>
        {statusOptions.map((status) => (
          <option key={status} value={status}>
            {eventStatusLabels[status]}
          </option>
        ))}
      </Select>
      <p className="text-xs text-slate-500">
        Confirmed and Completed events require participants. Add participants in Phase 5.3.
      </p>

      <Button className="w-full sm:w-auto" isLoading={isSaving} type="submit">
        {submitLabel}
      </Button>
    </form>
  );
}
