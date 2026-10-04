import { BrandStatement } from '@/components/home/BrandStatement';
import { FeaturedProduct } from '@/components/home/FeaturedProduct';
import { Hero } from '@/components/home/Hero';
import { Promises } from '@/components/home/Promises';
import { ProductGrid } from '@/components/product/ProductGrid';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getFeaturedProduct, queryProducts } from '@/lib/catalog';
import { getStoreProducts } from '@/lib/products';
import { site } from '@/lib/site';
import { absoluteUrl } from '@/lib/utils';

// Products come from the database, so the page always shows the latest catalogue.
export const dynamic = 'force-dynamic';

/** How many products the home page shows before "Shop all". */
const COLLECTION_SIZE = 10;

export default async function HomePage() {
  const products = await getStoreProducts();
  const featured = getFeaturedProduct(products);
  const collection = queryProducts(products, { sort: 'featured' }).slice(0, COLLECTION_SIZE);

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.legalName,
    url: site.url,
    logo: absoluteUrl('/icon.png'),
    email: site.email,
    sameAs: [site.social.instagram],
  };

  return (
    <>
      <Hero />

      {collection.length > 0 && (
        <section className="container-x pt-16 sm:pt-24">
          <SectionHeading title="The Collection" action={{ href: '/products', label: 'Shop all' }} />
          <ProductGrid products={collection} className="mt-8 lg:grid-cols-3 xl:grid-cols-5" />
        </section>
      )}

      {featured && <FeaturedProduct product={featured} />}
      <BrandStatement />
      <Promises />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
    </>
  );
}
