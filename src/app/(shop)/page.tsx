import { Discover } from '@/components/home/Discover';
import { FeaturedProduct } from '@/components/home/FeaturedProduct';
import { HeritageStory } from '@/components/home/HeritageStory';
import { Hero } from '@/components/home/Hero';
import { Promises } from '@/components/home/Promises';
import { SignatureBanner } from '@/components/home/SignatureBanner';
import { ProductGrid } from '@/components/product/ProductGrid';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getBestsellers, getFeaturedProduct, getNewArrivals } from '@/lib/catalog';
import { site } from '@/lib/site';
import { absoluteUrl } from '@/lib/utils';

export default function HomePage() {
  const featured = getFeaturedProduct();
  const bestsellers = getBestsellers(8).filter((p) => p.slug !== featured.slug).slice(0, 4);
  // Don't repeat products already shown above.
  const shown = new Set([featured.slug, ...bestsellers.map((p) => p.slug)]);
  const newArrivals = getNewArrivals(12).filter((p) => !shown.has(p.slug)).slice(0, 4);

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.legalName,
    url: site.url,
    logo: absoluteUrl('/icon.png'),
    email: site.email,
    telephone: site.phone,
    sameAs: [site.social.instagram],
  };

  return (
    <>
      <Hero />
      <FeaturedProduct product={featured} />

      <section className="container-x pt-16 sm:pt-24">
        <SectionHeading title="Bestsellers" action={{ href: '/products', label: 'View all' }} />
        <ProductGrid products={bestsellers} className="mt-8" />
      </section>

      <Discover />
      <SignatureBanner />

      <section className="container-x pt-16 sm:pt-24">
        <SectionHeading title="New Arrivals" action={{ href: '/products?sort=newest', label: 'View all' }} />
        <ProductGrid products={newArrivals} className="mt-8" />
      </section>

      <HeritageStory />
      <Promises />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
    </>
  );
}
