'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { site } from '@/lib/site';
import { whatsappAndroidLink, whatsappOrderLink } from '@/lib/whatsapp';

type WhatsAppLinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'target' | 'rel'> & {
  /** An order to type into the chat (orderMessage / cartOrderMessage in src/lib/whatsapp.ts). */
  message?: string;
};

// In-app browsers (Instagram, Facebook, Android web views) open WhatsApp links themselves.
const IN_APP = /; wv\)|Instagram|FBAN|FBAV/i;

/**
 * A link to the store's WhatsApp, optionally with an order typed in. On phones it opens the WhatsApp
 * app straight away instead of a WhatsApp page in the browser: Android through the app's own address
 * (or the wa.me page when WhatsApp isn't installed), iPhone by following wa.me in the same tab, which
 * iOS hands to the app. Computers open wa.me in a new tab. Without the store's number the chat can't
 * be pre-filled, so an order is copied for the customer to paste.
 */
export function WhatsAppLink({ message, onClick, children, ...props }: WhatsAppLinkProps) {
  const href = message ? whatsappOrderLink(message) : site.whatsapp;
  // Decided after hydration, so the server and the first client render agree.
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    setPhone(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
  }, []);
  const direct = phone && Boolean(site.whatsappNumber);

  return (
    <a
      href={href}
      target={direct ? undefined : '_blank'}
      rel="noopener noreferrer"
      onClick={(event) => {
        onClick?.(event);
        if (!site.whatsappNumber) {
          if (message) {
            navigator.clipboard
              ?.writeText(message)
              .then(() => toast.success('Order details copied — paste them in the WhatsApp chat.', { duration: 6000 }))
              .catch(() => undefined);
          }
          return;
        }
        const ua = navigator.userAgent;
        if (/Android/i.test(ua) && !IN_APP.test(ua)) {
          event.preventDefault();
          window.location.href = whatsappAndroidLink(message, href);
        }
      }}
      {...props}
    >
      {children}
    </a>
  );
}
