// The product form: what the admin panel sends and how it is validated.
// Used by the editor in the browser and again by the API on the server.
import { z } from 'zod';
import { BADGES, CATEGORIES, GENDERS, type Product } from './catalog';

const text = (max: number) => z.string().trim().max(max, `Keep this under ${max} characters`);
const tags = (label: string) =>
  z
    .array(z.string().trim().min(1).max(40, `${label}: keep each one under 40 characters`))
    .max(12, `${label}: add up to 12`);

/** Uploaded photos (/media/...) or the photos shipped with the site (/images/...). */
export const IMAGE_URL = /^\/(?:media\/p-[a-f0-9]{32}\.(?:webp|jpg|png|avif)|images\/[a-z0-9/_-]+\.(?:webp|jpe?g|png|avif))$/;
/** An uploaded product video. */
export const VIDEO_URL = /^\/media\/v-[a-f0-9]{32}\.mp4$/;
export const MAX_PHOTOS = 5;

export const variantInput = z.object({
  id: z.string().regex(/^[a-z0-9-]{1,40}$/, 'Invalid size'),
  size: z.string().trim().min(1, 'Enter a size, e.g. 50 ml').max(30, 'Keep the size short'),
  price: z
    .number({ invalid_type_error: 'Enter a price' })
    .int('Use whole rupees')
    .min(1, 'Enter a price')
    .max(1_000_000, 'That price looks too high'),
  mrp: z.number({ invalid_type_error: 'Enter the MRP' }).int('Use whole rupees').min(0).max(1_000_000, 'That MRP looks too high'),
  inStock: z.boolean(),
});

export const productInput = z
  .object({
    name: z.string().trim().min(2, 'Enter the product name').max(80, 'Keep the name under 80 characters'),
    slug: z
      .string()
      .trim()
      .toLowerCase()
      .min(2, 'Enter the page address')
      .max(80, 'Keep the address under 80 characters')
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and hyphens only'),
    tagline: text(140),
    description: text(4000),
    gender: z.enum(GENDERS),
    category: z.enum(CATEGORIES),
    concentration: text(40),
    images: z.array(z.string().regex(IMAGE_URL, 'Invalid photo')).max(MAX_PHOTOS, `You can add up to ${MAX_PHOTOS} photos`),
    video: z.string().regex(VIDEO_URL, 'Invalid video').nullable(),
    variants: z.array(variantInput).max(10, 'You can add up to 10 sizes'),
    notes: z.object({ top: tags('Top notes'), heart: tags('Heart notes'), base: tags('Base notes') }),
    longevity: text(40),
    sillage: text(40),
    seasons: tags('Seasons'),
    occasions: tags('Occasions'),
    badge: z.enum(BADGES).nullable(),
    bestseller: z.boolean(),
    featured: z.boolean(),
    published: z.boolean(),
    releasedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Pick a date'),
    seoTitle: text(70),
    seoDescription: text(160),
  })
  .superRefine((p, ctx) => {
    const ids = new Set<string>();
    const sizes = new Set<string>();
    p.variants.forEach((v, i) => {
      const size = v.size.toLowerCase().replace(/\s+/g, '');
      if (ids.has(v.id) || sizes.has(size)) {
        ctx.addIssue({ code: 'custom', path: ['variants', i, 'size'], message: 'Two sizes have the same name' });
      }
      ids.add(v.id);
      sizes.add(size);
      if (v.mrp > 0 && v.mrp < v.price) {
        ctx.addIssue({ code: 'custom', path: ['variants', i, 'mrp'], message: 'MRP can’t be lower than the price' });
      }
    });
    if (p.published && p.variants.length === 0) {
      ctx.addIssue({ code: 'custom', path: ['variants'], message: 'Add at least one size before making the product active' });
    }
    if (p.published && p.images.length === 0) {
      ctx.addIssue({ code: 'custom', path: ['images'], message: 'Add at least one photo before making the product active' });
    }
  });

export type ProductInput = z.infer<typeof productInput>;

/** Database columns for a validated product. */
export function toProductData(p: ProductInput) {
  return {
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    description: p.description,
    gender: p.gender,
    category: p.category,
    concentration: p.concentration,
    images: p.images,
    video: p.video,
    // An empty MRP means "no discount": store it equal to the price.
    variants: p.variants.map((v) => ({ id: v.id, size: v.size, price: v.price, mrp: v.mrp > v.price ? v.mrp : v.price, inStock: v.inStock })),
    notes: p.notes,
    longevity: p.longevity,
    sillage: p.sillage,
    seasons: p.seasons,
    occasions: p.occasions,
    badge: p.badge,
    bestseller: p.bestseller,
    featured: p.featured,
    published: p.published,
    releasedAt: new Date(`${p.releasedAt}T00:00:00.000Z`),
    seoTitle: p.seoTitle || null,
    seoDescription: p.seoDescription || null,
  };
}

/** The form values for an existing product. */
export function productToInput(p: Product): ProductInput {
  return {
    name: p.name,
    slug: p.slug,
    tagline: p.tagline,
    description: p.description,
    gender: p.gender,
    category: p.category,
    concentration: p.concentration,
    images: p.images,
    video: p.video ?? null,
    variants: p.variants.map((v) => ({ ...v })),
    notes: { top: [...p.notes.top], heart: [...p.notes.heart], base: [...p.notes.base] },
    longevity: p.longevity,
    sillage: p.sillage,
    seasons: [...p.seasons],
    occasions: [...p.occasions],
    badge: p.badge ?? null,
    bestseller: !!p.bestseller,
    featured: !!p.featured,
    published: p.published !== false,
    releasedAt: p.releasedAt,
    seoTitle: p.seoTitle ?? '',
    seoDescription: p.seoDescription ?? '',
  };
}
