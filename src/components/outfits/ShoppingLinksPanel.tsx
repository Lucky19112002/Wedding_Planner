import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { Loader } from '@/components/ui/Loader';
import { ShoppingLinkCard } from '@/components/outfits/ShoppingLinkCard';
import { ShoppingLinkForm } from '@/components/outfits/ShoppingLinkForm';
import { useShoppingLinkStore } from '@/store/shoppingLinkStore';
import type { Outfit, ShoppingLink } from '@/types/domain';

export function ShoppingLinksPanel({ outfit }: { outfit: Outfit }) {
  const links = useShoppingLinkStore((state) => state.links);
  const loading = useShoppingLinkStore((state) => state.loading);
  const saving = useShoppingLinkStore((state) => state.saving);
  const error = useShoppingLinkStore((state) => state.error);
  const loadLinks = useShoppingLinkStore((state) => state.loadLinks);
  const createLink = useShoppingLinkStore((state) => state.createLink);
  const updateLink = useShoppingLinkStore((state) => state.updateLink);
  const deleteLink = useShoppingLinkStore((state) => state.deleteLink);
  const [editing, setEditing] = useState<ShoppingLink | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    void loadLinks(outfit.id);
  }, [loadLinks, outfit.id]);

  return (
    <Card className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Shopping links</h2>
        <p className="text-sm text-slate-600">{links.length}/5 saved links.</p>
      </div>

      {error ? <ErrorState message={error} /> : null}
      {loading ? <Loader label="Loading links" /> : null}

      {!loading && links.length === 0 ? (
        <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
          Add boutiques, marketplaces, Pinterest ideas, or Instagram references for this outfit.
        </div>
      ) : null}

      {links.length > 0 ? (
        <div className="space-y-3">
          {links.map((link) => (
            <ShoppingLinkCard
              key={link.id}
              link={link}
              onCopy={(url) => {
                void navigator.clipboard.writeText(url);
                setCopiedId(link.id);
              }}
              onDelete={(id) => {
                if (window.confirm('Delete this shopping link?')) void deleteLink(id);
              }}
              onEdit={setEditing}
            />
          ))}
        </div>
      ) : null}

      {copiedId ? <p className="text-sm text-emerald-700">Link copied.</p> : null}

      {editing ? (
        <ShoppingLinkForm
          isSaving={saving}
          link={editing}
          onCancel={() => setEditing(null)}
          onSubmit={async (values) => {
            await updateLink(editing.id, { ...values, outfitId: outfit.id, weddingId: outfit.weddingId });
            setEditing(null);
          }}
        />
      ) : links.length < 5 ? (
        <ShoppingLinkForm
          isSaving={saving}
          onSubmit={(values) => createLink({ ...values, outfitId: outfit.id, weddingId: outfit.weddingId })}
        />
      ) : (
        <p className="rounded-md bg-slate-100 p-3 text-sm text-slate-600">This outfit already has 5 links.</p>
      )}
    </Card>
  );
}
