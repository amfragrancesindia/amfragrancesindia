import Image from 'next/image';
import { ButtonLink } from '@/components/ui/Button';

export function HeritageStory() {
  return (
    <section className="container-x pt-16 sm:pt-24">
      <div className="grid grid-cols-1 items-center gap-8 overflow-hidden rounded-2xl bg-cream md:grid-cols-2 md:gap-0">
        <div className="relative aspect-[6/5] md:aspect-auto md:h-full md:min-h-[480px]">
          <Image
            src="/images/am/banners/attar-collection.webp"
            alt="Royal Amber and Rose Gulab attars with Champa Lavender perfume oil"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="px-6 pb-10 sm:px-10 md:py-14 lg:px-16">
          <p className="eyebrow">The Heritage Collection</p>
          <h2 className="mt-3 font-display text-4xl font-medium leading-tight text-ink sm:text-5xl">
            Attars from India’s perfume capital
          </h2>
          <p className="mt-5 text-[16px] leading-relaxed text-ink/70">
            For centuries, the perfumers of Kannauj have distilled roses, amber and sandalwood into precious oils. Our attars follow
            the same slow, traditional craft — alcohol-free, deeply concentrated and made to be worn close to the skin.
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-3 text-[14px] text-ink/80">
            <li className="rounded-xl bg-white px-4 py-3">Alcohol-free</li>
            <li className="rounded-xl bg-white px-4 py-3">Traditionally distilled</li>
            <li className="rounded-xl bg-white px-4 py-3">One drop lasts hours</li>
            <li className="rounded-xl bg-white px-4 py-3">Gentle on skin</li>
          </ul>
          <ButtonLink href="/products?category=attars-oils" variant="dark" size="lg" className="mt-8">
            Shop Attars &amp; Oils
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
