import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useLocation } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email.'),
  password: z.string().min(1, 'Password is required.'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/app';
  const form = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  async function onSubmit(values: LoginForm) {
    setError(null);
    if (!isSupabaseConfigured) {
      setError('Supabase public environment variables are missing.');
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword(values);
    if (authError) {
      setError(authError.message);
    }
  }

  return (
    <section className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-16">
      <Card>
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <form className="mt-6 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <Input label="Email" type="email" autoComplete="email" {...form.register('email')} />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            {...form.register('password')}
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button type="submit" className="w-full" isLoading={form.formState.isSubmitting}>
            Sign in
          </Button>
        </form>
      </Card>
    </section>
  );
}
