import type { Metadata } from 'next';
import { WishlistView } from '@/components/cart/WishlistView';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Wishlist',
  robots: { index: false, follow: true },
};

export default function WishlistPage() {
  return (
    <div className="container-x pb-20 pt-6 sm:pt-8">
      <Breadcrumbs items={[{ name: 'Wishlist' }]} />
      <h1 className="mt-6 text-[32px] font-semibold tracking-tight sm:text-4xl">Wishlist</h1>
      <WishlistView />
    </div>
  );
}
