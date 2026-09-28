import { Truck } from 'lucide-react';
import { site } from '@/lib/site';
import { formatPrice } from '@/lib/utils';

export function FreeShippingMeter({ remaining }: { remaining: number }) {
  const threshold = site.shipping.freeThreshold;
  const progress = Math.min(100, Math.round(((threshold - remaining) / threshold) * 100));
  return (
    <div>
      <p className="flex items-center gap-2 text-[13.5px] text-ink/80">
        <Truck className="h-4 w-4 text-brand" aria-hidden />
        {remaining > 0 ? (
          <span>
            Add <strong className="font-semibold text-ink">{formatPrice(remaining)}</strong> more for free shipping
          </span>
        ) : (
          <span className="font-medium text-success">You’ve unlocked free shipping</span>
        )}
      </p>
      <div
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-line"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        aria-label="Progress towards free shipping"
      >
        <div className="h-full rounded-full bg-brand-light transition-[width] duration-500" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
