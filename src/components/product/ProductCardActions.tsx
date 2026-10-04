'use client';

import toast from 'react-hot-toast';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/components/providers/CartProvider';
import { buttonVariants } from '@/components/ui/Button';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { site } from '@/lib/site';
import { cn } from '@/lib/utils';
import { whatsappOrderLink } from '@/lib/whatsapp';

/**
 * Without the store's number in site.ts the WhatsApp chat can't be pre-filled, so the order
 * details are copied for the customer to paste. Call it from the click that opens the chat.
 */
export function copyOrderForChat(message: string) {
  if (site.whatsappNumber) return;
  navigator.clipboard
    ?.writeText(message)
    .then(() => toast.success('Order details copied — paste them in the WhatsApp chat.', { duration: 6000 }))
    .catch(() => undefined);
}

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
        <a
          href={whatsappOrderLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => copyOrderForChat(message)}
          title="Order on WhatsApp"
          className={cn(button, 'bg-[#25D366] text-white hover:bg-[#1DA851]')}
        >
          <WhatsAppIcon className="h-4 w-4 shrink-0" />
          Buy Now<span className="sr-only">: {name} on WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
