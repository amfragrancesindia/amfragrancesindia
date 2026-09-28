import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { absoluteUrl, cn } from '@/lib/utils';

interface Crumb {
  name: string;
  href?: string;
}

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  const all = [{ name: 'Home', href: '/' }, ...items];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: all.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      ...(c.href ? { item: absoluteUrl(c.href) } : {}),
    })),
  };
  return (
    <nav aria-label="Breadcrumb" className={cn('text-[13px] text-muted', className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {all.map((c, i) => (
          <li key={c.name} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted/60" aria-hidden />}
            {c.href && i < all.length - 1 ? (
              <Link href={c.href} className="transition-colors hover:text-ink">
                {c.name}
              </Link>
            ) : (
              <span aria-current={i === all.length - 1 ? 'page' : undefined} className="text-ink/80">
                {c.name}
              </span>
            )}
          </li>
        ))}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </nav>
  );
}
