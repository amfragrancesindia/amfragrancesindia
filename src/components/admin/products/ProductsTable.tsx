'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ImageOff, PackageOpen, Plus, Search } from 'lucide-react';
import { Button, ButtonLink } from '@/components/ui/Button';
import { CATEGORY_LABELS, GENDER_LABELS, type Product } from '@/lib/catalog';
import { STARTER_PRODUCTS } from '@/lib/starter-products';
import { cn, formatDate, formatPrice } from '@/lib/utils';

type Tab = 'all' | 'active' | 'draft' | 'soldout';

const sellable = (p: Product) => p.variants.length > 0 && p.images.length > 0;

function priceRange(p: Product) {
  if (p.variants.length === 0) return '—';
  const prices = p.variants.map((v) => v.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? formatPrice(min) : `${formatPrice(min)} – ${formatPrice(max)}`;
}

function stock(p: Product): { label: string; tone: 'ok' | 'warn' | 'bad' | 'muted' } {
  if (p.variants.length === 0) return { label: 'No sizes', tone: 'muted' };
  const inStock = p.variants.filter((v) => v.inStock).length;
  if (inStock === p.variants.length) return { label: 'In stock', tone: 'ok' };
  if (inStock === 0) return { label: 'Sold out', tone: 'bad' };
  return { label: `${inStock} of ${p.variants.length} sizes in stock`, tone: 'warn' };
}

function StatusPill({ product }: { product: Product }) {
  if (product.published === false) {
    return <span className="rounded-full bg-line px-2.5 py-1 text-[12px] font-semibold text-ink/70">Draft</span>;
  }
  if (!sellable(product)) {
    return (
      <span className="rounded-full bg-gold-soft/60 px-2.5 py-1 text-[12px] font-semibold text-gold" title="Add a photo and a size to show it in the shop">
        Hidden — incomplete
      </span>
    );
  }
  return <span className="rounded-full bg-success/10 px-2.5 py-1 text-[12px] font-semibold text-success">Active</span>;
}

const toneClass = { ok: 'text-success', warn: 'text-gold', bad: 'text-danger', muted: 'text-muted' } as const;

function Thumb({ product, size }: { product: Product; size: 'sm' | 'md' }) {
  return (
    <span className={cn('relative shrink-0 overflow-hidden rounded-lg border border-line bg-cream', size === 'sm' ? 'h-12 w-12' : 'h-16 w-16')}>
      {product.images[0] ? (
        <Image src={product.images[0]} alt="" fill sizes="64px" className="object-cover" />
      ) : (
        <span className="grid h-full w-full place-items-center text-muted">
          <ImageOff className="h-5 w-5" />
        </span>
      )}
    </span>
  );
}

export function ProductsTable({ products }: { products: Product[] }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<Tab>('all');
  const [importing, setImporting] = useState(false);

  const counts = useMemo(
    () => ({
      all: products.length,
      active: products.filter((p) => p.published !== false).length,
      draft: products.filter((p) => p.published === false).length,
      soldout: products.filter((p) => p.variants.length > 0 && p.variants.every((v) => !v.inStock)).length,
    }),
    [products],
  );

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (tab === 'active' && p.published === false) return false;
      if (tab === 'draft' && p.published !== false) return false;
      if (tab === 'soldout' && !(p.variants.length > 0 && p.variants.every((v) => !v.inStock))) return false;
      if (!q) return true;
      return [p.name, p.slug, p.tagline, p.concentration, CATEGORY_LABELS[p.category]].join(' ').toLowerCase().includes(q);
    });
  }, [products, query, tab]);

  const importStarter = async () => {
    setImporting(true);
    try {
      const res = await fetch('/api/admin/products/import', { method: 'POST' });
      const data = (await res.json().catch(() => ({}))) as { created?: number; error?: string };
      if (!res.ok) throw new Error(data.error || 'Import failed');
      toast.success(data.created ? `${data.created} products imported` : 'These products are already here');
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Import failed');
    } finally {
      setImporting(false);
    }
  };

  const tabs: Array<{ key: Tab; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'draft', label: 'Draft' },
    { key: 'soldout', label: 'Sold out' },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
          <p className="text-muted">
            {products.length === 0 ? 'Add the products you sell.' : `${products.length} ${products.length === 1 ? 'product' : 'products'} in your store`}
          </p>
        </div>
        <ButtonLink href="/admin/products/new" variant="dark" size="sm">
          <Plus className="h-4 w-4" /> Add product
        </ButtonLink>
      </div>

      {products.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-line bg-white px-6 py-14 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-cream">
            <PackageOpen className="h-7 w-7 text-brand" />
          </span>
          <h2 className="mt-5 text-xl font-semibold">No products yet</h2>
          <p className="mx-auto mt-2 max-w-md text-muted">
            Start with the {STARTER_PRODUCTS.length} AM Fragrances products ({STARTER_PRODUCTS.map((p) => p.name).join(', ')}) — you can edit or delete them afterwards — or add your own.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button onClick={() => void importStarter()} loading={importing}>
              Import the {STARTER_PRODUCTS.length} products
            </Button>
            <ButtonLink href="/admin/products/new" variant="outline">
              Add a product
            </ButtonLink>
          </div>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white">
          <div className="flex flex-col gap-3 border-b border-line p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
            <nav aria-label="Filter products" className="flex gap-1 overflow-x-auto scrollbar-none">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  aria-pressed={tab === t.key}
                  className={cn(
                    'shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition',
                    tab === t.key ? 'bg-ink text-white' : 'text-ink/70 hover:bg-cream hover:text-ink',
                  )}
                >
                  {t.label} <span className={cn('ml-1 text-xs', tab === t.key ? 'text-white/70' : 'text-muted')}>{counts[t.key]}</span>
                </button>
              ))}
            </nav>
            <label className="relative block sm:w-72">
              <span className="sr-only">Search products</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products"
                className="w-full rounded-lg border border-line bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-brand-light focus:ring-4 focus:ring-brand/10"
              />
            </label>
          </div>

          {list.length === 0 ? (
            <p className="px-6 py-12 text-center text-muted">No products match.</p>
          ) : (
            <>
              {/* Phones: one card per product */}
              <ul className="divide-y divide-line md:hidden">
                {list.map((p) => {
                  const s = stock(p);
                  return (
                    <li key={p.id ?? p.slug}>
                      <Link href={`/admin/products/${p.id}`} className="flex items-center gap-3 p-4 transition hover:bg-cream/50">
                        <Thumb product={p} size="md" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium">{p.name}</span>
                          <span className="block text-sm text-muted">{priceRange(p)}</span>
                          <span className={cn('block text-[12.5px]', toneClass[s.tone])}>{s.label}</span>
                        </span>
                        <StatusPill product={p} />
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Tablets and computers: a table */}
              <table className="hidden w-full text-left text-sm md:table">
                <thead className="border-b border-line bg-cream/40 text-[13px] text-muted">
                  <tr>
                    <th className="px-4 py-3 font-medium">Product</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Stock</th>
                    <th className="hidden px-4 py-3 font-medium lg:table-cell">Collection</th>
                    <th className="px-4 py-3 font-medium">Price</th>
                    <th className="hidden px-4 py-3 font-medium xl:table-cell">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {list.map((p) => {
                    const s = stock(p);
                    return (
                      <tr
                        key={p.id ?? p.slug}
                        className="cursor-pointer transition hover:bg-cream/50"
                        onClick={() => router.push(`/admin/products/${p.id}`)}
                      >
                        <td className="px-4 py-3">
                          <Link href={`/admin/products/${p.id}`} className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                            <Thumb product={p} size="sm" />
                            <span className="min-w-0">
                              <span className="block font-medium text-ink hover:text-brand">{p.name}</span>
                              <span className="block text-[12.5px] text-muted">
                                {p.concentration || '—'} · {GENDER_LABELS[p.gender]}
                              </span>
                            </span>
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <StatusPill product={p} />
                        </td>
                        <td className={cn('px-4 py-3', toneClass[s.tone])}>{s.label}</td>
                        <td className="hidden px-4 py-3 text-ink/80 lg:table-cell">{CATEGORY_LABELS[p.category]}</td>
                        <td className="whitespace-nowrap px-4 py-3 font-medium">{priceRange(p)}</td>
                        <td className="hidden whitespace-nowrap px-4 py-3 text-muted xl:table-cell">{p.updatedAt ? formatDate(p.updatedAt) : '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}
    </div>
  );
}
