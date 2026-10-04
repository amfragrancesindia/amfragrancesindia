import { ButtonLink } from '@/components/ui/Button';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { site } from '@/lib/site';

/** The brand line from the boxes, with a way into the shop and a way to ask a question. */
export function BrandStatement() {
  return (
    <section className="container-x pt-16 sm:pt-24">
      <div className="rounded-2xl bg-cream px-6 py-14 text-center sm:px-12 sm:py-20">
        <p className="eyebrow">{site.name}</p>
        <h2 className="mx-auto mt-3 max-w-2xl font-display text-4xl font-medium leading-tight text-ink sm:text-5xl">{site.tagline}</h2>
        <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-ink/70">
          Every AM Fragrances eau de parfum is crafted in India with a rich concentration of fine perfume oils, so it stays with you from
          morning to night. Each comes in a 100 ml flacon with its own gift box.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/products" variant="dark" size="lg">
            Shop the Collection
          </ButtonLink>
          <a
            href={site.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-[52px] items-center justify-center gap-2 rounded-lg border border-ink/70 bg-white px-8 text-base font-medium text-ink transition-all duration-300 hover:border-ink hover:bg-ink hover:text-white"
          >
            <WhatsAppIcon className="h-5 w-5" /> Ask us on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
