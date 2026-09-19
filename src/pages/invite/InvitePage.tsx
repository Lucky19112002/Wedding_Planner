import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { Input } from '@/components/ui/Input';
import { Loader } from '@/components/ui/Loader';
import { useAuth } from '@/hooks/useAuth';
import {
  createInvitedAccountAndAccept,
  getInvitationDetails,
  signInInvitedAccountAndAccept,
  type InvitationDetails,
} from '@/services/invitation.service';
import { useInvitationStore } from '@/store/invitationStore';
import { useWeddingStore } from '@/store/weddingStore';
import { weddingRoleLabels } from '@/utils/permissions';

type InviteState = 'valid' | 'accepted' | 'rejected' | 'expired' | 'cancelled' | 'invalid';

const signupSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    confirmPassword: z.string().min(1, 'Confirm your password.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords must match.',
    path: ['confirmPassword'],
  });

type SignupForm = z.infer<typeof signupSchema>;

const signInSchema = z.object({
  password: z.string().min(1, 'Password is required.'),
});

type SignInForm = z.infer<typeof signInSchema>;

function classifyInviteError(message: string): InviteState {
  const normalized = message.toLowerCase();
  if (normalized.includes('expired')) return 'expired';
  if (normalized.includes('not found') || normalized.includes('not active')) return 'invalid';
  return 'invalid';
}

function toInviteState(details: InvitationDetails | null): InviteState {
  if (!details) return 'invalid';
  if (details.status === 'pending') return 'valid';
  if (details.status === 'expired') return 'expired';
  return details.status;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(value));
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

export function InvitePage() {
  const { token = '' } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, session } = useAuth();
  const [state, setState] = useState<InviteState>(token ? 'valid' : 'invalid');
  const [message, setMessage] = useState<string | null>(null);
  const [details, setDetails] = useState<InvitationDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(Boolean(token));
  const saving = useInvitationStore((store) => store.saving);
  const acceptInvitation = useInvitationStore((store) => store.acceptInvitation);
  const rejectInvitation = useInvitationStore((store) => store.rejectInvitation);
  const loadWeddingContext = useWeddingStore((store) => store.loadWeddingContext);
  const signupForm = useForm<SignupForm>({ resolver: zodResolver(signupSchema) });
  const signInForm = useForm<SignInForm>({ resolver: zodResolver(signInSchema) });

  useEffect(() => {
    if (!token) {
      return;
    }

    let mounted = true;

    void getInvitationDetails(token)
      .then((nextDetails) => {
        if (!mounted) return;
        const nextState = toInviteState(nextDetails);
        setDetails(nextDetails);
        if (nextState !== 'valid') {
          setMessage(`This invitation is ${nextState}.`);
        }
        setState(nextState);
        setDetailsLoading(false);
      })
      .catch((error) => {
        if (!mounted) return;
        setState(classifyInviteError(error instanceof Error ? error.message : 'Invalid invitation.'));
        setMessage(error instanceof Error ? error.message : 'Invalid invitation.');
        setDetailsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [token]);

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

  async function handleSignup(values: SignupForm) {
    if (!details) return;
    try {
      const userId = await createInvitedAccountAndAccept({
        token,
        email: details.email,
        password: values.password,
        displayName: details.email.split('@')[0],
      });
      await loadWeddingContext(userId);
      setState('accepted');
      setMessage('Invitation accepted. Your wedding workspace is ready.');
      navigate('/app');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Account could not be created.';
      if (errorMessage.toLowerCase().includes('already')) {
        setDetails((current) => (current ? { ...current, existingAccount: true } : current));
        setState('valid');
      } else {
        setState(classifyInviteError(errorMessage));
      }
      setMessage(errorMessage);
    }
  }

  async function handleSignIn(values: SignInForm) {
    if (!details) return;
    try {
      const userId = await signInInvitedAccountAndAccept({
        token,
        email: details.email,
        password: values.password,
      });
      await loadWeddingContext(userId);
      setState('accepted');
      setMessage('Invitation accepted. Your wedding workspace is ready.');
      navigate('/app');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed.';
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

  if (isLoading || detailsLoading) return <Loader label="Checking invitation" />;

  return (
    <section className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-4 py-16">
      <Card className="space-y-5">
        <div className="space-y-3">
          <Badge>{state}</Badge>
          <div>
            <p className="text-sm font-medium text-brand-700">Wedding invitation</p>
            <h1 className="mt-1 text-2xl font-semibold">{details?.weddingName ?? 'Wedding invitation'}</h1>
            {details ? <p className="mt-1 text-sm text-slate-600">{formatDate(details.weddingDate)}</p> : null}
          </div>
        </div>

        {details ? (
          <dl className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-slate-500">Wedding</dt>
              <dd className="font-medium text-slate-950">{details.weddingName}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Invited email</dt>
              <dd className="font-medium text-slate-950">{details.email}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Role</dt>
              <dd className="font-medium text-slate-950">{weddingRoleLabels[details.invitedRole]}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Status</dt>
              <dd className="font-medium capitalize text-slate-950">{state}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Expires</dt>
              <dd className="font-medium text-slate-950">{formatDateTime(details.expiresAt)}</dd>
            </div>
          </dl>
        ) : null}

        {message ? (
          state === 'accepted' || state === 'rejected' ? (
            <p className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>
          ) : (
            <ErrorState message={message} />
          )
        ) : null}

        {!isAuthenticated && state === 'valid' && details?.existingAccount ? (
          <form className="space-y-4" onSubmit={signInForm.handleSubmit(handleSignIn)}>
            <div>
              <h2 className="text-lg font-semibold">Sign in</h2>
              <p className="text-sm text-slate-600">This email already has an account.</p>
            </div>
            <Input label="Email" value={details.email} readOnly />
            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              {...signInForm.register('password')}
            />
            {signInForm.formState.errors.password ? (
              <p className="text-sm text-red-600">{signInForm.formState.errors.password.message}</p>
            ) : null}
            <Button className="w-full" type="submit" isLoading={signInForm.formState.isSubmitting}>
              Sign in and join wedding
            </Button>
          </form>
        ) : !isAuthenticated && state === 'valid' && details ? (
          <form className="space-y-4" onSubmit={signupForm.handleSubmit(handleSignup)}>
            <div>
              <h2 className="text-lg font-semibold">Create account</h2>
              <p className="text-sm text-slate-600">
                Create your own password to join this wedding workspace.
              </p>
            </div>
            <Input label="Email" value={details.email} readOnly />
            <Input
              label="Create password"
              type="password"
              autoComplete="new-password"
              {...signupForm.register('password')}
            />
            {signupForm.formState.errors.password ? (
              <p className="text-sm text-red-600">{signupForm.formState.errors.password.message}</p>
            ) : null}
            <Input
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              {...signupForm.register('confirmPassword')}
            />
            {signupForm.formState.errors.confirmPassword ? (
              <p className="text-sm text-red-600">{signupForm.formState.errors.confirmPassword.message}</p>
            ) : null}
            <Button className="w-full" type="submit" isLoading={signupForm.formState.isSubmitting}>
              Create account
            </Button>
          </form>
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
