// The product catalogue. This is the single source of truth for everything
// the storefront shows and for the prices charged at checkout.
//
// To change a price, add a size or swap in real photography, edit the entry
// below. Images live in /public/images/am/products — replace the .webp files
// (or point `images` at new files) and the whole site picks them up.

export type Gender = 'men' | 'women' | 'unisex';
export type Category = 'perfume' | 'attar' | 'oil' | 'gift-set';
export type Badge = 'New' | 'Bestseller' | 'Limited Edition';

export interface Variant {
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
  releasedAt: string;
}

const img = (slug: string, count: number) =>
  Array.from({ length: count }, (_, i) => `/images/am/products/${slug}${i === 0 ? '' : `-${i + 1}`}.webp`);

export const products: Product[] = [
  {
    slug: 'saffron-royale',
    name: 'Saffron Royale',
    tagline: 'Regal saffron, rose and Mysore sandalwood',
    description:
      'A regal composition inspired by the Mughal courts. Precious Kashmiri saffron opens over warm cardamom before unfolding into a heart of Bulgarian rose and powdery iris. The dry-down settles into creamy sandalwood, golden amber and soft white musk — opulent, long-lasting and unmistakably royal.',
    gender: 'unisex',
    category: 'perfume',
    concentration: 'Eau de Parfum',
    images: img('saffron-royale', 3),
    variants: [
      { id: '50ml', size: '50 ml', price: 3999, mrp: 4499, inStock: true },
      { id: '100ml', size: '100 ml', price: 5699, mrp: 6499, inStock: true },
    ],
    notes: { top: ['Kashmiri Saffron', 'Cardamom'], heart: ['Bulgarian Rose', 'Iris'], base: ['Sandalwood', 'Amber', 'White Musk'] },
    longevity: '8–10 hours',
    sillage: 'Strong',
    seasons: ['Autumn', 'Winter', 'Spring'],
    occasions: ['Weddings', 'Festive', 'Evening'],
    badge: 'Bestseller',
    bestseller: true,
    releasedAt: '2025-07-01',
  },
  {
    slug: 'imperial-oud',
    name: 'Imperial Oud',
    tagline: 'Aged Indian oud, vintage rose and iris',
    description:
      'Our most exclusive creation, released in small batches. Aged Indian oud meets vintage rose and a velvety musk accord, lifted by saffron and finished with precious iris. Deep, smoky and magnetic — a fragrance for the moments that deserve to be remembered.',
    gender: 'unisex',
    category: 'perfume',
    concentration: 'Eau de Parfum',
    images: img('imperial-oud', 3),
    variants: [
      { id: '50ml', size: '50 ml', price: 8999, mrp: 9999, inStock: true },
      { id: '100ml', size: '100 ml', price: 14999, mrp: 16999, inStock: true },
    ],
    notes: { top: ['Saffron', 'Oud'], heart: ['Vintage Rose', 'Musk Accord'], base: ['Aged Indian Oud', 'Amber', 'Iris'] },
    longevity: '12+ hours',
    sillage: 'Enormous',
    seasons: ['Autumn', 'Winter'],
    occasions: ['Weddings', 'Formal', 'Evening'],
    badge: 'Limited Edition',
    releasedAt: '2025-01-01',
  },
  {
    slug: 'velvet-oud',
    name: 'Velvet Oud',
    tagline: 'Oud wrapped in rose, saffron and dark vanilla',
    description:
      'An ultra-luxurious oud composition. Saffron and cardamom lead into a rich heart of Indian oud and Bulgarian rose, resting on dark vanilla, dry tobacco and earthy patchouli. Smooth, sensual and made for the evening.',
    gender: 'men',
    category: 'perfume',
    concentration: 'Eau de Parfum',
    images: img('velvet-oud', 3),
    variants: [
      { id: '50ml', size: '50 ml', price: 6999, mrp: 7999, inStock: true },
      { id: '100ml', size: '100 ml', price: 9999, mrp: 11499, inStock: true },
    ],
    notes: { top: ['Saffron', 'Cardamom'], heart: ['Indian Oud', 'Bulgarian Rose'], base: ['Dark Vanilla', 'Tobacco', 'Patchouli'] },
    longevity: '10–12 hours',
    sillage: 'Strong',
    seasons: ['Winter'],
    occasions: ['Formal', 'Evening', 'Weddings'],
    releasedAt: '2025-04-01',
  },
  {
    slug: 'midnight-oud',
    name: 'Midnight Oud',
    tagline: 'Smoky oud, cocoa and tobacco',
    description:
      'Dark, smoky and intoxicating. A bitter-cocoa and black-pepper opening gives way to rich oud and dry tobacco leaf, grounded by patchouli, smoked amber and vetiver. Bold and unapologetic, for the confident connoisseur.',
    gender: 'men',
    category: 'perfume',
    concentration: 'Eau de Parfum',
    images: img('midnight-oud', 3),
    variants: [
      { id: '50ml', size: '50 ml', price: 5499, mrp: 6499, inStock: true },
      { id: '100ml', size: '100 ml', price: 7999, mrp: 9499, inStock: true },
    ],
    notes: { top: ['Dark Chocolate', 'Black Pepper'], heart: ['Oud', 'Tobacco Leaf'], base: ['Patchouli', 'Dark Amber', 'Vetiver'] },
    longevity: '10–12 hours',
    sillage: 'Strong',
    seasons: ['Winter'],
    occasions: ['Evening', 'Formal'],
    releasedAt: '2025-02-15',
  },
  {
    slug: 'darjeeling-oud',
    name: 'Darjeeling Oud',
    tagline: 'Hill tea, Assam oud and soft leather',
    description:
      'Inspired by the misty tea gardens of Darjeeling. Fresh first-flush tea and bergamot drift over Assam oud and warm cardamom, before a refined base of leather, cedarwood and amber. Elegant enough for the office, memorable enough for the evening.',
    gender: 'men',
    category: 'perfume',
    concentration: 'Eau de Parfum',
    images: img('darjeeling-oud', 3),
    variants: [
      { id: '50ml', size: '50 ml', price: 4999, mrp: 5499, inStock: true },
      { id: '100ml', size: '100 ml', price: 6999, mrp: 7699, inStock: true },
    ],
    notes: { top: ['Darjeeling Tea', 'Bergamot'], heart: ['Assam Oud', 'Cardamom'], base: ['Leather', 'Cedarwood', 'Amber'] },
    longevity: '8–10 hours',
    sillage: 'Moderate',
    seasons: ['Autumn', 'Winter'],
    occasions: ['Office', 'Evening', 'Formal'],
    badge: 'Bestseller',
    bestseller: true,
    releasedAt: '2025-03-10',
  },
  {
    slug: 'wood-and-smoke',
    name: 'Wood & Smoke',
    tagline: 'Smoky vetiver, birch and cedar',
    description:
      'A rugged, smoky fragrance for the modern man. Black pepper and grapefruit spark over birch tar and earthy vetiver, settling into dry cedarwood, oakmoss and patchouli. Understated, confident and effortlessly wearable.',
    gender: 'men',
    category: 'perfume',
    concentration: 'Eau de Parfum',
    images: img('wood-and-smoke', 3),
    variants: [
      { id: '50ml', size: '50 ml', price: 2799, mrp: 3299, inStock: true },
      { id: '100ml', size: '100 ml', price: 3999, mrp: 4699, inStock: true },
    ],
    notes: { top: ['Black Pepper', 'Grapefruit'], heart: ['Birch Tar', 'Vetiver'], base: ['Cedarwood', 'Oakmoss', 'Patchouli'] },
    longevity: '7–9 hours',
    sillage: 'Moderate',
    seasons: ['Autumn', 'Winter'],
    occasions: ['Casual', 'Office', 'Outdoor'],
    releasedAt: '2025-05-01',
  },
  {
    slug: 'amber-mystique',
    name: 'Amber Mystique',
    tagline: 'Warm amber, vanilla and sandalwood',
    description:
      'A warm, enveloping amber built around precious resins. Bergamot and a touch of saffron glow over an amber-rose heart, melting into sandalwood, vanilla and benzoin. Comforting, sophisticated and perfect for evenings.',
    gender: 'unisex',
    category: 'perfume',
    concentration: 'Eau de Parfum',
    images: img('amber-mystique', 3),
    variants: [
      { id: '50ml', size: '50 ml', price: 2999, mrp: 3499, inStock: true },
      { id: '100ml', size: '100 ml', price: 4299, mrp: 4999, inStock: true },
    ],
    notes: { top: ['Bergamot', 'Saffron'], heart: ['Amber', 'Rose'], base: ['Sandalwood', 'Vanilla', 'Benzoin'] },
    longevity: '8–10 hours',
    sillage: 'Moderate',
    seasons: ['Autumn', 'Winter'],
    occasions: ['Evening', 'Formal', 'Casual'],
    badge: 'Bestseller',
    bestseller: true,
    releasedAt: '2025-06-01',
  },
  {
    slug: 'jashn-eau-de-parfum',
    name: 'Jashn',
    tagline: 'Jasmine, rose and saffron — a celebration',
    description:
      'Jashn means celebration. Saffron and mandarin sparkle over a festive bouquet of jasmine, rose and iris, resting on agarwood, amber and musk. Radiant and joyful — made for weddings, festivals and every reason to dress up.',
    gender: 'women',
    category: 'perfume',
    concentration: 'Eau de Parfum',
    images: img('jashn-eau-de-parfum', 3),
    variants: [
      { id: '50ml', size: '50 ml', price: 3499, mrp: 3999, inStock: true },
      { id: '100ml', size: '100 ml', price: 4999, mrp: 5699, inStock: true },
    ],
    notes: { top: ['Saffron', 'Mandarin'], heart: ['Jasmine', 'Rose', 'Iris'], base: ['Agarwood', 'Amber', 'Musk'] },
    longevity: '7–9 hours',
    sillage: 'Strong',
    seasons: ['Spring', 'Winter'],
    occasions: ['Weddings', 'Festive', 'Party'],
    badge: 'New',
    releasedAt: '2025-08-15',
  },
  {
    slug: 'jasmine-zafran',
    name: 'Jasmine Zafran',
    tagline: 'Night jasmine meets precious saffron',
    description:
      'Night-blooming jasmine and precious saffron in perfect harmony. Bright bergamot opens onto jasmine, orange blossom and ylang-ylang, softened by white musk, cedarwood and a warm amber glow. Luminous and intoxicating.',
    gender: 'women',
    category: 'perfume',
    concentration: 'Eau de Parfum',
    images: img('jasmine-zafran', 3),
    variants: [
      { id: '50ml', size: '50 ml', price: 3199, mrp: 3699, inStock: true },
      { id: '100ml', size: '100 ml', price: 4599, mrp: 5299, inStock: true },
    ],
    notes: { top: ['Saffron', 'Bergamot'], heart: ['Night Jasmine', 'Orange Blossom', 'Ylang-Ylang'], base: ['White Musk', 'Cedarwood', 'Amber'] },
    longevity: '7–9 hours',
    sillage: 'Strong',
    seasons: ['Spring', 'Summer'],
    occasions: ['Party', 'Date Night', 'Festive'],
    badge: 'New',
    releasedAt: '2025-08-01',
  },
  {
    slug: 'white-musk-elixir',
    name: 'White Musk Elixir',
    tagline: 'Clean white musks and soft white florals',
    description:
      'An inviting veil of white musks, white flowers and soft woods. Juicy peach and bergamot lead into gardenia, jasmine and ylang-ylang, settling into clean musk, sandalwood and ambrette. Fresh, sensual and easy to wear every day.',
    gender: 'women',
    category: 'perfume',
    concentration: 'Eau de Parfum',
    images: img('white-musk-elixir', 3),
    variants: [
      { id: '50ml', size: '50 ml', price: 2499, mrp: 2999, inStock: true },
      { id: '100ml', size: '100 ml', price: 3599, mrp: 4299, inStock: true },
    ],
    notes: { top: ['Peach', 'Bergamot'], heart: ['Gardenia', 'Jasmine', 'Ylang-Ylang'], base: ['White Musk', 'Sandalwood', 'Ambrette'] },
    longevity: '6–8 hours',
    sillage: 'Moderate',
    seasons: ['Spring', 'Summer'],
    occasions: ['Everyday', 'Office', 'Date Night'],
    badge: 'New',
    releasedAt: '2025-09-01',
  },
  {
    slug: 'rose-gulab-attar',
    name: 'Rose Gulab Attar',
    tagline: 'Pure Kannauj rose, alcohol-free',
    description:
      'A timeless classic of Indian perfumery. Rose petals from Kannauj are distilled the traditional way into a rich, alcohol-free attar with a whisper of sandalwood. Apply a drop to the wrists and neck for a soft, intimate trail that lasts for hours.',
    gender: 'women',
    category: 'attar',
    concentration: 'Attar',
    images: img('rose-gulab-attar', 2),
    variants: [
      { id: '12ml', size: '12 ml', price: 1899, mrp: 2199, inStock: true },
      { id: '24ml', size: '24 ml', price: 3299, mrp: 3799, inStock: true },
    ],
    notes: { top: ['Fresh Rose Petals'], heart: ['Damask Rose'], base: ['Sandalwood'] },
    longevity: '6–8 hours',
    sillage: 'Intimate',
    seasons: ['Spring', 'Summer'],
    occasions: ['Weddings', 'Festive', 'Everyday'],
    releasedAt: '2025-01-01',
  },
  {
    slug: 'royal-amber-attar',
    name: 'Royal Amber Attar',
    tagline: 'Aged amber, saffron and sandalwood',
    description:
      'A traditional Kannauj attar featuring aged amber and saffron with a gentle touch of cinnamon, rose and oud. Alcohol-free and deeply concentrated — a few drops wrap you in golden warmth from morning to night.',
    gender: 'unisex',
    category: 'attar',
    concentration: 'Attar',
    images: img('royal-amber-attar', 2),
    variants: [
      { id: '6ml', size: '6 ml', price: 2199, mrp: 2599, inStock: true },
      { id: '12ml', size: '12 ml', price: 3799, mrp: 4399, inStock: true },
    ],
    notes: { top: ['Saffron', 'Cinnamon'], heart: ['Aged Amber', 'Rose'], base: ['Sandalwood', 'Oud'] },
    longevity: '8–10 hours',
    sillage: 'Intimate',
    seasons: ['Autumn', 'Winter'],
    occasions: ['Festive', 'Formal', 'Everyday'],
    badge: 'Limited Edition',
    releasedAt: '2025-01-15',
  },
  {
    slug: 'champa-lavender',
    name: 'Champa Lavender',
    tagline: 'Sacred champa and calming lavender',
    description:
      'A serene blend of sacred champa (frangipani) and French lavender in a nourishing oil base. Bright lemon and lavender open onto creamy champa and ylang-ylang, resting on sandalwood and soft musk. Calming, spiritual and beautifully gentle on skin.',
    gender: 'unisex',
    category: 'oil',
    concentration: 'Perfume Oil',
    images: img('champa-lavender', 2),
    variants: [
      { id: '15ml', size: '15 ml', price: 2099, mrp: 2499, inStock: true },
      { id: '30ml', size: '30 ml', price: 3599, mrp: 4199, inStock: true },
    ],
    notes: { top: ['Lavender', 'Lemon'], heart: ['Champa (Frangipani)', 'Ylang-Ylang'], base: ['Sandalwood', 'White Musk'] },
    longevity: '5–6 hours',
    sillage: 'Intimate',
    seasons: ['Spring', 'Summer'],
    occasions: ['Everyday', 'Meditation', 'Casual'],
    bestseller: true,
    releasedAt: '2025-02-01',
  },
  {
    slug: 'discovery-set',
    name: 'Discovery Set',
    tagline: 'Six signature fragrances to explore',
    description:
      'The perfect introduction to AM Fragrances — and a beautiful gift. Six miniatures of our most-loved eau de parfums (Saffron Royale, Jashn, Darjeeling Oud, Amber Mystique, White Musk Elixir and Midnight Oud), presented in an elegant keepsake box.',
    gender: 'unisex',
    category: 'gift-set',
    concentration: 'Gift Set',
    images: img('discovery-set', 2),
    variants: [
      { id: 'standard', size: '6 × 10 ml', price: 4499, mrp: 5999, inStock: true },
      { id: 'premium', size: '6 × 15 ml', price: 6499, mrp: 7999, inStock: true },
    ],
    notes: {
      top: ['Saffron Royale', 'Jashn'],
      heart: ['Darjeeling Oud', 'Amber Mystique'],
      base: ['White Musk Elixir', 'Midnight Oud'],
    },
    longevity: 'Varies by fragrance',
    sillage: 'Moderate to strong',
    seasons: ['All seasons'],
    occasions: ['Gifting', 'Travel'],
    badge: 'New',
    bestseller: true,
    releasedAt: '2025-08-20',
  },
];

