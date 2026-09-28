import Image from 'next/image';
import { ButtonLink } from '@/components/ui/Button';

export function SignatureBanner() {
  return (
    <section className="pt-16 sm:pt-24">
      <div className="relative isolate overflow-hidden bg-[#1B0709] text-white">
        <Image
          src="/images/am/banners/signature.webp"
          alt="Imperial Oud on a velvet plinth under a gold arch"
          fill
          sizes="100vw"
          className="-z-10 object-cover object-[75%_50%]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/70 via-black/30 to-transparent md:from-black/40" aria-hidden />
        <div className="container-x flex min-h-[560px] items-end py-14 md:min-h-[600px] md:items-center">
          <div className="max-w-lg">
            <p className="text-[12px] font-semibold uppercase tracking-[0.3em] text-gold-soft">Limited Edition</p>
            <h2 className="mt-4 font-display text-[52px] font-normal leading-[0.95] sm:text-7xl lg:text-[86px]">
              The Imperial
              <br />
              Signature
            </h2>
            <p className="mt-5 max-w-sm text-[16px] leading-relaxed text-white/75">
              Aged Indian oud, vintage rose and precious iris — our most exclusive creation, released in small batches.
            </p>
            <ButtonLink href="/products/imperial-oud" variant="light" size="lg" className="mt-8">
              Discover Imperial Oud
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
