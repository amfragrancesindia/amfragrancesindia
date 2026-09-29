'use client';

import { Heart } from 'lucide-react';
import { useCart } from '@/components/providers/CartProvider';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ButtonLink } from '@/components/ui/Button';
import { findProduct, type Product } from '@/lib/catalog';
import { CatalogErrorNotice } from './CatalogErrorNotice';

export function WishlistView() {
  const { hydrated, catalogError, wishlist, products } = useCart();

  if (!hydrated) {
    return (
      <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4" aria-busy>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="skeleton aspect-[3/4]" />
        ))}
      </div>
    );
  }

  if (catalogError) return <CatalogErrorNotice className="mt-8" />;

  const items = wishlist.map((slug) => findProduct(products, slug)).filter((p): p is Product => !!p);

  if (items.length === 0) {
    return (
      <div className="mx-auto mt-10 max-w-md py-10 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-cream">
          <Heart className="h-7 w-7 text-brand" />
        </span>
        <h2 className="mt-5 text-xl font-semibold">Your wishlist is empty</h2>
        <p className="mt-2 text-muted">Tap the heart on any fragrance to save it here for later.</p>
        <ButtonLink href="/products" className="mt-6">
          Discover fragrances
        </ButtonLink>
      </div>
    );
  }

  return (
    <>
      <p className="mt-2 text-muted">
        {items.length} saved {items.length === 1 ? 'fragrance' : 'fragrances'} · saved on this device
      </p>
      <ProductGrid products={items} className="mt-8" />
    </>
  );
}
