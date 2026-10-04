import type { Metadata } from 'next';
import Link from 'next/link';
import { SearchX } from 'lucide-react';
import { ProductGrid } from '@/components/product/ProductGrid';
import { SortSelect } from '@/components/product/SortSelect';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ButtonLink } from '@/components/ui/Button';
import { SHOP_FILTERS, SORT_OPTIONS, queryProducts } from '@/lib/catalog';
import { getStoreProducts } from '@/lib/products';
import { cn } from '@/lib/utils';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const COPY: Record<string, { title: string; intro: string }> = {
  all: { title: 'All Products', intro: 'Long-lasting eaux de parfum crafted in India, each in a 100 ml flacon with its own gift box.' },
  men: { title: 'Perfumes for Men', intro: 'Bold, fresh and confident — fragrances with presence.' },
  women: { title: 'Perfumes for Women', intro: 'Soft florals and warm musks for every occasion.' },
  unisex: { title: 'Unisex Perfumes', intro: 'Signatures made to be shared — from smoky oud to sparkling citrus.' },
  'attars-oils': { title: 'Attars & Perfume Oils', intro: 'Alcohol-free attars and oils, distilled the traditional way.' },
  'gift-set': { title: 'Gift Sets', intro: 'Beautifully boxed discovery sets — the perfect gift.' },
};

function readParams(sp: Awaited<SearchParams>) {
  const one = (v: string | string[] | undefined) => (typeof v === 'string' && v.trim() ? v.trim() : undefined);
  const gender = one(sp.gender);
  const category = one(sp.category);
  const q = one(sp.q)?.slice(0, 80);
  const sortRaw = one(sp.sort);
  const sort = SORT_OPTIONS.some((o) => o.value === sortRaw) ? sortRaw! : 'featured';
  const active = SHOP_FILTERS.find((f) =>
    'gender' in f.params ? f.params.gender === gender && !category : 'category' in f.params ? f.params.category === category && !gender : !gender && !category,
  );
  return { gender, category, q, sort, activeKey: active?.key ?? 'all' };
}

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const { activeKey } = readParams(await searchParams);
  const copy = COPY[activeKey] ?? COPY.all;
  return {
    title: copy.title,
    description: `${copy.intro} Shop luxury fragrances from AM Fragrances with free shipping above ₹1,999.`,
    alternates: { canonical: activeKey === 'all' ? '/products' : `/products?${new URLSearchParams(SHOP_FILTERS.find((f) => f.key === activeKey)?.params as Record<string, string>)}` },
  };
}

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const { gender, category, q, sort, activeKey } = readParams(await searchParams);
  const products = await getStoreProducts();
  const list = queryProducts(products, { gender, category, q, sort });
  // Only offer filters that have products (and the one that is open).
  const filters = SHOP_FILTERS.filter(
    (f) => f.key === 'all' || f.key === activeKey || queryProducts(products, f.params as Record<string, string>).length > 0,
  );
  const copy = COPY[activeKey] ?? COPY.all;

  const hrefFor = (params: Record<string, string>, keepQuery = true) => {
    const next = new URLSearchParams(params);
    if (sort !== 'featured') next.set('sort', sort);
    if (q && keepQuery) next.set('q', q);
    const qs = next.toString();
    return qs ? `/products?${qs}` : '/products';
  };
  const currentFilter = Object.fromEntries(Object.entries({ gender, category }).filter(([, v]) => v)) as Record<string, string>;

  return (
    <div className="container-x pb-20 pt-6 sm:pt-8">
      <Breadcrumbs items={activeKey === 'all' ? [{ name: 'Products' }] : [{ name: 'Products', href: '/products' }, { name: copy.title }]} />

      <header className="mt-6">
        <h1 className="text-[32px] font-semibold tracking-tight sm:text-4xl">{copy.title}</h1>
        <p className="mt-2 max-w-2xl text-[16px] text-muted">{copy.intro}</p>
      </header>

      <div className="mt-8 flex flex-col gap-4 border-y border-line py-4 lg:flex-row lg:items-center lg:justify-between">
        <nav aria-label="Filter products" className="-mx-4 flex gap-2 overflow-x-auto px-4 scrollbar-none sm:mx-0 sm:flex-wrap sm:px-0">
          {filters.map((f) => {
            const selected = f.key === activeKey;
            return (
              <Link
                key={f.key}
                href={hrefFor(f.params as Record<string, string>)}
                aria-current={selected ? 'page' : undefined}
                className={cn(
                  'shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition',
                  selected ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink/80 hover:border-ink/40 hover:text-ink',
                )}
              >
                {f.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center justify-between gap-6">
          <p className="text-sm text-muted" aria-live="polite">
            {list.length} {list.length === 1 ? 'product' : 'products'}
          </p>
          <SortSelect value={sort} params={{ gender, category, q }} />
        </div>
      </div>

      {q && (
        <p className="mt-6 text-[15px] text-ink/80">
          Results for <strong>“{q}”</strong>{' '}
          <Link href={hrefFor(currentFilter, false)} className="ml-2 text-brand underline underline-offset-4">
            Clear search
          </Link>
        </p>
      )}

      {list.length > 0 ? (
        <ProductGrid products={list} className="mt-8" priorityCount={4} />
      ) : (
        <div className="mx-auto mt-16 max-w-md text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-cream">
            <SearchX className="h-7 w-7 text-brand" />
          </span>
          <h2 className="mt-5 text-xl font-semibold">No fragrances found</h2>
          <p className="mt-2 text-muted">Try another filter or search for a note such as oud, vanilla or citrus.</p>
          <ButtonLink href="/products" className="mt-6">
            View all products
          </ButtonLink>
        </div>
      )}
    </div>
  );
}
