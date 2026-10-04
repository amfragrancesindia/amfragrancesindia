'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ArrowLeft, ExternalLink, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Field, Input, Select, Textarea } from '@/components/ui/Field';
import {
  BADGES,
  CATEGORIES,
  CATEGORY_LABELS,
  GENDERS,
  GENDER_LABELS,
  slugify,
  variantKey,
  type Badge,
  type Category,
  type Gender,
  type Product,
} from '@/lib/catalog';
import { MAX_PHOTOS, productInput, type ProductInput } from '@/lib/product-input';
import { site } from '@/lib/site';
import { cn, formatDate } from '@/lib/utils';
import { fieldErrors } from '@/lib/validations';
import { ConfirmDialog } from './ConfirmDialog';
import { ImageManager } from './ImageManager';
import { TagInput } from './TagInput';
import { VariantsEditor, newVariantDraft, parseRupees, type VariantDraft } from './VariantsEditor';
import { VideoManager } from './VideoManager';

interface Draft {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  gender: Gender;
  category: Category;
  concentration: string;
  images: string[];
  video: string | null;
  variants: VariantDraft[];
  notes: { top: string[]; heart: string[]; base: string[] };
  longevity: string;
  sillage: string;
  seasons: string[];
  occasions: string[];
  badge: Badge | '';
  bestseller: boolean;
  featured: boolean;
  published: boolean;
  releasedAt: string;
  seoTitle: string;
  seoDescription: string;
}

const CONCENTRATIONS = ['Eau de Parfum', 'Extrait de Parfum', 'Eau de Toilette', 'Attar', 'Perfume Oil', 'Gift Set'];
const LONGEVITY = ['4–6 hours', '6–8 hours', '8–10 hours', '10–12 hours', '12+ hours'];
const SILLAGE = ['Intimate', 'Moderate', 'Strong', 'Enormous'];

function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function toDraft(p?: Product): Draft {
  if (!p) {
    return {
      name: '',
      slug: '',
      tagline: '',
      description: '',
      gender: 'unisex',
      category: 'perfume',
      concentration: 'Eau de Parfum',
      images: [],
      video: null,
      variants: [newVariantDraft('100 ml')],
      notes: { top: [], heart: [], base: [] },
      longevity: '',
      sillage: '',
      seasons: [],
      occasions: [],
      badge: '',
      bestseller: false,
      featured: false,
      published: true,
      releasedAt: today(),
      seoTitle: '',
      seoDescription: '',
    };
  }
  return {
    name: p.name,
    slug: p.slug,
    tagline: p.tagline,
    description: p.description,
    gender: p.gender,
    category: p.category,
    concentration: p.concentration,
    images: [...p.images],
    video: p.video ?? null,
    variants: p.variants.map((v) => ({
      key: v.id,
      id: v.id,
      size: v.size,
      price: String(v.price),
      mrp: v.mrp > v.price ? String(v.mrp) : '',
      inStock: v.inStock,
    })),
    notes: { top: [...p.notes.top], heart: [...p.notes.heart], base: [...p.notes.base] },
    longevity: p.longevity,
    sillage: p.sillage,
    seasons: [...p.seasons],
    occasions: [...p.occasions],
    badge: p.badge ?? '',
    bestseller: !!p.bestseller,
    featured: !!p.featured,
    published: p.published !== false,
    releasedAt: p.releasedAt,
    seoTitle: p.seoTitle ?? '',
    seoDescription: p.seoDescription ?? '',
  };
}

/** Form values → what the API expects (new sizes get their stable id here). */
function toInput(d: Draft): ProductInput {
  const used = new Set(d.variants.map((v) => v.id).filter(Boolean));
  const variants = d.variants.map((v) => {
    let id = v.id;
    if (!id) {
      const base = variantKey(v.size);
      id = base;
      for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
      used.add(id);
    }
    const mrp = parseRupees(v.mrp);
    return { id, size: v.size.trim(), price: parseRupees(v.price), mrp: Number.isNaN(mrp) ? 0 : mrp, inStock: v.inStock };
  });
  return {
    name: d.name.trim(),
    slug: d.slug.trim().toLowerCase(),
    tagline: d.tagline.trim(),
    description: d.description.trim(),
    gender: d.gender,
    category: d.category,
    concentration: d.concentration.trim(),
    images: d.images,
    video: d.video,
    variants,
    notes: d.notes,
    longevity: d.longevity.trim(),
    sillage: d.sillage.trim(),
    seasons: d.seasons,
    occasions: d.occasions,
    badge: d.badge || null,
    bestseller: d.bestseller,
    featured: d.featured,
    published: d.published,
    releasedAt: d.releasedAt,
    seoTitle: d.seoTitle.trim(),
    seoDescription: d.seoDescription.trim(),
  };
}

