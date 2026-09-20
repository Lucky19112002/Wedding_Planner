import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ErrorState } from '@/components/ui/ErrorState';
import { OutfitForm } from '@/components/outfits';
import { archiveOutfit } from '@/services/outfit.service';
import { uploadImage } from '@/services/outfitImage.service';
import { usePermission } from '@/hooks/usePermission';
import { getMyParticipantEventPermission } from '@/services/permission.service';
import { createShoppingLink } from '@/services/shoppingLink.service';
import { useOutfitStore } from '@/store/outfitStore';
import type { OutfitInput } from '@/types/domain';

export function OutfitCreatePage() {
  const { participantId } = useParams<{ participantId: string }>();
  const navigate = useNavigate();
  const createOutfit = useOutfitStore((state) => state.createOutfit);
  const error = useOutfitStore((state) => state.error);
  const saving = useOutfitStore((state) => state.saving);
  const canCreateOutfits = usePermission('outfits', 'create');
  const [eventCanManage, setEventCanManage] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [links, setLinks] = useState([{ label: '', url: '' }]);
  const [referenceError, setReferenceError] = useState<string | null>(null);
  const [savingReferences, setSavingReferences] = useState(false);

  useEffect(() => {
    if (!participantId) return;
    void getMyParticipantEventPermission(participantId)
      .then((level) => setEventCanManage(level === 'edit'))
      .catch(() => setEventCanManage(false));
  }, [participantId]);


  const validLinks = useMemo(
    () => links.map((link) => ({ label: link.label.trim(), url: link.url.trim() })).filter((link) => link.url),
    [links],
  );

  function setLink(index: number, field: 'label' | 'url', value: string) {
    setLinks((items) => items.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)));
  }

  function addFiles(selected: FileList | null) {
    if (!selected) return;
    setFiles((items) => [...items, ...Array.from(selected)].slice(0, 5));
  }

  function validateReferences() {
    if (files.some((file) => !['image/jpeg', 'image/png', 'image/webp'].includes(file.type))) {
      throw new Error('Use JPG, PNG, or WEBP images only.');
    }
    if (validLinks.length > 5) throw new Error('An outfit can have up to 5 reference URLs.');
    for (const link of validLinks) {
      const parsed = new URL(link.url);
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Use valid http or https reference URLs.');
    }
  }

  async function handleSubmit(input: OutfitInput) {
    setReferenceError(null);
    setSavingReferences(true);
    let outfitId: string | null = null;
    try {
      validateReferences();
      const outfit = await createOutfit(input);
      outfitId = outfit.id;
      await Promise.all(files.map((file, index) => uploadImage({ file, outfitId: outfit.id, weddingId: outfit.weddingId, existingCount: index })));
      await Promise.all(validLinks.map((link, index) => createShoppingLink({ ...link, outfitId: outfit.id, weddingId: outfit.weddingId }, index)));
      navigate(`/app/outfits/${outfit.id}`);
    } catch (caught) {
      if (outfitId) await archiveOutfit(outfitId).catch(() => undefined);
      setReferenceError(caught instanceof Error ? caught.message : 'Outfit references could not be saved.');
      throw caught;
    } finally {
      setSavingReferences(false);
    }
  }

  if (!participantId) return <ErrorState message="Participant not found." />;
  if (!canCreateOutfits && !eventCanManage) {
    return <ErrorState message="You can view clothing for this event, but you cannot add outfits." />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Link className="text-sm font-medium text-brand-700" to="/app/events">
        Back to events
      </Link>
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">New Outfit</h1>
        <p className="mt-2 text-sm text-slate-600">Create a look with dress type, colour, quantity, status, and notes.</p>
      </div>
      {error || referenceError ? <ErrorState message={error ?? referenceError ?? ''} /> : null}
      <Card>
        <OutfitForm
          isSaving={saving || savingReferences}
          participantId={participantId}
          submitLabel="Create Outfit"
          onSubmit={handleSubmit}
        >
          <div className="space-y-5 rounded-md border border-slate-200 bg-slate-50 p-4">
            <div>
              <label className="text-sm font-medium text-slate-700" htmlFor="outfit-images">Images</label>
              <input
                id="outfit-images"
                accept="image/jpeg,image/png,image/webp"
                className="mt-2 block w-full text-sm text-slate-700"
                multiple
                type="file"
                onChange={(event) => addFiles(event.target.files)}
              />
              <p className="mt-2 text-sm text-slate-600">{files.length}/5 images selected.</p>
              {files.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {files.map((file, index) => (
                    <span key={`${file.name}-${index}`} className="rounded-full bg-white px-3 py-1 text-xs text-slate-700">
                      {file.name}
                      <button className="ml-2 text-rose-600" type="button" onClick={() => setFiles((items) => items.filter((_, itemIndex) => itemIndex !== index))}>
                        Remove
                      </button>
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-medium text-slate-700">Reference URLs</h2>
                <Button disabled={links.length >= 5} type="button" variant="secondary" onClick={() => setLinks((items) => [...items, { label: '', url: '' }])}>
                  Add URL
                </Button>
              </div>
              {links.map((link, index) => (
                <div key={index} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                  <Input label="URL" placeholder="https://..." value={link.url} onChange={(event) => setLink(index, 'url', event.target.value)} />
                  <Input label="Label" placeholder="Amazon, Myntra, Pinterest..." value={link.label} onChange={(event) => setLink(index, 'label', event.target.value)} />
                  <Button className="self-end" type="button" variant="ghost" onClick={() => setLinks((items) => items.filter((_, itemIndex) => itemIndex !== index))}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </OutfitForm>
      </Card>
    </div>
  );
}
