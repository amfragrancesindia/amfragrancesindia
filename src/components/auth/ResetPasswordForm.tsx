'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { fieldErrors, resetPasswordSchema } from '@/lib/validations';

export function ResetPasswordForm({ email, token }: { email: string; token: string }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    const parsed = resetPasswordSchema.safeParse({ email, token, password, confirmPassword });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.fields) setErrors(data.fields);
        throw new Error(data.error || 'We could not reset your password.');
      }
      setDone(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'We could not reset your password.');
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-success" strokeWidth={1.5} />
        <p className="mt-4 text-[15px] text-ink/80">Your password has been updated.</p>
        <ButtonLink href="/login" size="lg" className="mt-6 w-full">
          Sign in
        </ButtonLink>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {formError && (
        <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
          {formError}
        </p>
      )}
      <Field label="New password" error={errors.password} hint="At least 8 characters, with upper & lowercase letters and a number.">
        {(id, d) => (
          <PasswordInput id={id} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} invalid={!!errors.password} aria-describedby={d} />
        )}
      </Field>
      <Field label="Confirm new password" error={errors.confirmPassword}>
        {(id, d) => (
          <PasswordInput
            id={id}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            invalid={!!errors.confirmPassword}
            aria-describedby={d}
          />
        )}
      </Field>
      <Button type="submit" size="lg" className="w-full" loading={loading}>
        Update password
      </Button>
    </form>
  );
}
