// Ordering on WhatsApp: "Buy Now" and the cart open a chat with the store.
import type { Product, Variant } from './catalog';
import type { PricedLine, Totals } from './pricing';
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

/** The order message for everything in the cart, with the coupon and total the cart shows. */
export function cartOrderMessage(
  lines: Array<Pick<PricedLine, 'name' | 'size' | 'concentration' | 'quantity' | 'lineTotal'>>,
  totals: Pick<Totals, 'subtotal' | 'discount' | 'couponCode' | 'shipping' | 'total'>,
): string {
  return [
    `Hello ${site.name}, I would like to order:`,
    ...lines.map((l, i) => `${i + 1}. ${l.name} — ${[l.size, l.concentration].filter(Boolean).join(' ')} × ${l.quantity}: ${formatPrice(l.lineTotal)}`),
    ...(totals.discount > 0 ? [`Subtotal: ${formatPrice(totals.subtotal)}`, `Coupon ${totals.couponCode}: −${formatPrice(totals.discount)}`] : []),
    ...(totals.shipping > 0 ? [`Delivery: ${formatPrice(totals.shipping)}`] : []),
    `Total: ${formatPrice(totals.total)}`,
  ].join('\n');
}

/**
 * Where "Buy Now" goes. With the store's number set, WhatsApp opens with the message already
 * typed; otherwise it opens the store's chat link and the customer pastes the copied message.
 */
export function whatsappOrderLink(message: string): string {
  return site.whatsappNumber ? `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}` : site.whatsapp;
}

/**
 * Android link that opens the WhatsApp app itself (whatsapp://send) with the message typed in, rather
 * than a wa.me page in the browser first. The browser goes to `fallback` when WhatsApp isn't installed.
 * Needs the store's number.
 */
export function whatsappAndroidLink(message: string | undefined, fallback: string): string {
  const text = message ? `&text=${encodeURIComponent(message)}` : '';
  return `intent://send?phone=${site.whatsappNumber}${text}#Intent;scheme=whatsapp;S.browser_fallback_url=${encodeURIComponent(fallback)};end`;
}
