import type { Metadata } from 'next';
import { CartView } from '@/components/cart/CartView';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getBestsellers } from '@/lib/catalog';
import { getStoreProducts } from '@/lib/products';

export const metadata: Metadata = {
  title: 'Your Cart',
  robots: { index: false, follow: true },
};

export const dynamic = 'force-dynamic';

export default async function CartPage() {
  const bestsellers = getBestsellers(await getStoreProducts(), 4);
  return (
    <div className="container-x pb-20 pt-6 sm:pt-8">
      <Breadcrumbs items={[{ name: 'Cart' }]} />
      <h1 className="mt-6 text-[32px] font-semibold tracking-tight sm:text-4xl">Your Cart</h1>
      <CartView
        emptyState={
          bestsellers.length > 0 && (
            <section className="mt-6">
              <SectionHeading title="Bestsellers" />
              <ProductGrid products={bestsellers} className="mt-8" />
            </section>
          )
        }
      />
    </div>
  );
}
