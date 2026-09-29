'use client';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MapPin, Plus, Star, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Field, Input, Select } from '@/components/ui/Field';
import { INDIAN_STATES, addressSchema, fieldErrors } from '@/lib/validations';

interface Address {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

const EMPTY = { name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' };

export function AddressBook() {
  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/account/addresses', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not load addresses.');
      setAddresses(data.addresses);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load addresses.');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const set = (key: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const parsed = addressSchema.safeParse(form);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      const res = await fetch('/api/account/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.fields) setErrors(data.fields);
        throw new Error(data.error || 'Could not save the address.');
      }
      toast.success('Address saved');
      setForm(EMPTY);
      setAdding(false);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not save the address.');
    } finally {
      setSaving(false);
    }
  }

  async function act(id: string, method: 'PATCH' | 'DELETE') {
    const res = await fetch(`/api/account/addresses/${id}`, { method });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast.error(data.error || 'Something went wrong.');
      return;
    }
    toast.success(data.message);
    await load();
  }

  if (error) return <p className="rounded-2xl border border-line bg-cream p-6 text-center text-muted">{error}</p>;
  if (!addresses) return <div className="skeleton h-40" />;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {addresses.map((a) => (
          <div key={a.id} className="flex flex-col rounded-2xl border border-line p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="font-semibold">{a.name}</p>
              {a.isDefault && <span className="rounded-full bg-cream px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand">Default</span>}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink/75">
              {a.line1}
              {a.line2 ? `, ${a.line2}` : ''}
              <br />
              {a.city}, {a.state} {a.pincode}
              <br />
              +91 {a.phone}
            </p>
            <div className="mt-auto flex gap-2 pt-4">
              {!a.isDefault && (
                <button type="button" onClick={() => act(a.id, 'PATCH')} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium text-brand hover:bg-cream">
                  <Star className="h-3.5 w-3.5" /> Make default
                </button>
              )}
              <button type="button" onClick={() => act(a.id, 'DELETE')} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium text-muted hover:bg-cream hover:text-danger">
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </button>
            </div>
          </div>
        ))}
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex min-h-[160px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-line text-muted transition hover:border-brand-light hover:text-brand"
          >
            {addresses.length === 0 ? <MapPin className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
            <span className="font-medium">{addresses.length === 0 ? 'Add your first address' : 'Add a new address'}</span>
          </button>
        )}
      </div>

      {adding && (
        <form onSubmit={save} noValidate className="rounded-2xl border border-line p-6">
          <h2 className="mb-5 text-lg font-semibold">New address</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Full name" error={errors.name}>
              {(id, d) => <Input id={id} autoComplete="name" value={form.name} onChange={set('name')} invalid={!!errors.name} aria-describedby={d} />}
            </Field>
            <Field label="Mobile number" error={errors.phone}>
              {(id, d) => <Input id={id} type="tel" inputMode="numeric" value={form.phone} onChange={set('phone')} invalid={!!errors.phone} aria-describedby={d} />}
            </Field>
            <Field label="House / flat no., building, street" error={errors.line1} className="sm:col-span-2">
              {(id, d) => <Input id={id} autoComplete="address-line1" value={form.line1} onChange={set('line1')} invalid={!!errors.line1} aria-describedby={d} />}
            </Field>
            <Field label="Area, landmark" optional error={errors.line2} className="sm:col-span-2">
              {(id, d) => <Input id={id} autoComplete="address-line2" value={form.line2} onChange={set('line2')} invalid={!!errors.line2} aria-describedby={d} />}
            </Field>
            <Field label="City" error={errors.city}>
              {(id, d) => <Input id={id} autoComplete="address-level2" value={form.city} onChange={set('city')} invalid={!!errors.city} aria-describedby={d} />}
            </Field>
            <Field label="PIN code" error={errors.pincode}>
              {(id, d) => <Input id={id} inputMode="numeric" maxLength={6} autoComplete="postal-code" value={form.pincode} onChange={set('pincode')} invalid={!!errors.pincode} aria-describedby={d} />}
            </Field>
            <Field label="State" error={errors.state} className="sm:col-span-2">
              {(id, d) => (
                <Select id={id} value={form.state} onChange={set('state')} invalid={!!errors.state} aria-describedby={d}>
                  <option value="">Select your state</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
          </div>
          <div className="mt-6 flex gap-3">
            <Button type="submit" loading={saving}>
              Save address
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setAdding(false);
                setErrors({});
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
