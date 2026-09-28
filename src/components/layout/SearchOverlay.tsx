'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Search } from 'lucide-react';
import { queryProducts, startingVariant } from '@/lib/catalog';
import { formatPrice } from '@/lib/utils';
import { Drawer } from './Drawer';

const POPULAR = ['Oud', 'Saffron', 'Rose', 'Attar', 'Jasmine', 'Gift set'];

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const deferred = useDeferredValue(query);
  const results = useMemo(() => (deferred.trim() ? queryProducts({ q: deferred }).slice(0, 6) : []), [deferred]);

  const submit = (q: string) => {
    const term = q.trim();
    if (!term) return;
    onClose();
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <Drawer open={open} onClose={onClose} side="top" title="Search" hideTitle className="rounded-b-3xl">
      <div className="container-x max-w-3xl py-6 sm:py-8">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            submit(query);
          }}
          className="flex items-center gap-3 border-b-2 border-ink pb-3"
        >
          <Search className="h-6 w-6 shrink-0 text-ink/60" aria-hidden />
          <input
            data-autofocus
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search perfumes, attars, notes…"
            aria-label="Search products"
            className="w-full bg-transparent text-xl outline-none placeholder:text-muted/70 sm:text-2xl"
          />
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full px-3 py-1.5 text-sm text-muted hover:bg-cream hover:text-ink"
          >
            Close
          </button>
        </form>

        {query.trim() === '' ? (
          <div className="mt-6">
            <p className="eyebrow mb-3">Popular searches</p>
            <div className="flex flex-wrap gap-2">
              {POPULAR.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => submit(term)}
                  className="rounded-full border border-line px-4 py-1.5 text-sm transition hover:border-brand hover:text-brand"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        ) : results.length > 0 ? (
          <div className="mt-5">
            <ul className="divide-y divide-line">
              {results.map((p) => {
                const v = startingVariant(p);
                return (
                  <li key={p.slug}>
                    <Link href={`/products/${p.slug}`} onClick={onClose} className="group flex items-center gap-4 py-3">
                      <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-cream">
                        <Image src={p.images[0]} alt="" fill sizes="64px" className="object-cover" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium group-hover:text-brand">{p.name}</span>
                        <span className="block truncate text-sm text-muted">{p.tagline}</span>
                      </span>
                      <span className="shrink-0 text-sm font-semibold">{formatPrice(v.price)}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <button
              type="button"
              onClick={() => submit(query)}
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-ink"
            >
              See all results for “{query.trim()}” <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <p className="mt-6 text-muted">
            No fragrances match “{query.trim()}”. Try a note like <em>oud</em>, <em>rose</em> or <em>saffron</em>.
          </p>
        )}
      </div>
    </Drawer>
  );
}
