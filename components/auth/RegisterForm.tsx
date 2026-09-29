'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Field';
import { safeRedirect } from '@/lib/utils';
import { fieldErrors, registerSchema } from '@/lib/validations';
import { GoogleIcon } from './AuthCard';

export function RegisterForm({ callbackUrl, googleEnabled }: { callbackUrl?: string; googleEnabled: boolean }) {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const destination = safeRedirect(callbackUrl, '/account');

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    const parsed = registerSchema.safeParse(form);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.fields) setErrors(data.fields);
        throw new Error(data.error || 'We could not create your account.');
      }
      const login = await signIn('credentials', { email: parsed.data.email, password: form.password, redirect: false });
      toast.success('Welcome to AM Fragrances!');
      if (login?.error) {
        router.replace('/login');
        return;
      }
      router.replace(destination);
      router.refresh();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Something went wrong.');
      setLoading(false);
    }
  }

  return (
    <div>
      {googleEnabled && (
        <>
          <Button variant="outline" size="lg" className="w-full border-line" onClick={() => signIn('google', { redirectTo: destination })}>
            <GoogleIcon /> Sign up with Google
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
        <Field label="Full name" error={errors.name}>
          {(id, d) => <Input id={id} autoComplete="name" value={form.name} onChange={set('name')} invalid={!!errors.name} aria-describedby={d} />}
        </Field>
        <Field label="Email address" error={errors.email}>
          {(id, d) => <Input id={id} type="email" autoComplete="email" value={form.email} onChange={set('email')} invalid={!!errors.email} aria-describedby={d} />}
        </Field>
        <Field label="Mobile number" optional error={errors.phone}>
          {(id, d) => (
            <Input id={id} type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="98765 43210" value={form.phone} onChange={set('phone')} invalid={!!errors.phone} aria-describedby={d} />
          )}
        </Field>
        <Field label="Password" error={errors.password} hint="At least 8 characters, with upper & lowercase letters and a number.">
          {(id, d) => (
            <Input id={id} type="password" autoComplete="new-password" value={form.password} onChange={set('password')} invalid={!!errors.password} aria-describedby={d} />
          )}
        </Field>
        <Field label="Confirm password" error={errors.confirmPassword}>
          {(id, d) => (
            <Input id={id} type="password" autoComplete="new-password" value={form.confirmPassword} onChange={set('confirmPassword')} invalid={!!errors.confirmPassword} aria-describedby={d} />
          )}
        </Field>
        <p className="text-[13px] text-muted">
          By creating an account you agree to our{' '}
          <Link href="/terms" className="underline underline-offset-2 hover:text-ink">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-ink">
            Privacy Policy
          </Link>
          .
        </p>
        <Button type="submit" size="lg" className="w-full" loading={loading}>
          Create Account
        </Button>
      </form>
    </div>
  );
}
