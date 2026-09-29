import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';

const tiles = [
  {
    href: '/products?gender=men',
    label: 'Men',
    title: 'Discover Top Perfumes for Men',
    image: '/images/am/banners/men.webp',
    alt: 'Midnight Oud and Wood & Smoke on a dark slate surface',
  },
  {
    href: '/products?gender=women',
    label: 'Women',
    title: 'Discover Top Perfumes for Women',
    image: '/images/am/banners/women.webp',
    alt: 'Jashn eau de parfum and Rose Gulab attar with rose petals',
  },
];

const more = [
  { href: '/products?gender=unisex', label: 'Unisex' },
  { href: '/products?category=attars-oils', label: 'Attars & Oils' },
  { href: '/products?category=gift-set', label: 'Gift Sets' },
];

export function Discover() {
  return (
    <section className="container-x pt-16 sm:pt-24">
      <SectionHeading title="Discover" />
      <div className="mt-8 grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
        {tiles.map((t) => (
          <Link key={t.href} href={t.href} className="group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-ink">
            <Image
              src={t.image}
              alt={t.alt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition duration-700 ease-out group-hover:scale-[1.04] lg:grayscale lg:group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" aria-hidden />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-white sm:p-8">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.3em] text-white/75">{t.label}</p>
                <p className="mt-2 text-xl font-medium sm:text-2xl">{t.title}</p>
              </div>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-ink transition group-hover:bg-gold-soft">
                <ArrowRight className="h-5 w-5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 sm:gap-4">
        {more.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="group flex items-center justify-between gap-2 rounded-2xl border border-line bg-cream px-4 py-4 text-[15px] font-medium transition hover:border-brand-light sm:px-6 sm:py-5 sm:text-lg"
          >
            {m.label}
            <ArrowRight className="hidden h-4 w-4 text-brand transition group-hover:translate-x-1 sm:block" aria-hidden />
          </Link>
        ))}
      </div>
    </section>
  );
}
