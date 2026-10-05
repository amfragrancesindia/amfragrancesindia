// Cart pricing shared by the browser (to display totals) and the server (to
// charge them). The server always re-prices from the database, so a
// tampered cart in localStorage can never change what a customer pays.
import type { Product } from './catalog';
import { site } from './site';

/** Finds a product by slug (the catalogue in the browser, the database on the server). */
export type ProductLookup = (slug: string) => Product | undefined;

export const MAX_QTY_PER_LINE = 10;
export const GST_RATE = 0.18;

export interface CartLineInput {
  slug: string;
  variantId: string;
  quantity: number;
}

export interface PricedLine {
  key: string;
  slug: string;
  variantId: string;
  name: string;
  size: string;
  image: string;
  concentration: string;
  unitPrice: number;
  mrp: number;
  quantity: number;
  lineTotal: number;
}

export const lineKey = (slug: string, variantId: string) => `${slug}:${variantId}`;

export const clampQuantity = (n: number) =>
  Math.min(MAX_QTY_PER_LINE, Math.max(1, Math.floor(Number.isFinite(n) ? n : 1)));

export function priceCart(input: CartLineInput[], getProduct: ProductLookup): { lines: PricedLine[]; rejected: CartLineInput[] } {
  const merged = new Map<string, PricedLine>();
  const rejected: CartLineInput[] = [];
  for (const item of input) {
    const product = getProduct(item.slug);
    const variant = product?.variants.find((v) => v.id === item.variantId);
    if (!product || !variant || !variant.inStock) {
      rejected.push(item);
      continue;
    }
    const key = lineKey(product.slug, variant.id);
    const existing = merged.get(key);
    const quantity = clampQuantity((existing?.quantity ?? 0) + clampQuantity(item.quantity));
    merged.set(key, {
      key,
      slug: product.slug,
      variantId: variant.id,
      name: product.name,
      size: variant.size,
      image: product.images[0],
      concentration: product.concentration,
      unitPrice: variant.price,
      mrp: variant.mrp,
      quantity,
      lineTotal: variant.price * quantity,
    });
  }
  return { lines: [...merged.values()], rejected };
}

export interface Coupon {
  code: string;
  description: string;
  type: 'percent' | 'flat';
  value: number;
  minSubtotal: number;
  maxDiscount?: number;
}

export const COUPONS: Record<string, Coupon> = {
  WELCOME10: {
    code: 'WELCOME10',
    description: '10% off orders above ₹1,999 (up to ₹1,000)',
    type: 'percent',
    value: 10,
    minSubtotal: 1999,
    maxDiscount: 1000,
  },
};

export function evaluateCoupon(code: string | null | undefined, subtotal: number) {
  if (!code) return { discount: 0 as number };
  const coupon = COUPONS[code.trim().toUpperCase()];
  if (!coupon) return { discount: 0, error: 'This coupon code is not valid.' };
  if (subtotal < coupon.minSubtotal) {
    return {
      discount: 0,
      coupon,
      error: `Add items worth ₹${(coupon.minSubtotal - subtotal).toLocaleString('en-IN')} more to use ${coupon.code}.`,
    };
  }
  let discount = coupon.type === 'percent' ? Math.round((subtotal * coupon.value) / 100) : coupon.value;
  if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  return { discount: Math.min(discount, subtotal), coupon };
}

export interface Totals {
  itemCount: number;
  subtotal: number;
  mrpTotal: number;
  discount: number;
  shipping: number;
  total: number;
  /** GST already included in `total` (prices are MRP, inclusive of taxes). */
  gstIncluded: number;
  couponCode?: string;
  couponError?: string;
}

export function computeTotals(lines: PricedLine[], couponCode?: string | null): Totals {
  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const mrpTotal = lines.reduce((sum, l) => sum + l.mrp * l.quantity, 0);
  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);
  const { discount, coupon, error } = evaluateCoupon(couponCode, subtotal);
  const afterDiscount = subtotal - discount;
  const shipping = subtotal === 0 ? 0 : site.shipping.fee;
  const total = afterDiscount + shipping;
  return {
    itemCount,
    subtotal,
    mrpTotal,
    discount,
    shipping,
    total,
    gstIncluded: Math.round(total - total / (1 + GST_RATE)),
    couponCode: discount > 0 ? coupon?.code : undefined,
    couponError: error,
  };
}
