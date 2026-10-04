'use client';

import toast from 'react-hot-toast';
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

/** The round "Buy now" button on product cards: orders one bottle on WhatsApp. */
export function WhatsAppBuyButton({ message, name, className }: { message: string; name: string; className?: string }) {
  return (
    <a
      href={whatsappOrderLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => copyOrderForChat(message)}
      aria-label={`Buy ${name} on WhatsApp`}
      title="Buy now on WhatsApp"
      className={cn(
        'grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#25D366] text-white transition hover:bg-[#1DA851] active:scale-95 sm:h-9 sm:w-9',
        className,
      )}
    >
      <WhatsAppIcon className="h-[18px] w-[18px]" />
    </a>
  );
}
