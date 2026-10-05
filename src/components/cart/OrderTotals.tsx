import type { Totals } from '@/lib/pricing';
import { formatPrice } from '@/lib/utils';

export function OrderTotals({ totals }: { totals: Totals }) {
  const savings = totals.mrpTotal - totals.subtotal;
  return (
    <dl className="space-y-2.5 text-[15px]">
      <div className="flex justify-between">
        <dt className="text-ink/70">Subtotal ({totals.itemCount} {totals.itemCount === 1 ? 'item' : 'items'})</dt>
        <dd className="font-medium">{formatPrice(totals.subtotal)}</dd>
      </div>
      {totals.discount > 0 && (
        <div className="flex justify-between text-success">
          <dt>Coupon {totals.couponCode}</dt>
          <dd className="font-medium">−{formatPrice(totals.discount)}</dd>
        </div>
      )}
      {totals.shipping > 0 && (
        <div className="flex justify-between">
          <dt className="text-ink/70">Delivery</dt>
          <dd className="font-medium">{formatPrice(totals.shipping)}</dd>
        </div>
      )}
      <div className="flex items-baseline justify-between border-t border-line pt-3.5">
        <dt className="text-base font-semibold">Total</dt>
        <dd className="text-2xl font-semibold">{formatPrice(totals.total)}</dd>
      </div>
      <p className="text-right text-[12.5px] text-muted">Inclusive of GST ({formatPrice(totals.gstIncluded)})</p>
      {savings + totals.discount > 0 && (
        <p className="rounded-xl bg-success/10 px-3 py-2 text-center text-[13px] font-medium text-success">
          You save {formatPrice(savings + totals.discount)} on this order
        </p>
      )}
    </dl>
  );
}
