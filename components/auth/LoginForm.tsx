'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Field';
import { safeRedirect } from '@/lib/utils';
import { fieldErrors, loginSchema } from '@/lib/validations';
import { GoogleIcon } from './AuthCard';

const ERRORS: Record<string, string> = {
  OAuthAccountNotLinked: 'This email is already registered. Please sign in with your password.',
  AccessDenied: 'Sign-in was cancelled or your Google email is not verified.',
  Configuration: 'Sign-in is temporarily unavailable. Please try again later.',
};

export function LoginForm({ callbackUrl, googleEnabled, initialError }: { callbackUrl?: string; googleEnabled: boolean; initialError?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState(initialError ? ERRORS[initialError] ?? 'Sign-in failed. Please try again.' : '');
  const [loading, setLoading] = useState(false);
  const destination = safeRedirect(callbackUrl, '/account');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});
    setLoading(true);
    const result = await signIn('credentials', { ...parsed.data, redirect: false });
    if (!result || result.error) {
      setFormError(
        result?.code === 'rate_limited'
          ? 'Too many sign-in attempts. Please wait 15 minutes and try again, or reset your password.'
          : result?.code === 'service_unavailable'
            ? 'Sign-in is temporarily unavailable. Please try again shortly.'
            : 'The email or password you entered is incorrect.',
      );
      setLoading(false);
      return;
    }
    router.replace(destination);
    router.refresh();
  }

  return (
    <div>
      {googleEnabled && (
        <>
          <Button variant="outline" size="lg" className="w-full border-line" onClick={() => signIn('google', { redirectTo: destination })}>
            <GoogleIcon /> Continue with Google
          </Button>
          <div className="my-6 flex items-center gap-4 text-xs uppercase tracking-widest text-muted">
            <span className="h-px flex-1 bg-line" /> or <span className="h-px flex-1 bg-line" />
          </div>
        </>
      )}
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {formError && (
          <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
            {formError}
          </p>
        )}
        <Field label="Email address" error={errors.email}>
          {(id, d) => (
            <Input id={id} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} invalid={!!errors.email} aria-describedby={d} />
          )}
        </Field>
        <Field label="Password" error={errors.password}>
          {(id, d) => (
            <div className="relative">
              <Input
                id={id}
                type={show ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                invalid={!!errors.password}
                aria-describedby={d}
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-muted hover:text-ink"
                aria-label={show ? 'Hide password' : 'Show password'}
              >
                {show ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
              </button>
            </div>
          )}
        </Field>
        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-sm font-medium text-brand hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" size="lg" className="w-full" loading={loading}>
          Sign In
        </Button>
      </form>
    </div>
  );
}
