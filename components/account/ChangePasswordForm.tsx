'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Field';
import { changePasswordSchema, fieldErrors } from '@/lib/validations';

const EMPTY = { currentPassword: '', newPassword: '', confirmPassword: '' };

export function ChangePasswordForm() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = changePasswordSchema.safeParse(form);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch('/api/account/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.fields) setErrors(data.fields);
        throw new Error(data.error || 'Could not change your password.');
      }
      toast.success(data.message);
      setForm(EMPTY);
      // The server ended every session on this account; sign in again.
      await signOut({ redirectTo: '/login?callbackUrl=/account' });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not change your password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-md space-y-5">
      <Field label="Current password" error={errors.currentPassword}>
        {(id, d) => <Input id={id} type="password" autoComplete="current-password" value={form.currentPassword} onChange={set('currentPassword')} invalid={!!errors.currentPassword} aria-describedby={d} />}
      </Field>
      <Field label="New password" error={errors.newPassword} hint="At least 8 characters, with upper & lowercase letters and a number.">
        {(id, d) => <Input id={id} type="password" autoComplete="new-password" value={form.newPassword} onChange={set('newPassword')} invalid={!!errors.newPassword} aria-describedby={d} />}
      </Field>
      <Field label="Confirm new password" error={errors.confirmPassword}>
        {(id, d) => <Input id={id} type="password" autoComplete="new-password" value={form.confirmPassword} onChange={set('confirmPassword')} invalid={!!errors.confirmPassword} aria-describedby={d} />}
      </Field>
      <Button type="submit" loading={loading}>
        Update password
      </Button>
    </form>
  );
}
