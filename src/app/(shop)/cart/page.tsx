import type { Metadata } from 'next';
import { CartView } from '@/components/cart/CartView';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getBestsellers } from '@/lib/catalog';

export const metadata: Metadata = {
  title: 'Your Cart',
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <div className="container-x pb-20 pt-6 sm:pt-8">
      <Breadcrumbs items={[{ name: 'Cart' }]} />
      <h1 className="mt-6 text-[32px] font-semibold tracking-tight sm:text-4xl">Your Cart</h1>
      <CartView
        emptyState={
          <section className="mt-6">
            <SectionHeading title="Bestsellers" />
            <ProductGrid products={getBestsellers(4)} className="mt-8" />
          </section>
        }
      />
    </div>
  );
}
