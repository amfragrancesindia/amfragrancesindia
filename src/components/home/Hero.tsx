import { ButtonLink } from '@/components/ui/Button';
import { HeroFilm } from './HeroFilm';

// The poster and the film share one frame, so the film lines up with the poster exactly. Portrait
// tablets show the tall film cropped top and bottom, so it is anchored higher to keep the lifted cap in view.
const FRAME =
  'absolute inset-0 -z-10 h-full w-full object-cover object-[50%_40%] md:object-[60%_50%] xl:object-[70%_50%] md:portrait:object-[60%_10%]';

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[640px] items-end overflow-hidden bg-[#0B0705] text-white h-[100svh] max-h-[980px] md:min-h-[600px]">
      {/* Art-directed <picture>: the wide poster from tablet size up unless the window is clearly portrait
          (taller than 6:5), where the tall poster fits better. Only the image for the current viewport
          is downloaded. (Images are served unoptimised, so the sources are listed directly.) Each poster
          is the first frame of the matching film. */}
      <picture>
        <source media="(min-width: 768px) and (min-aspect-ratio: 5/6)" srcSet="/images/am/banners/hero-film.webp" width={1920} height={1080} />
        {/* eslint-disable-next-line @next/next/no-img-element -- art direction needs a plain <picture> */}
        <img
          src="/images/am/banners/hero-film-mobile.webp"
          width={1080}
          height={1920}
          alt="Saffron Royale eau de parfum standing in a glowing Mughal archway"
          fetchPriority="high"
          decoding="async"
          className={FRAME}
        />
      </picture>
      <HeroFilm className={FRAME} />
      <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-black/50 to-transparent" aria-hidden />
      {/* Keeps the copy readable over the mist and the floor reflection. */}
      <div className="absolute inset-x-0 bottom-0 -z-10 h-[62%] bg-gradient-to-t from-black/80 via-black/35 to-transparent md:h-1/2 md:from-black/50 md:via-black/15" aria-hidden />
      <div className="absolute inset-y-0 left-0 -z-10 hidden w-[65%] bg-gradient-to-r from-black/55 via-black/20 to-transparent md:block" aria-hidden />

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
