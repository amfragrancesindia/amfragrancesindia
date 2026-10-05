'use client';

import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/components/providers/CartProvider';
import { buttonVariants } from '@/components/ui/Button';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { WhatsAppLink } from '@/components/ui/WhatsAppLink';
import { cn } from '@/lib/utils';

interface ProductCardActionsProps {
  slug: string;
  variantId: string;
  name: string;
  /** The WhatsApp order for one bottle (orderMessage in src/lib/whatsapp.ts). */
  message: string;
  className?: string;
}

/**
 * Add to Cart and Buy Now (on WhatsApp) for a product card, like the Featured Perfume panel.
 * Side by side when the card is wide enough for both labels, stacked in narrow cards (phones).
 */
export function ProductCardActions({ slug, variantId, name, message, className }: ProductCardActionsProps) {
  const { addItem } = useCart();
  const button = cn(buttonVariants({ size: 'sm' }), 'h-10 w-full gap-1.5 px-3 text-[13px]');
  return (
    <div className={cn('[container-type:inline-size]', className)}>
      <div className="grid gap-2 [@container(min-width:14rem)]:grid-cols-2">
        <button type="button" onClick={() => addItem(slug, variantId, 1)} className={cn(button, 'bg-ink text-white hover:bg-brand')}>
          <ShoppingCart className="h-4 w-4 shrink-0" />
          Add to Cart<span className="sr-only">: {name}</span>
        </button>
        <WhatsAppLink message={message} title="Order on WhatsApp" className={cn(button, 'bg-[#25D366] text-white hover:bg-[#1DA851]')}>
          <WhatsAppIcon className="h-4 w-4 shrink-0" />
          Buy Now<span className="sr-only">: {name} on WhatsApp</span>
        </WhatsAppLink>
      </div>
    </div>
  );
}
