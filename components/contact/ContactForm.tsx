'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Field, Input, Select, Textarea } from '@/components/ui/Field';
import { CONTACT_SUBJECTS, contactSchema, fieldErrors } from '@/lib/validations';

const EMPTY = { name: '', email: '', phone: '', subject: '', message: '' };

export function ContactForm() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [sent, setSent] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.fields) setErrors(data.fields);
        throw new Error(data.error || 'We could not send your message.');
      }
      setSent(data.message);
      setForm(EMPTY);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'We could not send your message.');
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="flex min-h-[380px] flex-col items-center justify-center rounded-2xl bg-cream p-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-success" strokeWidth={1.5} />
        <p className="mt-4 text-xl font-semibold">Message sent</p>
        <p className="mt-2 max-w-sm text-muted">{sent}</p>
        <Button variant="outline" className="mt-6" onClick={() => setSent('')}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {formError && (
        <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger sm:col-span-2">
          {formError}
        </p>
      )}
      <Field label="Your name" error={errors.name}>
        {(id, d) => <Input id={id} autoComplete="name" value={form.name} onChange={set('name')} invalid={!!errors.name} aria-describedby={d} />}
      </Field>
      <Field label="Email address" error={errors.email}>
        {(id, d) => <Input id={id} type="email" autoComplete="email" value={form.email} onChange={set('email')} invalid={!!errors.email} aria-describedby={d} />}
      </Field>
      <Field label="Mobile number" optional error={errors.phone}>
        {(id, d) => <Input id={id} type="tel" inputMode="numeric" autoComplete="tel-national" value={form.phone} onChange={set('phone')} invalid={!!errors.phone} aria-describedby={d} />}
      </Field>
      <Field label="Subject" error={errors.subject}>
        {(id, d) => (
          <Select id={id} value={form.subject} onChange={set('subject')} invalid={!!errors.subject} aria-describedby={d}>
            <option value="">Choose a subject</option>
            {CONTACT_SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <Field label="Message" error={errors.message} className="sm:col-span-2">
        {(id, d) => <Textarea id={id} value={form.message} onChange={set('message')} maxLength={2000} invalid={!!errors.message} aria-describedby={d} placeholder="How can we help?" />}
      </Field>
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" loading={loading}>
          Send message
        </Button>
      </div>
    </form>
  );
}