export const FEATURED_SLUG = 'saffron-royale';

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

const bySlug = new Map(products.map((p) => [p.slug, p]));

export function getProduct(slug: string): Product | undefined {
  return bySlug.get(slug);
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

function matchesQuery(p: Product, q: string): boolean {
  const haystack = [
    p.name,
    p.tagline,
    p.description,
    p.concentration,
    GENDER_LABELS[p.gender],
    CATEGORY_LABELS[p.category],
    ...p.notes.top,
    ...p.notes.heart,
    ...p.notes.base,
  ]
    .join(' ')
    .toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

export function queryProducts({ q, gender, category, sort }: ProductQuery = {}): Product[] {
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
        if ([...p.notes.top, ...p.notes.heart, ...p.notes.base].some((n) => n.toLowerCase().includes(t))) score += 2;
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

export function getFeaturedProduct(): Product {
  return getProduct(FEATURED_SLUG) ?? products[0];
}

export function getBestsellers(limit = 8): Product[] {
  return queryProducts({ sort: 'featured' }).slice(0, limit);
}

export function getNewArrivals(limit = 4): Product[] {
  return queryProducts({ sort: 'newest' }).slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const score = (p: Product) =>
    (p.gender === product.gender ? 2 : 0) +
    (p.category === product.category ? 2 : 0) +
    [...p.notes.top, ...p.notes.heart, ...p.notes.base].filter((n) =>
      [...product.notes.top, ...product.notes.heart, ...product.notes.base].includes(n),
    ).length;
  return products
    .filter((p) => p.slug !== product.slug)
    .sort((a, b) => score(b) - score(a))
    .slice(0, limit);
}
