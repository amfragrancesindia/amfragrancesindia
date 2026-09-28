import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductDetails } from '@/components/product/ProductDetails';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductGrid } from '@/components/product/ProductGrid';
import { PurchasePanel } from '@/components/product/PurchasePanel';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { GENDER_LABELS, getProduct, getRelatedProducts, isInStock, products } from '@/lib/catalog';
import { site } from '@/lib/site';
import { absoluteUrl } from '@/lib/utils';

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) return {};
  const title = `${product.name} ${product.concentration}`;
  const description = `${product.tagline}. ${product.description}`.slice(0, 158);
  return {
    title,
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
  const product = getProduct((await params).slug);
  if (!product) notFound();
  const related = getRelatedProducts(product, 4);
  const prices = product.variants.map((v) => v.price);

  const jsonLd = {
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
      <div className="container-x pb-16 pt-6 sm:pt-8">
        <Breadcrumbs
          items={[
            { name: 'Products', href: '/products' },
            { name: GENDER_LABELS[product.gender], href: `/products?gender=${product.gender}` },
            { name: product.name },
          ]}
        />
        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={product.images} name={product.name} badge={product.badge} />
          <div>
            <PurchasePanel product={product} />
            <div className="mt-10">
              <ProductDetails product={product} />
            </div>
          </div>
        </div>
      </div>

      <section className="container-x pb-20">
        <SectionHeading title="You May Also Like" action={{ href: '/products', label: 'View all' }} />
        <ProductGrid products={related} className="mt-8" />
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
