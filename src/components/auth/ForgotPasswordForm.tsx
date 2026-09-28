'use client';

import { useState } from 'react';
import { MailCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Field';
import { forgotPasswordSchema } from '@/lib/validations';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const parsed = forgotPasswordSchema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
      setSent(data.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="text-center">
        <MailCheck className="mx-auto h-10 w-10 text-success" strokeWidth={1.5} />
        <p className="mt-4 text-[15px] text-ink/80">{sent}</p>
        <p className="mt-2 text-sm text-muted">Don’t see it? Check your spam folder.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <Field label="Email address" error={error}>
        {(id, d) => (
          <Input id={id} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} invalid={!!error} aria-describedby={d} />
        )}
      </Field>
      <Button type="submit" size="lg" className="w-full" loading={loading}>
        Send reset link
      </Button>
    </form>
  );
}
