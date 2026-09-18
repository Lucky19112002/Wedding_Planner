import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';

export function UnauthorizedState() {
  const { signOut } = useAuth();

  return (
    <section className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-16">
      <Card className="text-center">
        <h1 className="text-2xl font-semibold text-slate-950">Access unavailable</h1>
        <p className="mt-3 text-sm text-slate-600">
          Your account is signed in, but no active wedding membership is available.
        </p>
        <Button className="mt-6 w-full" onClick={() => void signOut()}>
          Log out
        </Button>
      </Card>
    </section>
  );
}
