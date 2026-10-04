// Ordering on WhatsApp: the "Buy Now" button opens a chat with the store.
import type { Product, Variant } from './catalog';
import { site } from './site';
import { absoluteUrl, formatPrice } from './utils';

/** The order message for one product, as the customer would type it. */
export function orderMessage(product: Product, variant: Variant, quantity: number): string {
  return [
    `Hello ${site.name}, I would like to order:`,
    `${product.name} — ${[variant.size, product.concentration].filter(Boolean).join(' ')} × ${quantity}`,
    `Price: ${formatPrice(variant.price * quantity)}`,
    absoluteUrl(`/products/${product.slug}`),
  ].join('\n');
}

/**
 * Where "Buy Now" goes. With the store's number set, WhatsApp opens with the message already
 * typed; otherwise it opens the store's chat link and the customer pastes the copied message.
 */
export function whatsappOrderLink(message: string): string {
  return site.whatsappNumber ? `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}` : site.whatsapp;
}
