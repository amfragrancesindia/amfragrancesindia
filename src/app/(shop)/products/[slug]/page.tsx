import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EyeOff } from 'lucide-react';
import { ProductDetails } from '@/components/product/ProductDetails';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductGrid } from '@/components/product/ProductGrid';
import { PurchasePanel } from '@/components/product/PurchasePanel';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getSessionUser, isAdmin } from '@/lib/auth';
import { GENDER_LABELS, getRelatedProducts, isInStock } from '@/lib/catalog';
import { getProductPage, getStoreProducts } from '@/lib/products';
import { site } from '@/lib/site';
import { absoluteUrl } from '@/lib/utils';

type Params = Promise<{ slug: string }>;

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const product = await getProductPage((await params).slug);
  if (!product) return {};
  const title = product.seoTitle || `${product.name} ${product.concentration}`.trim();
  const description = (product.seoDescription || `${product.tagline}. ${product.description}`).slice(0, 158);
  return {
    // A custom SEO title is used exactly as written; otherwise the site-wide template applies.
    title: product.seoTitle ? { absolute: product.seoTitle } : title,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url: `/products/${product.slug}`,
      images: [{ url: product.images[0], width: 1200, height: 1200, alt: product.name }],
    },
    twitter: { card: 'summary_large_image', images: [product.images[0]] },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  let product = await getProductPage(slug);
  let preview = false;
  if (!product) {
    // Admins can open drafts to preview them before publishing.
    const user = await getSessionUser();
    if (isAdmin(user)) {
      product = await getProductPage(slug, { includeDrafts: true });
      preview = true;
    }
  }
  if (!product) notFound();
  const sellable = product.variants.length > 0 && product.images.length > 0;
  const related = getRelatedProducts(await getStoreProducts(), product, 4);
  const prices = product.variants.map((v) => v.price);

  const jsonLd = sellable && {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images.map((src) => absoluteUrl(src)),
    sku: product.slug,
    brand: { '@type': 'Brand', name: site.name },
    category: product.concentration,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      offerCount: product.variants.length,
      availability: isInStock(product) ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: absoluteUrl(`/products/${product.slug}`),
    },
  };

  return (
    <>
      {preview && (
        <div className="border-b border-gold/30 bg-gold-soft/40">
          <p className="container-x flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5 text-sm text-ink/80">
            <EyeOff className="h-4 w-4 shrink-0 text-brand" />
            <span>
              <strong>Draft preview.</strong> Customers can’t see this product until it’s published
              {!sellable && ' and has at least one photo and one size'}.
            </span>
            {product.id && (
              <Link href={`/admin/products/${product.id}`} className="font-semibold text-brand underline underline-offset-4">
                Edit product
              </Link>
            )}
          </p>
        </div>
      )}
      <div className="container-x pb-16 pt-6 sm:pt-8">
        <Breadcrumbs
          items={[
            { name: 'Products', href: '/products' },
            { name: GENDER_LABELS[product.gender], href: `/products?gender=${product.gender}` },
            { name: product.name },
          ]}
        />
        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {product.images.length > 0 ? (
            <ProductGallery images={product.images} name={product.name} badge={product.badge} />
          ) : (
            <div className="grid aspect-square place-items-center rounded-2xl bg-cream text-muted">No photos yet</div>
          )}
          <div>
            {product.variants.length > 0 ? (
              <PurchasePanel product={product} />
            ) : (
              <h1 className="text-[32px] font-medium tracking-tight text-navy">{product.name}</h1>
            )}
            <div className="mt-10">
              <ProductDetails product={product} />
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="container-x pb-20">
          <SectionHeading title="You May Also Like" action={{ href: '/products', label: 'View all' }} />
          <ProductGrid products={related} className="mt-8" />
        </section>
      )}

      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
    </>
  );
}
