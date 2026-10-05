'use client';

import toast from 'react-hot-toast';
import { site } from '@/lib/site';
import { whatsappOrderLink } from '@/lib/whatsapp';

type WhatsAppOrderLinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'target' | 'rel'> & {
  /** The order as the customer would type it (orderMessage / cartOrderMessage in src/lib/whatsapp.ts). */
  message: string;
};

/**
 * Opens a WhatsApp chat with the store about an order. Without the store's number in site.ts the
 * chat can't be pre-filled, so the order is copied for the customer to paste.
 */
export function WhatsAppOrderLink({ message, onClick, children, ...props }: WhatsAppOrderLinkProps) {
  return (
    <a
      href={whatsappOrderLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => {
        if (!site.whatsappNumber) {
          navigator.clipboard
            ?.writeText(message)
            .then(() => toast.success('Order details copied — paste them in the WhatsApp chat.', { duration: 6000 }))
            .catch(() => undefined);
        }
        onClick?.(event);
      }}
      {...props}
    >
      {children}
    </a>
  );
}
