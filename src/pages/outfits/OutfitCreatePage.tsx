import { Link, useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { OutfitForm } from '@/components/outfits';
import { useOutfitStore } from '@/store/outfitStore';
import type { OutfitInput } from '@/types/domain';

export function OutfitCreatePage() {
  const { participantId } = useParams<{ participantId: string }>();
  const navigate = useNavigate();
  const createOutfit = useOutfitStore((state) => state.createOutfit);
  const error = useOutfitStore((state) => state.error);
  const saving = useOutfitStore((state) => state.saving);

  async function handleSubmit(input: OutfitInput) {
    const outfit = await createOutfit(input);
    navigate(`/app/outfits/${outfit.id}`);
  }

  if (!participantId) return <ErrorState message="Participant not found." />;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Link className="text-sm font-medium text-brand-700" to="/app/events">
        Back to events
      </Link>
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">New Outfit</h1>
        <p className="mt-2 text-sm text-slate-600">Create a look with dress type, colour, quantity, status, and notes.</p>
      </div>
      {error ? <ErrorState message={error} /> : null}
      <Card>
        <OutfitForm
          isSaving={saving}
          participantId={participantId}
          submitLabel="Create Outfit"
          onSubmit={handleSubmit}
        />
      </Card>
    </div>
  );
}
