'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { findProduct, type Product } from '@/lib/catalog';
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
/** The published catalogue, with current prices and stock. */
const CATALOG_URL = '/api/products';
/** Prices are re-checked when the shopper returns to a tab left open this long. */
const REFRESH_AFTER_MS = 2 * 60 * 1000;

interface StoredCart {
  items: CartLineInput[];
  coupon: string | null;
}

interface CartContextValue {
  /** Saved cart and current catalogue are both loaded (or the catalogue failed to load). */
  hydrated: boolean;
  /** The catalogue couldn't be loaded, so the cart can't be priced right now. */
  catalogError: boolean;
  reloadCatalog: () => void;
  /** Published products (empty until loaded). */
  products: Product[];
  lines: PricedLine[];
  totals: Totals;
  coupon: string | null;
  itemCount: number;
  addItem: (slug: string, variantId: string, quantity?: number, options?: { openDrawer?: boolean }) => void;
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

/** Keeps well-formed lines, clamps quantities and merges duplicates. */
function sanitizeItems(value: unknown): CartLineInput[] {
  if (!Array.isArray(value)) return [];
  const merged = new Map<string, CartLineInput>();
  for (const i of value) {
    if (!i || typeof i.slug !== 'string' || typeof i.variantId !== 'string' || typeof i.quantity !== 'number') continue;
    const key = lineKey(i.slug, i.variantId);
    const quantity = clampQuantity((merged.get(key)?.quantity ?? 0) + clampQuantity(i.quantity));
    merged.set(key, { slug: i.slug, variantId: i.variantId, quantity });
  }
  return [...merged.values()];
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
  return Array.isArray(stored) ? stored.filter((s): s is string => typeof s === 'string') : [];
}

const sameItems = (a: CartLineInput[], b: CartLineInput[]) =>
  a.length === b.length && a.every((x, i) => x.slug === b[i].slug && x.variantId === b[i].variantId && x.quantity === b[i].quantity);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLineInput[]>([]);
  const [coupon, setCoupon] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [storageReady, setStorageReady] = useState(false);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [catalogError, setCatalogError] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const loadCatalog = useCallback(async () => {
    try {
      const res = await fetch(CATALOG_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { products?: Product[] };
      setProducts(Array.isArray(data.products) ? data.products : []);
      setCatalogError(false);
    } catch {
      setCatalogError(true);
    }
  }, []);

  // Load persisted state and the catalogue once on the client. Saving only
  // starts after this has run, so an empty initial render can never overwrite
  // a saved cart.
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
    setStorageReady(true);
    void loadCatalog();

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
    // Prices and stock can change in the admin panel while a tab stays open.
    let loadedAt = Date.now();
    const onVisible = () => {
      if (document.visibilityState === 'visible' && Date.now() - loadedAt > REFRESH_AFTER_MS) {
        loadedAt = Date.now();
        void loadCatalog();
      }
    };
    window.addEventListener('storage', onStorage);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.removeEventListener('storage', onStorage);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [loadCatalog]);

  const lookup = useCallback((slug: string) => (products ? findProduct(products, slug) : undefined), [products]);

  // Once the catalogue is known, drop lines that are no longer sold, so the
  // cart never shows something checkout would refuse.
  useEffect(() => {
    if (!storageReady || !products) return;
    setItems((prev) => {
      const kept = priceCart(prev, lookup).lines.map((l) => ({ slug: l.slug, variantId: l.variantId, quantity: l.quantity }));
      return sameItems(prev, kept) ? prev : kept;
    });
  }, [storageReady, products, lookup]);

  useEffect(() => {
    if (storageReady) writeJson(CART_KEY, { items, coupon } satisfies StoredCart);
  }, [items, coupon, storageReady]);

  useEffect(() => {
    if (storageReady) writeJson(WISHLIST_KEY, wishlist);
  }, [wishlist, storageReady]);

  const lines = useMemo(() => (products ? priceCart(items, lookup).lines : []), [items, lookup, products]);
  const totals = useMemo(() => computeTotals(lines, coupon), [lines, coupon]);
  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  const addItem = useCallback<CartContextValue['addItem']>(
    (slug, variantId, quantity = 1, options) => {
      const product = lookup(slug);
      // Refuse a size the current catalogue shows as sold out.
      if (product && !product.variants.find((v) => v.id === variantId)?.inStock) return;
      setItems((prev) => {
        const index = prev.findIndex((i) => i.slug === slug && i.variantId === variantId);
        if (index === -1) return [...prev, { slug, variantId, quantity: clampQuantity(quantity) }];
        return prev.map((item, i) => (i === index ? { ...item, quantity: clampQuantity(item.quantity + quantity) } : item));
      });
      // A product added after the catalogue was loaded (e.g. just published).
      if (products && !product) void loadCatalog();
      if (options?.openDrawer !== false) setDrawerOpen(true);
    },
    [lookup, products, loadCatalog],
  );

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

  // Saved products that are currently on sale (hidden or deleted ones stay
  // saved, so they reappear if the product comes back).
  const visibleWishlist = useMemo(
    () => (products ? wishlist.filter((slug) => !!findProduct(products, slug)) : wishlist),
    [products, wishlist],
  );

  const hydrated = storageReady && (products !== null || catalogError);

  const value = useMemo<CartContextValue>(
    () => ({
      hydrated,
      catalogError: catalogError && !products,
      reloadCatalog: () => void loadCatalog(),
      products: products ?? [],
      lines,
      totals,
      coupon,
      itemCount,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      applyCoupon,
      removeCoupon,
      wishlist: visibleWishlist,
      isWishlisted,
      toggleWishlist,
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
    }),
    [hydrated, catalogError, products, loadCatalog, lines, totals, coupon, itemCount, addItem, updateQuantity, removeItem, clearCart, applyCoupon, removeCoupon, visibleWishlist, isWishlisted, toggleWishlist, drawerOpen],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside <CartProvider>');
  return context;
}
