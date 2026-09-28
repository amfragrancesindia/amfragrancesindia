import type { MetadataRoute } from 'next';
import { products } from '@/lib/catalog';
import { absoluteUrl } from '@/lib/utils';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: Array<[string, number, MetadataRoute.Sitemap[number]['changeFrequency']]> = [
    ['/', 1, 'weekly'],
    ['/products', 0.9, 'weekly'],
    ['/products?gender=men', 0.8, 'weekly'],
    ['/products?gender=women', 0.8, 'weekly'],
    ['/products?gender=unisex', 0.7, 'weekly'],
    ['/products?category=attars-oils', 0.7, 'weekly'],
    ['/products?category=gift-set', 0.6, 'monthly'],
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
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      images: p.images.map((src) => absoluteUrl(src)),
    })),
  ];
}