/** Which card an error belongs to, so the page can scroll to it. */
function sectionFor(key: string) {
  if (key === 'images') return 'photos';
  if (key === 'video') return 'video';
  if (key.startsWith('variants')) return 'sizes';
  if (['notes', 'longevity', 'sillage', 'seasons', 'occasions'].some((k) => key.startsWith(k))) return 'profile';
  if (key.startsWith('seo')) return 'seo';
  if (['name', 'tagline', 'description', 'slug'].includes(key)) return 'details';
  return 'organization';
}

function Card({ id, title, description, children }: { id?: string; title: string; description?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 rounded-2xl border border-line bg-white p-5 sm:p-6">
      <header className="mb-5">
        <h2 className="text-[17px] font-semibold text-ink">{title}</h2>
        {description && <p className="mt-1 text-[13.5px] text-muted">{description}</p>}
      </header>
      {children}
    </section>
  );
}

function Switch({ checked, onChange, label, hint }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <div>
        <p className="text-[14.5px] font-medium text-ink">{label}</p>
        {hint && <p className="mt-0.5 text-[12.5px] leading-snug text-muted">{hint}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn('relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition', checked ? 'bg-brand-light' : 'bg-line')}
      >
        <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all', checked ? 'left-[22px]' : 'left-0.5')} />
      </button>
    </div>
  );
}

function Counter({ value, max }: { value: string; max: number }) {
  return <span className={cn('text-xs tabular-nums', value.length > max ? 'text-danger' : 'text-muted')}>{value.length}/{max}</span>;
}

