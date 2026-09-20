import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { Loader } from '@/components/ui/Loader';
import { OutfitForm } from '@/components/outfits';
import { getMyEventPermission } from '@/services/permission.service';
import { useOutfitStore } from '@/store/outfitStore';
import type { OutfitInput } from '@/types/domain';

export function OutfitEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const outfit = useOutfitStore((state) => state.selectedOutfit);
  const error = useOutfitStore((state) => state.error);
  const loading = useOutfitStore((state) => state.loading);
  const saving = useOutfitStore((state) => state.saving);
  const loadOutfit = useOutfitStore((state) => state.loadOutfit);
  const updateOutfit = useOutfitStore((state) => state.updateOutfit);
  const [canManage, setCanManage] = useState(false);

  useEffect(() => {
    if (id) void loadOutfit(id);
  }, [id, loadOutfit]);

  useEffect(() => {
    if (!outfit) return;
    void getMyEventPermission(outfit.eventId)
      .then((level) => setCanManage(level === 'edit'))
      .catch(() => setCanManage(false));
  }, [outfit]);

  async function handleSubmit(input: OutfitInput) {
    if (!id) return;
    await updateOutfit(id, input);
    navigate(`/app/outfits/${id}`);
  }

  if (loading && !outfit) return <Loader label="Loading outfit" />;
  if (error) return <ErrorState message={error} />;
  if (!outfit) return <ErrorState message="Outfit not found." />;
  if (!canManage) return <ErrorState message="You can view this outfit, but you cannot edit it." />;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Link className="text-sm font-medium text-brand-700" to={`/app/outfits/${outfit.id}`}>
        Back to outfit
      </Link>
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Edit Outfit</h1>
        <p className="mt-2 text-sm text-slate-600">Update outfit details and status.</p>
      </div>
      <Card>
        <OutfitForm
          outfit={outfit}
          isSaving={saving}
          participantId={outfit.participantId}
          submitLabel="Save Changes"
          onSubmit={handleSubmit}
        />
      </Card>
    </div>
  );
}
