import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { isValidShoppingUrl } from '@/utils/shoppingLinks';
import type { ShoppingLink } from '@/types/domain';

const linkSchema = z.object({
  label: z.string(),
  url: z.string().refine(isValidShoppingUrl, 'Enter a valid http or https URL.'),
});

type LinkFormValues = z.infer<typeof linkSchema>;

type ShoppingLinkFormProps = {
  isSaving: boolean;
  link?: ShoppingLink | null;
  onCancel?: () => void;
  onSubmit: (values: LinkFormValues) => Promise<void>;
};

export function ShoppingLinkForm({ isSaving, link, onCancel, onSubmit }: ShoppingLinkFormProps) {
  const form = useForm<LinkFormValues>({
    resolver: zodResolver(linkSchema),
    defaultValues: { label: link?.label ?? '', url: link?.url ?? '' },
  });

  useEffect(() => {
    form.reset({ label: link?.label ?? '', url: link?.url ?? '' });
  }, [form, link]);

  async function handleSubmit(values: LinkFormValues) {
    await onSubmit({ label: values.label.trim(), url: values.url.trim() });
    if (!link) form.reset({ label: '', url: '' });
  }

  return (
    <form className="space-y-3" onSubmit={form.handleSubmit(handleSubmit)}>
      <Input label="URL" placeholder="https://..." {...form.register('url')} />
      {form.formState.errors.url ? <p className="text-sm text-rose-600">{form.formState.errors.url.message}</p> : null}
      <Input label="Label" placeholder="Myntra, Amazon, Boutique..." {...form.register('label')} />
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button isLoading={isSaving} type="submit">
          {link ? 'Save Link' : 'Add Link'}
        </Button>
        {onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}
