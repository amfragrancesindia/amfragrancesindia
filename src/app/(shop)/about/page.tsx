import type { Metadata } from 'next';
import Image from 'next/image';
import { Feather, Flower2, Gem, HandHeart } from 'lucide-react';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ButtonLink } from '@/components/ui/Button';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getBestsellers } from '@/lib/catalog';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'AM Fragrances creates luxury perfumes, attars and oils inspired by India’s perfumery heritage — saffron, oud, rose and sandalwood, crafted to last.',
  alternates: { canonical: '/about' },
};

const values = [
  { Icon: Flower2, title: 'Heritage ingredients', text: 'Saffron, oud, rose, jasmine and sandalwood — the treasured materials of Indian perfumery sit at the heart of every blend.' },
  { Icon: Gem, title: 'Crafted to last', text: 'Rich eau de parfum and attar concentrations, balanced to wear beautifully in the Indian climate from morning to night.' },
  { Icon: Feather, title: 'Modern elegance', text: 'Traditional craft meets contemporary composition, so each fragrance feels both familiar and new.' },
  { Icon: HandHeart, title: 'Honest luxury', text: 'Clear MRP pricing inclusive of all taxes, secure checkout, cash on delivery and easy returns on sealed products.' },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-[#140D08] text-white">
        <Image
          src="/images/am/banners/attar-collection.webp"
          alt="AM Fragrances attars and perfume oils"
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/50 to-black/10" aria-hidden />
        <div className="container-x py-14 sm:py-24">
          <Breadcrumbs items={[{ name: 'About' }]} className="text-white/70 [&_a:hover]:text-white [&_span]:text-white/90" />
          <p className="mt-10 text-[12px] font-semibold uppercase tracking-[0.3em] text-gold-soft">Our Story</p>
          <h1 className="mt-4 max-w-2xl font-display text-5xl font-normal leading-[1.02] sm:text-7xl">The art of Indian fragrance, reimagined</h1>
          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-white/80">
            AM Fragrances was born from a love of India’s perfumery heritage — the rose distilleries of Kannauj, the saffron fields of
            Kashmir and the sandalwood forests of the south — and a desire to bring that richness to modern, long-lasting perfumes.
          </p>
        </div>
      </section>

      <section className="container-x grid grid-cols-1 gap-12 py-16 sm:py-24 lg:grid-cols-2 lg:items-center">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream">
          <Image src="/images/am/products/saffron-royale-2.webp" alt="Saffron Royale with its presentation box" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
        <div>
          <p className="eyebrow">Who we are</p>
          <h2 className="mt-3 font-display text-4xl font-medium leading-tight sm:text-5xl">Rooted in tradition, made for today</h2>
          <div className="prose-am mt-6">
            <p>
              Every AM fragrance begins with a memory — festive evenings scented with jasmine, the warmth of saffron in a winter kitchen,
              the quiet smoke of oud at a celebration. We translate those moments into compositions that feel personal and refined.
            </p>
            <p>
              Our collection spans signature eaux de parfum, alcohol-free attars and soothing perfume oils. Each is blended to perform
              beautifully in the Indian climate and to leave a trail that is noticed, remembered and loved.
            </p>
            <p>
              We believe luxury should also feel effortless: transparent pricing, careful packaging, cash on delivery and a team that is
              always happy to help you find your signature scent.
            </p>
          </div>
          <ButtonLink href="/products" size="lg" className="mt-8">
            Explore the collection
          </ButtonLink>
        </div>
      </section>

      <section className="bg-cream">
        <div className="container-x py-16 sm:py-20">
          <p className="eyebrow text-center">What we stand for</p>
          <h2 className="mt-3 text-center font-display text-4xl font-medium sm:text-5xl">Our values</h2>
          <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ Icon, title, text }) => (
              <li key={title} className="rounded-2xl bg-white p-7">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-cream text-brand">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink/70">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-x py-16 sm:py-24">
        <SectionHeading title="Customer Favourites" action={{ href: '/products', label: 'Shop all' }} />
        <ProductGrid products={getBestsellers(4)} className="mt-8" />
      </section>
    </>
  );
}
