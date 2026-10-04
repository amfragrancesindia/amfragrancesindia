// Server-side access to the product catalogue in the database.
import { cache } from 'react';
import type { Product as ProductRow } from '@prisma/client';
import { BADGES, CATEGORIES, GENDERS, findProduct, type Badge, type Category, type Gender, type Product, type Variant } from './catalog';
import { isDatabaseConfigured, prisma } from './prisma';
import { VIDEO_URL } from './product-input';

const asStrings = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string' && v.trim() !== '') : [];

function asVariants(value: unknown): Variant[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((raw) => {
    if (!raw || typeof raw !== 'object') return [];
    const { id, size, price, mrp, inStock } = raw as Record<string, unknown>;
    if (typeof id !== 'string' || typeof size !== 'string' || typeof price !== 'number' || price <= 0) return [];
    return [{ id, size, price, mrp: typeof mrp === 'number' && mrp >= price ? mrp : price, inStock: inStock !== false }];
  });
}

function asNotes(value: unknown): Product['notes'] {
  const n = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>;
  return { top: asStrings(n.top), heart: asStrings(n.heart), base: asStrings(n.base) };
}

const oneOf = <T extends string>(list: readonly T[], value: string | null | undefined, fallback: T): T =>
  (list as readonly string[]).includes(value ?? '') ? (value as T) : fallback;

export function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    gender: oneOf<Gender>(GENDERS, row.gender, 'unisex'),
    category: oneOf<Category>(CATEGORIES, row.category, 'perfume'),
    concentration: row.concentration,
    images: asStrings(row.images),
    video: row.video && VIDEO_URL.test(row.video) ? row.video : null,
    variants: asVariants(row.variants),
    notes: asNotes(row.notes),
    longevity: row.longevity,
    sillage: row.sillage,
    seasons: asStrings(row.seasons),
    occasions: asStrings(row.occasions),
    badge: (BADGES as readonly string[]).includes(row.badge ?? '') ? (row.badge as Badge) : undefined,
    bestseller: row.bestseller,
    featured: row.featured,
    published: row.published,
    releasedAt: row.releasedAt.toISOString().slice(0, 10),
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    updatedAt: row.updatedAt.toISOString(),
  };
}

/** A product can be shown and sold once it has at least one size and one photo. */
export const isSellable = (p: Product) => p.variants.length > 0 && p.images.length > 0;

/**
 * Every published product, as the storefront shows them. Loaded once per
 * request (pages call this from several components).
 */
export const getStoreProducts = cache(async (): Promise<Product[]> => {
  if (!isDatabaseConfigured()) return [];
  const rows = await prisma.product.findMany({ where: { published: true }, orderBy: { createdAt: 'asc' } });
  return rows.map(toProduct).filter(isSellable);
});

/** One product for its page. Drafts are only returned when `includeDrafts` is set (admin preview). */
export async function getProductPage(slug: string, { includeDrafts = false } = {}): Promise<Product | undefined> {
  if (!isDatabaseConfigured()) return undefined;
  const row = await prisma.product.findUnique({ where: { slug } });
  if (!row) return undefined;
  const product = toProduct(row);
  if (!isSellable(product)) return includeDrafts ? product : undefined;
  if (!row.published && !includeDrafts) return undefined;
  return product;
}

/** Looks up products by slug for pricing a cart on the server. */
export async function storeLookup(): Promise<(slug: string) => Product | undefined> {
  const products = await getStoreProducts();
  return (slug) => findProduct(products, slug);
}

export async function getAdminProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({ orderBy: [{ updatedAt: 'desc' }] });
  return rows.map(toProduct);
}

export async function getAdminProduct(id: string): Promise<Product | undefined> {
  const row = await prisma.product.findUnique({ where: { id } });
  return row ? toProduct(row) : undefined;
}
