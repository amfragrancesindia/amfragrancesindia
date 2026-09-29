'use client';

import { usePathname, useRouter } from 'next/navigation';
import { SORT_OPTIONS } from '@/lib/catalog';

export function SortSelect({ value, params }: { value: string; params: Record<string, string | undefined> }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-muted">Sort by</span>
      <span className="relative">
        <select
          value={value}
          onChange={(e) => {
            const next = new URLSearchParams();
            Object.entries(params).forEach(([k, v]) => v && next.set(k, v));
            if (e.target.value !== 'featured') next.set('sort', e.target.value);
            const qs = next.toString();
            router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
          }}
          className="appearance-none rounded-full border border-line bg-white py-2 pl-4 pr-9 text-sm font-medium text-ink outline-none transition hover:border-ink/40 focus:border-brand-light"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </span>
    </label>
  );
}
