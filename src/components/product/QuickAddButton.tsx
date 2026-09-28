'use client';

import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/components/providers/CartProvider';
import { cn } from '@/lib/utils';

export function QuickAddButton({ slug, variantId, name, className }: { slug: string; variantId: string; name: string; className?: string }) {
  const { addItem } = useCart();
  return (
    <button
      type="button"
      onClick={() => addItem(slug, variantId, 1)}
      aria-label={`Add ${name} to cart`}
      className={cn(
        'grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-white transition hover:bg-brand active:scale-95',
        className,
      )}
    >
      <ShoppingCart className="h-4 w-4" />
    </button>
  );
}
