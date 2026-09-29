import { ChevronDown, Droplets, Flame, Wind } from 'lucide-react';
import type { Product } from '@/lib/catalog';
import { site } from '@/lib/site';

function Section({ title, defaultOpen, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  return (
    <details className="group border-b border-line py-1" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-[16px] font-semibold marker:hidden [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown className="h-5 w-5 text-muted transition-transform duration-300 group-open:rotate-180" aria-hidden />
      </summary>
      <div className="pb-5 text-[15px] leading-relaxed text-ink/75">{children}</div>
    </details>
  );
}

export function ProductDetails({ product }: { product: Product }) {
  const isSet = product.category === 'gift-set';
  const isOil = product.category === 'attar' || product.category === 'oil';
  return (
    <div className="border-t border-line">
      <Section title="Description" defaultOpen>
        <p>{product.description}</p>
        <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-muted">Longevity</dt>
            <dd className="font-medium text-ink">{product.longevity}</dd>
          </div>
          <div>
            <dt className="text-muted">Sillage</dt>
            <dd className="font-medium text-ink">{product.sillage}</dd>
          </div>
          <div>
            <dt className="text-muted">Best for</dt>
            <dd className="font-medium text-ink">{product.occasions.slice(0, 2).join(', ')}</dd>
          </div>
          <div>
            <dt className="text-muted">Season</dt>
            <dd className="font-medium text-ink">{product.seasons.join(', ')}</dd>
          </div>
        </dl>
      </Section>

      <Section title={isSet ? 'What’s inside' : 'Fragrance notes'} defaultOpen>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {(
            [
              { label: isSet ? 'Fresh & bright' : 'Top notes', notes: product.notes.top, Icon: Wind },
              { label: isSet ? 'Warm & floral' : 'Heart notes', notes: product.notes.heart, Icon: Flame },
              { label: isSet ? 'Deep & woody' : 'Base notes', notes: product.notes.base, Icon: Droplets },
            ] as const
          ).map(({ label, notes, Icon }) => (
            <div key={label} className="rounded-2xl bg-cream p-4">
              <p className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-gold">
                <Icon className="h-4 w-4" aria-hidden /> {label}
              </p>
              <p className="mt-2 text-[15px] text-ink">{notes.join(' · ')}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="How to wear">
        {isOil ? (
          <p>
            Attars and perfume oils are concentrated and alcohol-free. Apply a small drop to pulse points — wrists, behind the ears
            and the base of the neck — and let it settle naturally rather than rubbing. Patch-test before first use.
          </p>
        ) : (
          <p>
            Spray from about 15 cm onto pulse points — wrists, neck and behind the ears — or onto clothing for a longer trail. Avoid
            rubbing, which breaks down the top notes. Store away from direct sunlight and heat. Patch-test before first use.
          </p>
        )}
      </Section>

      <Section title="Shipping & returns">
        <ul className="list-disc space-y-1.5 pl-5 marker:text-gold">
          <li>
            Free shipping on orders above ₹{site.shipping.freeThreshold.toLocaleString('en-IN')}; ₹{site.shipping.fee} otherwise.
          </li>
          <li>
            Dispatched within {site.shipping.dispatch}; delivered in {site.shipping.delivery} across India.
          </li>
          <li>Cash on Delivery and secure online payment available.</li>
          <li>
            Returns accepted within {site.returns.days} days of delivery for unused, sealed products. See our{' '}
            <a href="/refund-policy" className="font-medium text-brand underline underline-offset-4">
              refund policy
            </a>
            .
          </li>
        </ul>
      </Section>
    </div>
  );
}
