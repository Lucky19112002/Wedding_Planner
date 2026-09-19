import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function PublicHomePage() {
  return (
    <section className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-4 py-16">
      <Card className="bg-white/10 text-white ring-white/15">
        <p className="text-sm font-medium text-violet-200">Wedding Planner</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal">React foundation ready.</h1>
        <p className="mt-4 text-slate-200">
          Authentication, routing, layout, state, and UI primitives are in place.
        </p>
        <Button asChild className="mt-6">
          <Link to="/login">Continue</Link>
        </Button>
      </Card>
    </section>
  );
}
