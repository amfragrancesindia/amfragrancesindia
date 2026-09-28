'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getProduct, getVariant } from '@/lib/catalog';
import {
  clampQuantity,
  computeTotals,
  evaluateCoupon,
  lineKey,
  priceCart,
  type CartLineInput,
  type PricedLine,
  type Totals,
} from '@/lib/pricing';

const CART_KEY = 'amf_cart_v2';
const WISHLIST_KEY = 'amf_wishlist_v2';
const LEGACY_KEYS = ['amf_cart', 'amf_wishlist'];

interface StoredCart {
  items: CartLineInput[];
  coupon: string | null;
}

interface CartContextValue {
  hydrated: boolean;
  lines: PricedLine[];
  totals: Totals;
  coupon: string | null;
  itemCount: number;
  addItem: (slug: string, variantId?: string, quantity?: number, options?: { openDrawer?: boolean }) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { ok: boolean; message: string };
  removeCoupon: () => void;
  wishlist: string[];
  isWishlisted: (slug: string) => boolean;
  toggleWishlist: (slug: string) => boolean;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or blocked (private mode): the cart still works in memory.
  }
}

function sanitizeItems(value: unknown): CartLineInput[] {
  if (!Array.isArray(value)) return [];
  const valid = value.filter(
    (i): i is CartLineInput =>
      !!i && typeof i.slug === 'string' && typeof i.variantId === 'string' && typeof i.quantity === 'number',
  );
  // Drop anything no longer sold and merge duplicates.
  return priceCart(valid).lines.map((l) => ({ slug: l.slug, variantId: l.variantId, quantity: l.quantity }));
}

function loadCart(): StoredCart {
  const stored = readJson<Partial<StoredCart> | null>(CART_KEY, null);
  return {
    items: sanitizeItems(stored?.items),
    coupon: typeof stored?.coupon === 'string' ? stored.coupon : null,
  };
}

function loadWishlist(): string[] {
  const stored = readJson<unknown>(WISHLIST_KEY, []);
  return Array.isArray(stored) ? stored.filter((s): s is string => typeof s === 'string' && !!getProduct(s)) : [];
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLineInput[]>([]);
  const [coupon, setCoupon] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Load persisted state once on the client. Saving only starts after this
  // has run, so an empty initial render can never overwrite a saved cart.
  useEffect(() => {
    const cart = loadCart();
    setItems(cart.items);
    setCoupon(cart.coupon);
    setWishlist(loadWishlist());
    LEGACY_KEYS.forEach((k) => {
      try {
        window.localStorage.removeItem(k);
      } catch {
        /* ignore */
      }
    });
    setHydrated(true);

    // Keep several open tabs in sync.
    const onStorage = (e: StorageEvent) => {
      if (e.key === CART_KEY) {
        const next = loadCart();
        setItems(next.items);
        setCoupon(next.coupon);
      } else if (e.key === WISHLIST_KEY) {
        setWishlist(loadWishlist());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    if (hydrated) writeJson(CART_KEY, { items, coupon } satisfies StoredCart);
  }, [items, coupon, hydrated]);

  useEffect(() => {
    if (hydrated) writeJson(WISHLIST_KEY, wishlist);
  }, [wishlist, hydrated]);

  const lines = useMemo(() => priceCart(items).lines, [items]);
  const totals = useMemo(() => computeTotals(lines, coupon), [lines, coupon]);

  const addItem = useCallback<CartContextValue['addItem']>((slug, variantId, quantity = 1, options) => {
    const product = getProduct(slug);
    if (!product) return;
    const variant = getVariant(product, variantId);
    if (!variant.inStock) return;
    setItems((prev) => {
      const index = prev.findIndex((i) => i.slug === slug && i.variantId === variant.id);
      if (index === -1) return [...prev, { slug, variantId: variant.id, quantity: clampQuantity(quantity) }];
      return prev.map((item, i) =>
        i === index ? { ...item, quantity: clampQuantity(item.quantity + quantity) } : item,
      );
    });
    if (options?.openDrawer !== false) setDrawerOpen(true);
  }, []);

  const updateQuantity = useCallback((key: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => lineKey(i.slug, i.variantId) !== key)
        : prev.map((i) => (lineKey(i.slug, i.variantId) === key ? { ...i, quantity: clampQuantity(quantity) } : i)),
    );
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => lineKey(i.slug, i.variantId) !== key));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setCoupon(null);
  }, []);

  const applyCoupon = useCallback(
    (code: string) => {
      const normalized = code.trim().toUpperCase();
      if (!normalized) return { ok: false, message: 'Please enter a coupon code.' };
      const result = evaluateCoupon(normalized, totals.subtotal);
      if (!result.coupon) return { ok: false, message: result.error ?? 'This coupon code is not valid.' };
      setCoupon(normalized);
      if (result.error) return { ok: false, message: result.error };
      return { ok: true, message: `${result.coupon.code} applied — you save ₹${result.discount.toLocaleString('en-IN')}.` };
    },
    [totals.subtotal],
  );

  const removeCoupon = useCallback(() => setCoupon(null), []);

  const isWishlisted = useCallback((slug: string) => wishlist.includes(slug), [wishlist]);

  const toggleWishlist = useCallback(
    (slug: string) => {
      const next = !wishlist.includes(slug);
      setWishlist((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [slug, ...prev]));
      return next;
    },
    [wishlist],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      hydrated,
      lines,
      totals,
      coupon,
      itemCount: totals.itemCount,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      applyCoupon,
      removeCoupon,
      wishlist,
      isWishlisted,
      toggleWishlist,
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
    }),
    [hydrated, lines, totals, coupon, addItem, updateQuantity, removeItem, clearCart, applyCoupon, removeCoupon, wishlist, isWishlisted, toggleWishlist, drawerOpen],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside <CartProvider>');
  return context;
}
