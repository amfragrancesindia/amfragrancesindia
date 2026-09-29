'use client';

import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface VariantDraft {
  /** React key; stays the same while the row is edited. */
  key: string;
  /** Stable id stored in carts and orders ('' for a size that hasn't been saved yet). */
  id: string;
  size: string;
  price: string;
  mrp: string;
  inStock: boolean;
}

export const newVariantDraft = (size = ''): VariantDraft => ({
  key: crypto.randomUUID(),
  id: '',
  size,
  price: '',
  mrp: '',
  inStock: true,
});

/** "4,999" / "₹4999" → 4999; empty → NaN */
export const parseRupees = (value: string) => {
  const cleaned = value.replace(/[₹,\s]/g, '');
  return cleaned === '' ? Number.NaN : Number(cleaned);
};

interface VariantsEditorProps {
  variants: VariantDraft[];
  onChange: (next: VariantDraft[]) => void;
  errors: Record<string, string>;
}

function RupeeInput({
  value,
  onChange,
  label,
  placeholder,
  invalid,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  placeholder?: string;
  invalid?: boolean;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[15px] text-muted">₹</span>
      <input
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^\d,]/g, ''))}
        aria-label={label}
        placeholder={placeholder}
        aria-invalid={invalid || undefined}
        className={cn('field pl-8', invalid && 'field-error')}
      />
    </div>
  );
}

/** Sizes with their price, MRP and stock. */
export function VariantsEditor({ variants, onChange, errors }: VariantsEditorProps) {
  const update = (index: number, patch: Partial<VariantDraft>) =>
    onChange(variants.map((v, i) => (i === index ? { ...v, ...patch } : v)));
  const move = (from: number, to: number) => {
    if (to < 0 || to >= variants.length) return;
    const next = [...variants];
    const [row] = next.splice(from, 1);
    next.splice(to, 0, row);
    onChange(next);
  };

  return (
    <div>
      {variants.length > 0 && (
        <div className="hidden grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)_88px_104px] gap-3 px-1 pb-2 text-[13px] font-medium text-muted md:grid">
          <span>Size</span>
          <span>Price</span>
          <span>MRP (optional)</span>
          <span>In stock</span>
          <span className="sr-only">Actions</span>
        </div>
      )}
      <ul className="space-y-3">
        {variants.map((v, i) => {
          const price = parseRupees(v.price);
          const mrp = parseRupees(v.mrp);
          const off = price > 0 && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
          const err = (field: string) => errors[`variants.${i}.${field}`];
          return (
            <li
              key={v.key}
              className="grid grid-cols-2 gap-3 rounded-xl border border-line p-3 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)_88px_104px] md:items-start md:border-0 md:p-0"
            >
              <div className="col-span-2 md:col-span-1">
                <span className="mb-1 block text-[12.5px] font-medium text-muted md:hidden">Size</span>
                <input
                  value={v.size}
                  onChange={(e) => update(i, { size: e.target.value })}
                  aria-label={`Size ${i + 1}`}
                  placeholder="e.g. 50 ml"
                  aria-invalid={!!err('size') || undefined}
                  className={cn('field', err('size') && 'field-error')}
                />
                {err('size') && <p className="mt-1 text-[12.5px] text-danger">{err('size')}</p>}
              </div>
              <div>
                <span className="mb-1 block text-[12.5px] font-medium text-muted md:hidden">Price</span>
                <RupeeInput value={v.price} onChange={(val) => update(i, { price: val })} label={`Price for size ${i + 1}`} invalid={!!err('price')} />
                {err('price') ? (
                  <p className="mt-1 text-[12.5px] text-danger">{err('price')}</p>
                ) : (
                  off > 0 && <p className="mt-1 text-[12.5px] font-medium text-success">{off}% off</p>
                )}
              </div>
              <div>
                <span className="mb-1 block text-[12.5px] font-medium text-muted md:hidden">MRP (optional)</span>
                <RupeeInput
                  value={v.mrp}
                  onChange={(val) => update(i, { mrp: val })}
                  label={`MRP for size ${i + 1}`}
                  placeholder="Same as price"
                  invalid={!!err('mrp')}
                />
                {err('mrp') && <p className="mt-1 text-[12.5px] text-danger">{err('mrp')}</p>}
              </div>
              <label className="flex h-[50px] cursor-pointer items-center gap-2.5 md:justify-center">
                <input
                  type="checkbox"
                  checked={v.inStock}
                  onChange={(e) => update(i, { inStock: e.target.checked })}
                  className="h-5 w-5 cursor-pointer accent-[#5A4A3A]"
                />
                <span className={cn('text-sm md:sr-only', v.inStock ? 'text-success' : 'text-danger')}>{v.inStock ? 'In stock' : 'Sold out'}</span>
              </label>
              <div className="flex h-[50px] items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() => move(i, i - 1)}
                  disabled={i === 0}
                  aria-label="Move size up"
                  className="grid h-9 w-9 place-items-center rounded-lg text-muted transition hover:bg-cream hover:text-ink disabled:opacity-30"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, i + 1)}
                  disabled={i === variants.length - 1}
                  aria-label="Move size down"
                  className="grid h-9 w-9 place-items-center rounded-lg text-muted transition hover:bg-cream hover:text-ink disabled:opacity-30"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onChange(variants.filter((_, j) => j !== i))}
                  aria-label={`Remove size ${v.size || i + 1}`}
                  className="grid h-9 w-9 place-items-center rounded-lg text-muted transition hover:bg-danger/10 hover:text-danger"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      {errors.variants && (
        <p className="mt-2 text-[13px] text-danger" role="alert">
          {errors.variants}
        </p>
      )}
      <button
        type="button"
        onClick={() => onChange([...variants, newVariantDraft()])}
        disabled={variants.length >= 10}
        className="mt-4 inline-flex items-center gap-2 rounded-lg border border-dashed border-line px-4 py-2.5 text-sm font-medium text-brand transition hover:border-brand-light hover:bg-cream disabled:opacity-40"
      >
        <Plus className="h-4 w-4" /> Add a size
      </button>
      <p className="mt-2 text-[13px] text-muted">
        Prices include GST. Leave MRP empty if there’s no discount; when MRP is higher than the price, the shop shows the saving.
      </p>
    </div>
  );
}
