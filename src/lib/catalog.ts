// Product types, labels and the pure helpers shared by the server and the
// browser. The products themselves live in the database (see src/lib/products.ts
// on the server and /api/catalog in the browser) and are managed in the admin
// panel at /admin/products.

export const GENDERS = ['men', 'women', 'unisex'] as const;
export const CATEGORIES = ['perfume', 'attar', 'oil', 'gift-set'] as const;
export const BADGES = ['New', 'Bestseller', 'Limited Edition'] as const;

export type Gender = (typeof GENDERS)[number];
export type Category = (typeof CATEGORIES)[number];
export type Badge = (typeof BADGES)[number];

export interface Variant {
  /** Stable key stored in carts and orders, e.g. "50ml". */
  id: string;
  size: string;
  price: number;
  /** Maximum retail price. When higher than `price`, the saving is shown. */
  mrp: number;
  inStock: boolean;
}

export interface Product {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  gender: Gender;
  category: Category;
  concentration: string;
  images: string[];
  variants: Variant[];
  notes: { top: string[]; heart: string[]; base: string[] };
  longevity: string;
  sillage: string;
  seasons: string[];
  occasions: string[];
  badge?: Badge;
  bestseller?: boolean;
  /** Shown as the "Featured Perfume" on the home page. */
  featured?: boolean;
  /** ISO date (YYYY-MM-DD) used for "Newest" sorting. */
  releasedAt: string;
  // Present on products loaded from the database:
  id?: string;
  published?: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
  updatedAt?: string;
}

export const GENDER_LABELS: Record<Gender, string> = {
  men: 'Men',
  women: 'Women',
  unisex: 'Unisex',
};

export const CATEGORY_LABELS: Record<Category, string> = {
  perfume: 'Eau de Parfum',
  attar: 'Attars',
  oil: 'Perfume Oils',
  'gift-set': 'Gift Sets',
};

/** Shop filters shown on the products page, in display order. */
export const SHOP_FILTERS = [
  { key: 'all', label: 'All', params: {} },
  { key: 'men', label: 'Men', params: { gender: 'men' } },
  { key: 'women', label: 'Women', params: { gender: 'women' } },
  { key: 'unisex', label: 'Unisex', params: { gender: 'unisex' } },
  { key: 'attars-oils', label: 'Attars & Oils', params: { category: 'attars-oils' } },
  { key: 'gift-set', label: 'Gift Sets', params: { category: 'gift-set' } },
] as const;

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name: A to Z' },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]['value'];

export function findProduct(list: readonly Product[], slug: string): Product | undefined {
  return list.find((p) => p.slug === slug);
}

export function getVariant(product: Product, variantId?: string | null): Variant {
  return product.variants.find((v) => v.id === variantId) ?? product.variants[0];
}

/** Lowest-priced variant, used for "from" prices on cards. */
export function startingVariant(product: Product): Variant {
  return product.variants.reduce((min, v) => (v.price < min.price ? v : min), product.variants[0]);
}

export function discountPercent(v: Pick<Variant, 'price' | 'mrp'>): number {
  return v.mrp > v.price ? Math.round(((v.mrp - v.price) / v.mrp) * 100) : 0;
}

export function isInStock(product: Product): boolean {
  return product.variants.some((v) => v.inStock);
}

export interface ProductQuery {
  q?: string;
  gender?: string;
  category?: string;
  sort?: string;
}

const allNotes = (p: Product) => [...p.notes.top, ...p.notes.heart, ...p.notes.base];

function matchesQuery(p: Product, q: string): boolean {
  const haystack = [
    p.name,
    p.tagline,
    p.description,
    p.concentration,
    GENDER_LABELS[p.gender],
    CATEGORY_LABELS[p.category],
    ...allNotes(p),
  ]
    .join(' ')
    .toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

export function queryProducts(products: readonly Product[], { q, gender, category, sort }: ProductQuery = {}): Product[] {
  let list = products.slice();
  if (gender && gender in GENDER_LABELS) list = list.filter((p) => p.gender === gender);
  if (category === 'attars-oils') list = list.filter((p) => p.category === 'attar' || p.category === 'oil');
  else if (category && category in CATEGORY_LABELS) list = list.filter((p) => p.category === category);
  if (q && q.trim()) list = list.filter((p) => matchesQuery(p, q.trim()));

  const price = (p: Product) => startingVariant(p).price;
  const query = q?.trim().toLowerCase();
  if (query && (!sort || sort === 'featured')) {
    // Most relevant first: name matches beat tagline/notes, which beat description.
    const terms = query.split(/\s+/).filter(Boolean);
    const relevance = (p: Product) =>
      terms.reduce((score, t) => {
        if (p.name.toLowerCase().includes(t)) score += 10;
        if (p.tagline.toLowerCase().includes(t)) score += 4;
        if (allNotes(p).some((n) => n.toLowerCase().includes(t))) score += 2;
        return score;
      }, 0);
    return list.sort((a, b) => relevance(b) - relevance(a) || Number(!!b.bestseller) - Number(!!a.bestseller));
  }
  switch (sort as SortOption) {
    case 'newest':
      list.sort((a, b) => b.releasedAt.localeCompare(a.releasedAt));
      break;
    case 'price-asc':
      list.sort((a, b) => price(a) - price(b));
      break;
    case 'price-desc':
      list.sort((a, b) => price(b) - price(a));
      break;
    case 'name':
      list.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      // Featured: bestsellers first, then newest.
      list.sort((a, b) => Number(!!b.bestseller) - Number(!!a.bestseller) || b.releasedAt.localeCompare(a.releasedAt));
  }
  return list;
}

export function getFeaturedProduct(products: readonly Product[]): Product | undefined {
  return products.find((p) => p.featured) ?? queryProducts(products, { sort: 'featured' })[0];
}

export function getBestsellers(products: readonly Product[], limit = 8): Product[] {
  return queryProducts(products, { sort: 'featured' }).slice(0, limit);
}

export function getNewArrivals(products: readonly Product[], limit = 4): Product[] {
  return queryProducts(products, { sort: 'newest' }).slice(0, limit);
}

export function getRelatedProducts(products: readonly Product[], product: Product, limit = 4): Product[] {
  const mine = allNotes(product);
  const score = (p: Product) =>
    (p.gender === product.gender ? 2 : 0) +
    (p.category === product.category ? 2 : 0) +
    allNotes(p).filter((n) => mine.includes(n)).length;
  return products
    .filter((p) => p.slug !== product.slug)
    .slice()
    .sort((a, b) => score(b) - score(a))
    .slice(0, limit);
}

/** "50 ml" → "50ml": the stable key a new size gets. */
export function variantKey(size: string): string {
  return (
    size
      .toLowerCase()
      .replace(/×/g, 'x')
      .replace(/[^a-z0-9]+/g, '')
      .slice(0, 30) || 'size'
  );
}

/** "Saffron Royale" → "saffron-royale" */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}