export function ProductEditor({ product }: { product?: Product }) {
  const router = useRouter();
  const isNew = !product?.id;
  const [draft, setDraft] = useState<Draft>(() => toDraft(product));
  const [baseline, setBaseline] = useState(() => JSON.stringify(draft));
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const savingRef = useRef(false);

  const dirty = useMemo(() => JSON.stringify(draft) !== baseline, [draft, baseline]);
  const set = useCallback(<K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((d) => ({ ...d, [key]: value })), []);
  const setImages = useCallback((update: (prev: string[]) => string[]) => setDraft((d) => ({ ...d, images: update(d.images) })), []);

  const onName = (name: string) =>
    setDraft((d) => ({ ...d, name, slug: slugTouched ? d.slug : slugify(name) }));

  const save = useCallback(async () => {
    if (savingRef.current) return;
    const input = toInput(draft);
    const check = productInput.safeParse(input);
    if (!check.success) {
      const found = fieldErrors(check.error);
      setErrors(found);
      toast.error('Please fix the highlighted fields.');
      document.getElementById(sectionFor(Object.keys(found)[0] ?? ''))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    savingRef.current = true;
    setSaving(true);
    setErrors({});
    try {
      const res = await fetch(isNew ? '/api/admin/products' : `/api/admin/products/${product!.id}`, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(check.data),
      });
      const data = (await res.json().catch(() => ({}))) as { product?: { id: string }; error?: string; fields?: Record<string, string> };
      if (!res.ok || !data.product) {
        if (data.fields) {
          setErrors(data.fields);
          document.getElementById(sectionFor(Object.keys(data.fields)[0] ?? ''))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        throw new Error(data.error || 'The product could not be saved.');
      }
      // Keep the ids the new sizes were saved with, so the next save updates them.
      const saved: Draft = {
        ...draft,
        slug: check.data.slug,
        variants: draft.variants.map((v, i) => ({ ...v, id: check.data.variants[i].id })),
      };
      setDraft(saved);
      setBaseline(JSON.stringify(saved));
      setSlugTouched(true);
      toast.success(isNew ? 'Product created' : 'Changes saved');
      if (isNew) router.replace(`/admin/products/${data.product.id}`);
      else router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'The product could not be saved.');
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }, [draft, isNew, product, router]);

  // Ctrl/⌘ + S saves.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        void save();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [save]);

  // Warn before closing the tab with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  const remove = async () => {
    if (!product?.id) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, { method: 'DELETE' });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || 'The product could not be deleted.');
      setBaseline(JSON.stringify(draft));
      toast.success(`${product.name} deleted`);
      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'The product could not be deleted.');
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const leave = (e: React.MouseEvent) => {
    if (dirty && !window.confirm('You have unsaved changes. Leave without saving?')) e.preventDefault();
  };

  const storeHost = site.url.replace(/^https?:\/\//, '');
  const seoTitle = draft.seoTitle || `${draft.name || 'Product name'} ${draft.concentration}`.trim() + ` | ${site.name}`;
  const seoDescription = (draft.seoDescription || [draft.tagline, draft.description].filter(Boolean).join('. ') || 'Add a short description to show it here.').slice(0, 158);
  const slugChanged = !isNew && product && draft.slug !== product.slug;

  return (
    <div className="pb-16">
      {/* Action bar */}
      <div className="sticky top-0 z-30 -mx-4 mb-6 flex flex-wrap items-center gap-3 border-b border-line bg-cream/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:mx-0 lg:rounded-2xl lg:border lg:bg-white/95 lg:px-5 lg:shadow-soft">
        <Link
          href="/admin/products"
          onClick={leave}
          aria-label="Back to products"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line bg-white text-ink transition hover:bg-cream"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-semibold leading-tight">{isNew ? 'Add product' : draft.name || 'Untitled product'}</h1>
          <p className={cn('text-[12.5px]', dirty ? 'font-medium text-gold' : 'text-muted')}>
            {dirty ? 'Unsaved changes' : isNew ? 'New product' : `Saved${product?.updatedAt ? ` · ${formatDate(product.updatedAt)}` : ''}`}
          </p>
        </div>
        <span
          className={cn(
            'hidden rounded-full px-2.5 py-1 text-[12px] font-semibold sm:inline-block',
            draft.published ? 'bg-success/10 text-success' : 'bg-line text-ink/70',
          )}
        >
          {draft.published ? 'Active' : 'Draft'}
        </span>
        {!isNew && product && (
          <a
            href={`/products/${product.slug}`}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-brand transition hover:bg-cream md:inline-flex"
          >
            View in shop <ExternalLink className="h-4 w-4" />
          </a>
        )}
        {dirty && !isNew && (
          <Button variant="ghost" size="sm" onClick={() => setDraft(JSON.parse(baseline) as Draft)} disabled={saving}>
            Discard
          </Button>
        )}
        <Button size="sm" variant="dark" onClick={() => void save()} loading={saving} disabled={!isNew && !dirty}>
          {isNew ? 'Save product' : 'Save changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-6">
          <Card id="details" title="Details">
            <div className="space-y-5">
              <Field label="Product name" error={errors.name}>
                {(id, describedBy) => (
                  <Input id={id} aria-describedby={describedBy} value={draft.name} onChange={(e) => onName(e.target.value)} placeholder="e.g. Royal Oud" invalid={!!errors.name} />
                )}
              </Field>
              <Field label="Short description" optional error={errors.tagline} hint="One line under the name, e.g. “Smoky oud, saffron and warm amber”.">
                {(id, describedBy) => (
                  <Input id={id} aria-describedby={describedBy} value={draft.tagline} onChange={(e) => set('tagline', e.target.value)} invalid={!!errors.tagline} />
                )}
              </Field>
              <Field label="Description" optional error={errors.description}>
                {(id, describedBy) => (
                  <>
                    <Textarea
                      id={id}
                      aria-describedby={describedBy}
                      rows={6}
                      value={draft.description}
                      onChange={(e) => set('description', e.target.value)}
                      placeholder="Tell customers how the fragrance opens, what it feels like and when to wear it."
                      invalid={!!errors.description}
                    />
                    <div className="mt-1 text-right">
                      <Counter value={draft.description} max={4000} />
                    </div>
                  </>
                )}
              </Field>
            </div>
          </Card>

          <Card id="photos" title="Photos" description={`Upload clear photos of the bottle. You can add up to ${MAX_PHOTOS}.`}>
            <ImageManager images={draft.images} onChange={setImages} productName={draft.name} error={errors.images} />
          </Card>

          <Card id="video" title="Video" description="Optional: one short video of the product (up to 30 seconds).">
            <VideoManager video={draft.video} onChange={(v) => set('video', v)} error={errors.video} />
          </Card>

          <Card id="sizes" title="Sizes and prices" description="Each size can have its own price and stock status.">
            <VariantsEditor variants={draft.variants} onChange={(v) => set('variants', v)} errors={errors} />
          </Card>

          <Card id="profile" title="Ingredients & fragrance profile" description="The ingredients customers smell first (top), at the heart, and as it dries down (base), shown on the product page. Press Enter after each one.">
            <div className="grid grid-cols-1 gap-5">
              {(['top', 'heart', 'base'] as const).map((layer) => (
                <Field key={layer} label={`${layer === 'top' ? 'Top' : layer === 'heart' ? 'Heart' : 'Base'} notes (ingredients)`} optional error={errors[`notes.${layer}`]}>
                  {(id, describedBy) => (
                    <TagInput
                      id={id}
                      describedBy={describedBy}
                      value={draft.notes[layer]}
                      onChange={(v) => set('notes', { ...draft.notes, [layer]: v })}
                      placeholder={layer === 'top' ? 'e.g. Saffron, Bergamot' : layer === 'heart' ? 'e.g. Rose, Jasmine' : 'e.g. Sandalwood, Amber'}
                      invalid={!!errors[`notes.${layer}`]}
                    />
                  )}
                </Field>
              ))}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Longevity" optional error={errors.longevity}>
                  {(id, describedBy) => (
                    <>
                      <Input id={id} aria-describedby={describedBy} list="longevity-options" value={draft.longevity} onChange={(e) => set('longevity', e.target.value)} placeholder="e.g. 8–10 hours" />
                      <datalist id="longevity-options">
                        {LONGEVITY.map((o) => (
                          <option key={o} value={o} />
                        ))}
                      </datalist>
                    </>
                  )}
                </Field>
                <Field label="Projection (sillage)" optional error={errors.sillage}>
                  {(id, describedBy) => (
                    <>
                      <Input id={id} aria-describedby={describedBy} list="sillage-options" value={draft.sillage} onChange={(e) => set('sillage', e.target.value)} placeholder="e.g. Strong" />
                      <datalist id="sillage-options">
                        {SILLAGE.map((o) => (
                          <option key={o} value={o} />
                        ))}
                      </datalist>
                    </>
                  )}
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Best seasons" optional error={errors.seasons}>
                  {(id, describedBy) => (
                    <TagInput id={id} describedBy={describedBy} value={draft.seasons} onChange={(v) => set('seasons', v)} placeholder="e.g. Winter, Autumn" />
                  )}
                </Field>
                <Field label="Occasions" optional error={errors.occasions}>
                  {(id, describedBy) => (
                    <TagInput id={id} describedBy={describedBy} value={draft.occasions} onChange={(v) => set('occasions', v)} placeholder="e.g. Weddings, Evening" />
                  )}
                </Field>
              </div>
            </div>
          </Card>

          <Card id="seo" title="Search engine listing" description="How this product can appear on Google. Leave empty to use the name and description.">
            <div className="rounded-xl border border-line bg-cream/40 p-4">
              <p className="truncate text-[13px] text-ink/60">
                {storeHost} › products › {draft.slug || 'product-address'}
              </p>
              <p className="mt-1 truncate text-[18px] leading-snug text-[#1a0dab]">{seoTitle}</p>
              <p className="mt-1 line-clamp-2 text-[13.5px] text-ink/70">{seoDescription}</p>
            </div>
            <div className="mt-5 space-y-5">
              <Field label="Page title" optional error={errors.seoTitle}>
                {(id, describedBy) => (
                  <>
                    <Input id={id} aria-describedby={describedBy} value={draft.seoTitle} onChange={(e) => set('seoTitle', e.target.value)} placeholder={seoTitle} invalid={!!errors.seoTitle} />
                    <div className="mt-1 text-right">
                      <Counter value={draft.seoTitle} max={70} />
                    </div>
                  </>
                )}
              </Field>
              <Field label="Meta description" optional error={errors.seoDescription}>
                {(id, describedBy) => (
                  <>
                    <Textarea
                      id={id}
                      aria-describedby={describedBy}
                      rows={3}
                      className="min-h-[96px]"
                      value={draft.seoDescription}
                      onChange={(e) => set('seoDescription', e.target.value)}
                      invalid={!!errors.seoDescription}
                    />
                    <div className="mt-1 text-right">
                      <Counter value={draft.seoDescription} max={160} />
                    </div>
                  </>
                )}
              </Field>
            </div>
          </Card>
        </div>

        <aside className="min-w-0 space-y-6">
          <Card id="status" title="Status">
            <Select
              aria-label="Status"
              value={draft.published ? 'active' : 'draft'}
              onChange={(e) => set('published', e.target.value === 'active')}
            >
              <option value="active">Active — shown in the shop</option>
              <option value="draft">Draft — hidden from customers</option>
            </Select>
            <p className="mt-2 text-[12.5px] text-muted">
              {draft.published ? 'Customers can find and buy this product.' : 'Only admins can see this product (use “View in shop” to preview it).'}
            </p>
          </Card>

          <Card id="organization" title="Organisation">
            <div className="space-y-5">
              <Field label="Collection" error={errors.category}>
                {(id) => (
                  <Select id={id} value={draft.category} onChange={(e) => set('category', e.target.value as Category)}>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {CATEGORY_LABELS[c]}
                      </option>
                    ))}
                  </Select>
                )}
              </Field>
              <Field label="For" error={errors.gender}>
                {(id) => (
                  <Select id={id} value={draft.gender} onChange={(e) => set('gender', e.target.value as Gender)}>
                    {GENDERS.map((g) => (
                      <option key={g} value={g}>
                        {GENDER_LABELS[g]}
                      </option>
                    ))}
                  </Select>
                )}
              </Field>
              <Field label="Type" optional error={errors.concentration} hint="Shown next to the size, e.g. “50 ml · Eau de Parfum”.">
                {(id, describedBy) => (
                  <>
                    <Input id={id} aria-describedby={describedBy} list="concentration-options" value={draft.concentration} onChange={(e) => set('concentration', e.target.value)} />
                    <datalist id="concentration-options">
                      {CONCENTRATIONS.map((o) => (
                        <option key={o} value={o} />
                      ))}
                    </datalist>
                  </>
                )}
              </Field>
            </div>
          </Card>

          <Card id="highlights" title="Highlights">
            <Field label="Label on the photo" optional error={errors.badge}>
              {(id) => (
                <Select id={id} value={draft.badge} onChange={(e) => set('badge', e.target.value as Badge | '')}>
                  <option value="">None</option>
                  {BADGES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
            <div className="mt-3 divide-y divide-line">
              <Switch
                checked={draft.bestseller}
                onChange={(v) => set('bestseller', v)}
                label="Bestseller"
                hint="Listed first in the shop’s “Featured” sorting."
              />
              <Switch
                checked={draft.featured}
                onChange={(v) => set('featured', v)}
                label="Feature on the home page"
                hint="The large “Featured” product on the home page. Only one product can be featured."
              />
            </div>
            <Field label="Release date" className="mt-4" error={errors.releasedAt} hint="Used for “Newest” sorting.">
              {(id, describedBy) => (
                <Input id={id} aria-describedby={describedBy} type="date" value={draft.releasedAt} onChange={(e) => set('releasedAt', e.target.value)} invalid={!!errors.releasedAt} />
              )}
            </Field>
          </Card>

          <Card id="address" title="Page address">
            <Field label="Address (URL)" error={errors.slug}>
              {(id, describedBy) => (
                <div className="flex items-stretch overflow-hidden rounded-xl border border-line bg-white focus-within:border-brand-light focus-within:ring-4 focus-within:ring-brand/10">
                  <span className="flex items-center border-r border-line bg-cream px-3 text-[13.5px] text-muted">/products/</span>
                  <input
                    id={id}
                    aria-describedby={describedBy}
                    value={draft.slug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      set('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'));
                    }}
                    aria-invalid={!!errors.slug || undefined}
                    className="min-w-0 flex-1 bg-transparent px-3 py-3 text-[15px] outline-none"
                  />
                </div>
              )}
            </Field>
            {slugChanged && (
              <p className="mt-2 rounded-lg bg-gold-soft/50 px-3 py-2 text-[12.5px] text-ink/80">
                Changing the address breaks links that were shared before. Customers’ saved carts for this product will be cleared.
              </p>
            )}
          </Card>

          {!isNew && product && (
            <Card title="Delete product">
              <p className="text-[13.5px] text-muted">
                Removes the product from the shop for good. Past orders keep their details. To hide it for a while, set the status to Draft
                instead.
              </p>
              <Button variant="outline" size="sm" className="mt-4 border-danger/40 text-danger hover:border-danger hover:bg-danger hover:text-white" onClick={() => setConfirmDelete(true)}>
                <Trash2 className="h-4 w-4" /> Delete product
              </Button>
            </Card>
          )}
        </aside>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title={`Delete ${product?.name ?? 'this product'}?`}
        confirmLabel="Delete product"
        busy={deleting}
        onConfirm={() => void remove()}
        onCancel={() => setConfirmDelete(false)}
      >
        This can’t be undone. The product will disappear from the shop, carts and wishlists. Past orders keep their details.
      </ConfirmDialog>
    </div>
  );
}
