'use client';

import { useState } from 'react';
import { Tag, X } from 'lucide-react';
import { useCart } from '@/components/providers/CartProvider';
import { cn } from '@/lib/utils';

// Rendered inside the checkout <form>, so it deliberately avoids its own
// <form> element (nested forms are invalid HTML).
export function CouponForm() {
  const { coupon, totals, applyCoupon, removeCoupon } = useCart();
  const [code, setCode] = useState('');
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const apply = () => {
    const result = applyCoupon(code);
    setMessage({ ok: result.ok, text: result.message });
    if (result.ok) setCode('');
  };

  if (coupon) {
    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between rounded-xl border border-dashed border-brand-light/60 bg-white px-4 py-2.5">
          <span className="flex items-center gap-2 text-sm font-semibold tracking-wide text-brand">
            <Tag className="h-4 w-4" /> {coupon}
          </span>
          <button
            type="button"
            onClick={() => {
              removeCoupon();
              setMessage(null);
            }}
            className="grid h-7 w-7 place-items-center rounded-full text-muted hover:bg-cream hover:text-ink"
            aria-label={`Remove coupon ${coupon}`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className={cn('text-[13px]', totals.couponError ? 'text-danger' : 'text-success')} role="status">
          {totals.couponError ?? `You save ₹${totals.discount.toLocaleString('en-IN')} with this code.`}
        </p>
      </div>
    );
  }

  return (
    <div>
      <label htmlFor="coupon" className="mb-1.5 block text-sm font-medium text-ink/85">
        Coupon code
      </label>
      <div className="flex gap-2">
        <input
          id="coupon"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              apply();
            }
          }}
          placeholder="e.g. WELCOME10"
          autoComplete="off"
          className="field h-11 py-0 uppercase tracking-wide placeholder:normal-case placeholder:tracking-normal"
        />
        <button
          type="button"
          onClick={apply}
          className="h-11 shrink-0 rounded-xl border border-ink/70 bg-white px-5 text-sm font-semibold transition hover:bg-ink hover:text-white"
        >
          Apply
        </button>
      </div>
      {message && (
        <p className={cn('mt-1.5 text-[13px]', message.ok ? 'text-success' : 'text-danger')} role="status">
          {message.text}
        </p>
      )}
    </div>
  );
}
