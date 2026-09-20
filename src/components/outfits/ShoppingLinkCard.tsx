import { Button } from '@/components/ui/Button';
import type { ShoppingLink } from '@/types/domain';
import { detectLinkProvider, getLinkDomain } from '@/utils/shoppingLinks';

type ShoppingLinkCardProps = {
  link: ShoppingLink;
  onCopy: (url: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (link: ShoppingLink) => void;
};

export function ShoppingLinkCard({ link, onCopy, onDelete, onEdit }: ShoppingLinkCardProps) {
  const provider = detectLinkProvider(link.url);

  return (
    <div className="flex flex-col gap-3 rounded-md border border-slate-200 bg-white p-4 sm:flex-row sm:items-center">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-brand-50 font-semibold text-brand-700">
        {provider.icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-slate-900">{link.label || provider.name}</p>
        <p className="truncate text-sm text-slate-600">{getLinkDomain(link.url)}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="secondary">
          <a href={link.url} rel="noreferrer" target="_blank">
            Open
          </a>
        </Button>
        <Button type="button" variant="ghost" onClick={() => onCopy(link.url)}>
          Copy
        </Button>
        {onEdit ? (
          <Button type="button" variant="ghost" onClick={() => onEdit(link)}>
            Edit
          </Button>
        ) : null}
        {onDelete ? (
          <Button type="button" variant="ghost" onClick={() => onDelete(link.id)}>
            Delete
          </Button>
        ) : null}
      </div>
    </div>
  );
}
