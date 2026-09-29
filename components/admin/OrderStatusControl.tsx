'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ORDER_STATUSES } from '@/lib/validations';

export function OrderStatusControl({ id, status, trackingNumber }: { id: string; status: string; trackingNumber: string | null }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [tracking, setTracking] = useState(trackingNumber ?? '');
  const [saving, setSaving] = useState(false);
  const dirty = value !== status || tracking !== (trackingNumber ?? '');

  async function save() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: value, trackingNumber: tracking }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Update failed');
      toast.success('Order updated');
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Order status"
        className="rounded-lg border border-line bg-white px-2.5 py-1.5 text-sm"
      >
        {ORDER_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s.charAt(0) + s.slice(1).toLowerCase()}
          </option>
        ))}
      </select>
      <input
        value={tracking}
        onChange={(e) => setTracking(e.target.value)}
        placeholder="Tracking no."
        aria-label="Tracking number"
        className="w-32 rounded-lg border border-line px-2.5 py-1.5 text-sm"
      />
      <button
        type="button"
        onClick={save}
        disabled={!dirty || saving}
        className="rounded-lg bg-ink px-3 py-1.5 text-sm font-medium text-white disabled:opacity-40"
      >
        {saving ? 'Saving…' : 'Save'}
      </button>
    </div>
  );
}
