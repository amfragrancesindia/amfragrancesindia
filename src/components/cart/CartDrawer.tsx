'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/components/providers/CartProvider';
import { Drawer } from '@/components/layout/Drawer';
import { ButtonLink } from '@/components/ui/Button';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { formatPrice } from '@/lib/utils';
import { CatalogErrorNotice } from './CatalogErrorNotice';
import { FreeShippingMeter } from './FreeShippingMeter';

export function CartDrawer() {
  const { drawerOpen, closeDrawer, hydrated, catalogError, itemCount, lines, totals, updateQuantity, removeItem } = useCart();

  return (
    <Drawer open={drawerOpen} onClose={closeDrawer} side="right" title={`Your Cart (${hydrated ? totals.itemCount : itemCount})`}>
      {!hydrated ? (
        <div className="space-y-4 px-5 py-5" aria-busy>
          {[0, 1].map((i) => (
            <div key={i} className="skeleton h-24" />
          ))}
        </div>
      ) : catalogError ? (
        <CatalogErrorNotice className="px-6" />
      ) : lines.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-cream">
            <ShoppingBag className="h-7 w-7 text-brand" />
          </span>
          <p className="mt-5 text-lg font-semibold">Your cart is empty</p>
          <p className="mt-1 text-sm text-muted">Find a fragrance that feels like you.</p>
          <ButtonLink href="/products" onClick={closeDrawer} className="mt-6">
            Shop the collection
          </ButtonLink>
        </div>
      ) : (
        <>
          <div className="border-b border-line px-5 py-4">
            <FreeShippingMeter remaining={totals.amountToFreeShipping} />
          </div>
          <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
            {lines.map((line) => (
              <li key={line.key} className="flex gap-4 py-4">
                <Link
                  href={`/products/${line.slug}`}
                  onClick={closeDrawer}
                  className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-cream"
                >
                  <Image src={line.image} alt={line.name} fill sizes="80px" className="object-cover" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link href={`/products/${line.slug}`} onClick={closeDrawer} className="block truncate font-medium hover:text-brand">
                        {line.name}
                      </Link>
                      <p className="text-[13px] text-muted">
                        {line.size} · {line.concentration}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(line.key)}
                      className="-mr-1.5 grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted transition hover:bg-cream hover:text-danger"
                      aria-label={`Remove ${line.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <QuantityStepper size="sm" value={line.quantity} onChange={(q) => updateQuantity(line.key, q)} min={1} />
                    <span className="font-semibold">{formatPrice(line.lineTotal)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="space-y-3 border-t border-line bg-cream/60 px-5 pb-6 pt-4">
            <div className="flex items-center justify-between text-[15px]">
              <span className="text-ink/75">Subtotal</span>
              <span className="text-lg font-semibold">{formatPrice(totals.subtotal)}</span>
            </div>
            <p className="text-xs text-muted">Inclusive of all taxes. Shipping and coupons are applied at checkout.</p>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <ButtonLink href="/cart" variant="outline" onClick={closeDrawer}>
                View cart
              </ButtonLink>
              <ButtonLink href="/checkout" onClick={closeDrawer}>
                Checkout
              </ButtonLink>
            </div>
          </div>
        </>
      )}
    </Drawer>
  );
}
