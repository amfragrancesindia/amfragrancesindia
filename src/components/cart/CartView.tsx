'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Lock, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/components/providers/CartProvider';
import { ButtonLink } from '@/components/ui/Button';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { site } from '@/lib/site';
import { formatPrice } from '@/lib/utils';
import { CatalogErrorNotice } from './CatalogErrorNotice';
import { CouponForm } from './CouponForm';
import { FreeShippingMeter } from './FreeShippingMeter';
import { OrderTotals } from './OrderTotals';

export function CartView({ emptyState }: { emptyState: React.ReactNode }) {
  const { hydrated, catalogError, lines, totals, updateQuantity, removeItem } = useCart();

  if (!hydrated) {
    return (
      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_380px]" aria-busy>
        <div className="space-y-4">
          {[0, 1].map((i) => (
            <div key={i} className="skeleton h-32" />
          ))}
        </div>
        <div className="skeleton h-80" />
      </div>
    );
  }

  if (catalogError) return <CatalogErrorNotice className="mt-8" />;

  if (lines.length === 0) {
    return (
      <div className="mt-8">
        <div className="mx-auto max-w-md py-10 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-cream">
            <ShoppingBag className="h-7 w-7 text-brand" />
          </span>
          <h2 className="mt-5 text-xl font-semibold">Your cart is empty</h2>
          <p className="mt-2 text-muted">Explore our eau de parfums and attars to find your signature scent.</p>
          <ButtonLink href="/products" className="mt-6">
            Shop the collection
          </ButtonLink>
        </div>
        {emptyState}
      </div>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
      <section aria-label="Cart items">
        <div className="rounded-2xl border border-line p-4 sm:p-5">
          <FreeShippingMeter remaining={totals.amountToFreeShipping} />
        </div>
        <ul className="mt-4 divide-y divide-line rounded-2xl border border-line">
          {lines.map((line) => (
            <li key={line.key} className="flex gap-4 p-4 sm:gap-6 sm:p-5">
              <Link href={`/products/${line.slug}`} className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-cream sm:h-32 sm:w-28">
                <Image src={line.image} alt={line.name} fill sizes="112px" className="object-cover" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <Link href={`/products/${line.slug}`} className="text-[16px] font-medium hover:text-brand">
                      {line.name}
                    </Link>
                    <p className="text-[13.5px] text-muted">
                      {line.size} · {line.concentration}
                    </p>
                    <p className="mt-1 text-sm">
                      {formatPrice(line.unitPrice)}
                      {line.mrp > line.unitPrice && <span className="ml-2 text-muted line-through">{formatPrice(line.mrp)}</span>}
                    </p>
                  </div>
                  <p className="shrink-0 text-[16px] font-semibold">{formatPrice(line.lineTotal)}</p>
                </div>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <QuantityStepper size="sm" value={line.quantity} onChange={(q) => updateQuantity(line.key, q)} />
                  <button
                    type="button"
                    onClick={() => removeItem(line.key)}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] text-muted transition hover:bg-cream hover:text-danger"
                  >
                    <Trash2 className="h-4 w-4" /> Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <Link href="/products" className="mt-5 inline-block text-sm font-medium text-brand underline-offset-4 hover:underline">
          ← Continue shopping
        </Link>
      </section>

      <aside className="rounded-2xl bg-cream p-6 lg:sticky lg:top-[calc(var(--header-height)+24px)]" aria-label="Order summary">
        <h2 className="text-lg font-semibold">Order Summary</h2>
        <div className="mt-5">
          <CouponForm />
        </div>
        <div className="mt-6">
          <OrderTotals totals={totals} />
        </div>
        <ButtonLink href="/checkout" size="lg" className="mt-6 w-full">
          <Lock className="h-4 w-4" /> Proceed to Checkout
        </ButtonLink>
        <p className="mt-3 text-center text-[12.5px] text-muted">
          {site.onlinePayments ? 'UPI · Cards · Net Banking · Cash on Delivery' : 'Cash on Delivery · Pay in cash or by UPI on delivery'}
        </p>
      </aside>
    </div>
  );
}
