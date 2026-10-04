import type { Metadata } from 'next';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { getBestsellers, queryProducts } from '@/lib/catalog';
import { getStoreProducts } from '@/lib/products';

export const metadata: Metadata = {
  title: 'Search',
  robots: { index: false, follow: true },
};

const SUGGESTIONS = ['Oud', 'Saffron', 'Vanilla', 'Citrus', 'Lavender', 'Rose', 'Musk', 'Sea Salt'];

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const raw = (await searchParams).q;
  const q = (typeof raw === 'string' ? raw : '').trim().slice(0, 80);
  const products = await getStoreProducts();
  const results = q ? queryProducts(products, { q }) : [];
  const popular = getBestsellers(products, 4);

  return (
    <div className="container-x pb-20 pt-6 sm:pt-8">
      <Breadcrumbs items={[{ name: 'Search' }]} />
      <h1 className="mt-6 text-[32px] font-semibold tracking-tight sm:text-4xl">Search</h1>

      <form action="/search" role="search" className="mt-6 flex max-w-2xl items-center gap-3 rounded-full border border-line bg-white py-1.5 pl-5 pr-1.5 focus-within:border-brand-light focus-within:ring-4 focus-within:ring-brand/10">
        <Search className="h-5 w-5 shrink-0 text-muted" aria-hidden />
        <label htmlFor="search-q" className="sr-only">
          Search products
        </label>
        <input
          id="search-q"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Search perfumes or notes"
          className="min-w-0 flex-1 bg-transparent text-[16px] outline-none placeholder:text-muted/70"
        />
        <button type="submit" className="h-10 rounded-full bg-ink px-5 text-sm font-semibold text-white transition hover:bg-brand">
          Search
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <Link
            key={s}
            href={`/search?q=${encodeURIComponent(s)}`}
            className="rounded-full border border-line px-3.5 py-1.5 text-sm text-ink/80 transition hover:border-brand hover:text-brand"
          >
            {s}
          </Link>
        ))}
      </div>

      {q ? (
        <>
          <p className="mt-10 text-[15px] text-ink/80" aria-live="polite">
            {results.length} {results.length === 1 ? 'result' : 'results'} for <strong>“{q}”</strong>
          </p>
          {results.length > 0 ? (
            <ProductGrid products={results} className="mt-6" />
          ) : (
            <>
              <p className="mt-2 text-muted">Nothing matched. You might like these bestsellers:</p>
              <ProductGrid products={popular} className="mt-6" />
            </>
          )}
        </>
      ) : (
        <>
          <h2 className="mt-12 text-xl font-semibold">Popular right now</h2>
          <ProductGrid products={popular} className="mt-6" />
        </>
      )}
    </div>
  );
}
