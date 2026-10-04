import type { MetadataRoute } from 'next';
import { SHOP_FILTERS, queryProducts } from '@/lib/catalog';
import { getStoreProducts } from '@/lib/products';
import { absoluteUrl } from '@/lib/utils';

// Lists the products currently in the database.
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const products = await getStoreProducts();
  // Shop filters that have products (Men, Women, Unisex, …).
  const filters = SHOP_FILTERS.filter((f) => f.key !== 'all' && queryProducts(products, f.params as Record<string, string>).length > 0);
  const pages: Array<[string, number, MetadataRoute.Sitemap[number]['changeFrequency']]> = [
    ['/', 1, 'weekly'],
    ['/products', 0.9, 'weekly'],
    ...filters.map((f): [string, number, 'weekly'] => [`/products?${new URLSearchParams(f.params as Record<string, string>)}`, 0.7, 'weekly']),
    ['/about', 0.5, 'monthly'],
    ['/contact', 0.5, 'yearly'],
    ['/faq', 0.5, 'monthly'],
    ['/shipping-policy', 0.3, 'yearly'],
    ['/refund-policy', 0.3, 'yearly'],
    ['/privacy-policy', 0.2, 'yearly'],
    ['/terms', 0.2, 'yearly'],
  ];
  return [
    ...pages.map(([path, priority, changeFrequency]) => ({ url: absoluteUrl(path), lastModified: now, changeFrequency, priority })),
    ...products.map((p) => ({
      url: absoluteUrl(`/products/${p.slug}`),
      lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      images: p.images.map((src) => absoluteUrl(src)),
      ...(p.video ? { videos: [{ title: p.name, thumbnail_loc: absoluteUrl(p.images[0] ?? '/icon.png'), description: p.tagline || p.name, content_loc: absoluteUrl(p.video) }] } : {}),
    })),
  ];
}
