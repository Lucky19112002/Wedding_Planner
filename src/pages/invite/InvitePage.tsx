import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { Loader } from '@/components/ui/Loader';
import { useAuth } from '@/hooks/useAuth';
import { getInvitationState } from '@/services/invitation.service';
import { useInvitationStore } from '@/store/invitationStore';
import { useWeddingStore } from '@/store/weddingStore';

type InviteState = 'valid' | 'accepted' | 'rejected' | 'expired' | 'cancelled' | 'invalid';

function classifyInviteError(message: string): InviteState {
  const normalized = message.toLowerCase();
  if (normalized.includes('expired')) return 'expired';
  if (normalized.includes('not found') || normalized.includes('not active')) return 'invalid';
  return 'invalid';
}

export function InvitePage() {
  const { token = '' } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, session } = useAuth();
  const [state, setState] = useState<InviteState>(token ? 'valid' : 'invalid');
  const [message, setMessage] = useState<string | null>(null);
  const saving = useInvitationStore((store) => store.saving);
  const acceptInvitation = useInvitationStore((store) => store.acceptInvitation);
  const rejectInvitation = useInvitationStore((store) => store.rejectInvitation);
  const loadWeddingContext = useWeddingStore((store) => store.loadWeddingContext);
  const loginState = useMemo(() => ({ from: { pathname: `/invite/${token}` } }), [token]);

  useEffect(() => {
    if (!isAuthenticated || !token) return;
    let mounted = true;
    void getInvitationState(token)
      .then((nextState) => {
        if (!mounted) return;
        setState(nextState);
        if (nextState !== 'valid') {
          setMessage(`This invitation is ${nextState}.`);
        }
      })
      .catch((error) => {
        if (!mounted) return;
        setState(classifyInviteError(error instanceof Error ? error.message : 'Invalid invitation.'));
        setMessage(error instanceof Error ? error.message : 'Invalid invitation.');
      });

    return () => {
      mounted = false;
    };
  }, [isAuthenticated, token]);

  async function handleAccept() {
    try {
      await acceptInvitation(token);
      if (session?.user.id) await loadWeddingContext(session.user.id);
      setState('accepted');
      setMessage('Invitation accepted. Your wedding workspace is ready.');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invitation could not be accepted.';
      setState(classifyInviteError(errorMessage));
      setMessage(errorMessage);
    }
  }

  async function handleReject() {
    try {
      await rejectInvitation(token);
      setState('rejected');
      setMessage('Invitation rejected.');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invitation could not be rejected.';
      setState(classifyInviteError(errorMessage));
      setMessage(errorMessage);
    }
  }

  if (isLoading) return <Loader label="Checking invitation" />;

  return (
    <section className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-4 py-16">
      <Card className="space-y-5">
        <div className="space-y-2">
          <Badge>{state}</Badge>
          <h1 className="text-2xl font-semibold">Wedding invitation</h1>
          <p className="text-sm text-slate-600">
            Accept or reject this invitation with the same email address it was sent to.
          </p>
        </div>

        {message ? (
          state === 'accepted' || state === 'rejected' ? (
            <p className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>
          ) : (
            <ErrorState message={message} />
          )
        ) : null}

        {!isAuthenticated ? (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              Sign in first. Supabase will verify that your account email matches the invite.
            </p>
            <Button asChild className="w-full">
              <Link to="/login" state={loginState}>
                Sign in to respond
              </Link>
            </Button>
          </div>
        ) : state === 'accepted' ? (
          <Button className="w-full" type="button" onClick={() => navigate('/app')}>
            Open workspace
          </Button>
        ) : state === 'rejected' || state === 'cancelled' || state === 'expired' || state === 'invalid' ? (
          <Button asChild className="w-full" variant="secondary">
            <Link to="/">Back to home</Link>
          </Button>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            <Button type="button" isLoading={saving} onClick={handleAccept}>
              Accept invitation
            </Button>
            <Button type="button" variant="secondary" disabled={saving} onClick={handleReject}>
              Reject invitation
            </Button>
          </div>
        )}
      </Card>
    </section>
  );
}
