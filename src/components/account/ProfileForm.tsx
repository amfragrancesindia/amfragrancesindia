'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Field';
import { fieldErrors, profileSchema } from '@/lib/validations';

export function ProfileForm({ name, phone, email }: { name: string; phone: string; email: string }) {
  const router = useRouter();
  const [form, setForm] = useState({ name, phone });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = profileSchema.safeParse(form);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch('/api/account/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.fields) setErrors(data.fields);
        throw new Error(data.error || 'Could not save your profile.');
      }
      toast.success('Profile saved');
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not save your profile.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <Field label="Full name" error={errors.name}>
        {(id, d) => (
          <Input id={id} autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} invalid={!!errors.name} aria-describedby={d} />
        )}
      </Field>
      <Field label="Mobile number" optional error={errors.phone}>
        {(id, d) => (
          <Input
            id={id}
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            invalid={!!errors.phone}
            aria-describedby={d}
          />
        )}
      </Field>
      <Field label="Email address" hint="Contact us to change the email on your account." className="sm:col-span-2">
        {(id, d) => <Input id={id} value={email} disabled aria-describedby={d} />}
      </Field>
      <div className="sm:col-span-2">
        <Button type="submit" loading={loading}>
          Save changes
        </Button>
      </div>
    </form>
  );
}
