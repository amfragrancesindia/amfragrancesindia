import Link from 'next/link';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { ButtonLink } from '@/components/ui/Button';
import { SHOP_FILTERS } from '@/lib/catalog';

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="container-x pb-20 pt-12 sm:pt-16">
        <div className="mx-auto max-w-xl text-center">
          <p className="font-display text-[96px] leading-none text-gold sm:text-[128px]">404</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">This page has drifted away</h1>
          <p className="mt-3 text-[16px] text-muted">The page you’re looking for doesn’t exist or has moved. Let’s get you back to something beautiful.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/" size="lg">
              Back to Home
            </ButtonLink>
            <ButtonLink href="/products" variant="outline" size="lg">
              Shop All Products
            </ButtonLink>
          </div>
        </div>
        <nav aria-label="Shop by collection" className="mx-auto mt-14 flex max-w-2xl flex-wrap justify-center gap-2">
          {SHOP_FILTERS.filter((f) => f.key !== 'all').map((f) => (
            <Link
              key={f.key}
              href={`/products?${new URLSearchParams(f.params as Record<string, string>)}`}
              className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink/80 transition hover:border-brand hover:text-brand"
            >
              {f.label}
            </Link>
          ))}
        </nav>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
