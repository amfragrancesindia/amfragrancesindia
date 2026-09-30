import { ButtonLink } from '@/components/ui/Button';

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[640px] items-end overflow-hidden bg-[#0B0705] text-white h-[100svh] max-h-[980px] md:min-h-[600px]">
      {/* Art-directed <picture>: wide artwork on landscape screens from tablet size up, tall artwork
          on phones and portrait tablets. Only the image for the current viewport is downloaded.
          (Images are served unoptimised, so the sources are listed directly.) */}
      <picture>
        <source media="(min-width: 768px) and (min-aspect-ratio: 1/1)" srcSet="/images/am/banners/hero.webp" width={2400} height={1260} />
        {/* eslint-disable-next-line @next/next/no-img-element -- art direction needs a plain <picture> */}
        <img
          src="/images/am/banners/hero-mobile.webp"
          width={1080}
          height={1440}
          alt="Saffron Royale eau de parfum standing in a glowing Mughal archway"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 -z-10 h-full w-full object-cover object-[50%_40%] md:object-[55%_50%] xl:object-[70%_50%]"
        />
      </picture>
      <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-black/50 to-transparent" aria-hidden />

      <div className="container-x pb-9 md:pb-24 lg:pb-28">
        <div className="max-w-xl animate-fade-up">
          <p className="text-[12px] font-semibold uppercase tracking-[0.3em] text-gold-soft">Eau de Parfum · Crafted in India</p>
          <h1 className="mt-4 text-[44px] font-light leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            The Art of
            <br />
            <span className="font-script text-[1.3em] font-normal leading-[0.9] text-gold-soft">Indian</span> Luxury
          </h1>
          <p className="mt-5 max-w-md text-[16px] leading-relaxed text-white/75 sm:text-[17px]">
            Long-lasting perfumes and attars inspired by saffron, oud, rose and sandalwood — made for the moments you want to be
            remembered.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/products" variant="light" size="lg">
              Shop the Collection
            </ButtonLink>
            <ButtonLink href="/products/saffron-royale" variant="outline-light" size="lg">
              Discover Saffron Royale
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
