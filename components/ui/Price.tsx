import { discountPercent } from '@/lib/catalog';
import { cn, formatPrice } from '@/lib/utils';

interface PriceProps {
  price: number;
  mrp?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: { price: 'text-[15px] font-semibold', mrp: 'text-[13px]', off: 'text-[13px]' },
  md: { price: 'text-xl font-semibold', mrp: 'text-sm', off: 'text-sm' },
  lg: { price: 'text-[28px] font-semibold', mrp: 'text-base', off: 'text-[15px]' },
};

/** Price with MRP strike-through and saving, as on Balario's cards. */
export function Price({ price, mrp, size = 'md', className }: PriceProps) {
  const off = mrp ? discountPercent({ price, mrp }) : 0;
  const s = sizes[size];
  return (
    <p className={cn('flex flex-wrap items-baseline gap-x-2 gap-y-0.5', className)}>
      {off > 0 && (
        <span className={cn('text-muted line-through decoration-muted/60', s.mrp)}>
          <span className="sr-only">MRP </span>
          {formatPrice(mrp!)}
        </span>
      )}
      <span className={cn('text-ink', s.price)}>
        <span className="sr-only">Price </span>
        {formatPrice(price)}
      </span>
      {off > 0 && <span className={cn('font-medium text-success', s.off)}>{off}% off</span>}
    </p>
  );
}
