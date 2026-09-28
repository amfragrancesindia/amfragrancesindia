'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { CheckCircle2, Mail, Package, Truck } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { site } from '@/lib/site';
import { formatPrice } from '@/lib/utils';
import { RECEIPT_STORAGE_KEY, type OrderReceipt } from '@/types/order';

export function OrderReceiptView({ orderNumber }: { orderNumber: string }) {
  const [receipt, setReceipt] = useState<OrderReceipt | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(RECEIPT_STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as OrderReceipt) : null;
      if (parsed && parsed.orderNumber === orderNumber) setReceipt(parsed);
    } catch {
      /* show the generic confirmation */
    }
  }, [orderNumber]);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-success" strokeWidth={1.5} />
        <h1 className="mt-5 text-[32px] font-semibold tracking-tight sm:text-4xl">
          Thank you{receipt?.name ? `, ${receipt.name.split(' ')[0]}` : ''}!
        </h1>
        <p className="mt-3 text-[16px] text-muted">
          Your order{' '}
          <strong className="font-semibold text-ink" translate="no">
            #{orderNumber}
          </strong>{' '}
          has been placed{receipt?.paymentMethod === 'ONLINE' ? ' and paid' : ''}.
        </p>
      </div>

      <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <li className="rounded-2xl bg-cream p-5 text-center">
          <Mail className="mx-auto h-6 w-6 text-brand" />
          <p className="mt-2 text-sm text-ink/80">
            {receipt?.emailSent ? 'Confirmation sent to ' : 'Order updates will go to '}
            <span className="break-all font-medium">{receipt?.email ?? 'your email'}</span>
          </p>
        </li>
        <li className="rounded-2xl bg-cream p-5 text-center">
          <Package className="mx-auto h-6 w-6 text-brand" />
          <p className="mt-2 text-sm text-ink/80">Dispatched within {site.shipping.dispatch}</p>
        </li>
        <li className="rounded-2xl bg-cream p-5 text-center">
          <Truck className="mx-auto h-6 w-6 text-brand" />
          <p className="mt-2 text-sm text-ink/80">Delivered in {site.shipping.delivery}</p>
        </li>
      </ul>

      {receipt && (
        <section className="mt-8 rounded-2xl border border-line p-6" aria-label="Order details">
          <h2 className="text-lg font-semibold">Order details</h2>
          <ul className="mt-4 divide-y divide-line">
            {receipt.items.map((item) => (
              <li key={`${item.name}-${item.size}`} className="flex items-center gap-4 py-3">
                <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-cream">
                  <Image src={item.image} alt="" fill sizes="56px" className="object-cover" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{item.name}</span>
                  <span className="block text-sm text-muted">
                    {item.size} × {item.quantity}
                  </span>
                </span>
                <span className="font-medium">{formatPrice(item.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-line pt-4 text-[15px]">
            <div className="flex justify-between">
              <dt className="text-ink/70">Subtotal</dt>
              <dd>{formatPrice(receipt.subtotal)}</dd>
            </div>
            {receipt.discount > 0 && (
              <div className="flex justify-between text-success">
                <dt>Discount</dt>
                <dd>−{formatPrice(receipt.discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-ink/70">Shipping</dt>
              <dd>{receipt.shipping ? formatPrice(receipt.shipping) : 'Free'}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-lg font-semibold">
              <dt>Total</dt>
              <dd>{formatPrice(receipt.total)}</dd>
            </div>
            <p className="text-sm text-muted">
              {receipt.paymentMethod === 'COD' ? 'Payment: Cash on Delivery' : 'Payment: Paid online'}
            </p>
          </dl>
        </section>
      )}

      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <ButtonLink href="/products" size="lg">
          Continue Shopping
        </ButtonLink>
        <ButtonLink href="/contact" variant="outline" size="lg">
          Questions? Contact us
        </ButtonLink>
      </div>
    </div>
  );
}
