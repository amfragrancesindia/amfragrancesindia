import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { COUPONS } from '@/lib/pricing';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Answers about delivery, payments, returns, our perfumes and your AM Fragrances account.',
  alternates: { canonical: '/faq' },
};

const welcome = COUPONS.WELCOME10;

const groups: Array<{ title: string; items: Array<{ q: string; a: string }> }> = [
  {
    title: 'Orders & delivery',
    items: [
      {
        q: 'How long does delivery take?',
        a: `Orders are dispatched within ${site.shipping.dispatch}. Delivery usually takes ${site.shipping.metroDelivery} in metro cities and ${site.shipping.delivery} elsewhere in India.`,
      },
      { q: 'Do you ship outside India?', a: 'At the moment we deliver only within India.' },
      {
        q: 'How can I track my order?',
        a: 'We send you the tracking number on WhatsApp as soon as your parcel ships.',
      },
      {
        q: 'Can I change or cancel my order?',
        a: `Yes — as long as it hasn’t been dispatched. Contact us as soon as possible on WhatsApp or at ${site.email} with your order number.`,
      },
    ],
  },
  {
    title: 'Payments & pricing',
    items: [
      {
        q: 'Which payment methods do you accept?',
        a: site.onlinePayments
          ? 'You can order on WhatsApp, or pay online by UPI, debit or credit card, net banking or wallet through our secure payment partner Razorpay.'
          : 'Orders are placed on WhatsApp: tap Buy Now on a perfume, or Order on WhatsApp in your cart. We confirm your order in the chat and share the payment details (UPI or bank transfer).',
      },
      { q: 'Are prices inclusive of GST?', a: 'Yes. All prices are MRP, inclusive of all taxes, with no hidden charges.' },
      { q: 'Do you have a discount code?', a: `New customers can use ${welcome.code} for ${welcome.description}. Add it in your cart before you order on WhatsApp.` },
      ...(site.onlinePayments
        ? [{ q: 'Is it safe to pay online?', a: 'Card and UPI details are entered directly on Razorpay’s secure payment page — they never pass through or get stored on our servers.' }]
        : []),
    ],
  },
  {
    title: 'Returns & refunds',
    items: [
      {
        q: 'What is your return policy?',
        a: `You can return unused products in their original sealed packaging within ${site.returns.days} days of delivery. For hygiene reasons, opened fragrances can’t be returned unless they arrived damaged or incorrect.`,
      },
      {
        q: 'My order arrived damaged or incorrect. What should I do?',
        a: 'Please contact us within 48 hours of delivery with your order number and photos (an unboxing video helps). We’ll arrange a free replacement or a full refund.',
      },
      {
        q: 'How long do refunds take?',
        a: 'Once we receive and check the return, refunds are issued within 5–7 business days by UPI or bank transfer (or to the card or account you paid from online).',
      },
    ],
  },
  {
    title: 'Our fragrances',
    items: [
      {
        q: 'How long do your perfumes last?',
        a: 'Our eaux de parfum typically last 6–12 hours depending on the fragrance, your skin and the weather. Each product page lists its expected longevity.',
      },
      {
        q: 'Which fragrance should I choose?',
        a: 'For evenings and celebrations, try the deep Royal Oud or Midnight Noir. For fresh everyday wear, Citrus Wood or Ocean Breeze. Velvet Bloom is a soft, romantic floral. Not sure? Message us on WhatsApp and we will help you choose.',
      },
      { q: 'How should I store my perfume?', a: 'Keep bottles closed, upright and away from direct sunlight, heat and humidity — a drawer or cupboard is ideal.' },
    ],
  },
  {
    title: 'Your account',
    items: [
      { q: 'Do I need an account to order?', a: 'No, you can check out as a guest. An account lets you save addresses and see your order history.' },
      { q: 'I forgot my password.', a: 'Use “Forgot password” on the sign-in page and we’ll email you a secure link to set a new one.' },
    ],
  },
];

export default function FaqPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: groups.flatMap((g) =>
      g.items.map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })),
    ),
  };

  return (
    <>
      <PageHeader title="FAQs" intro="Everything you need to know about ordering, delivery, returns and our fragrances." />
      <div className="container-x grid grid-cols-1 gap-12 py-14 sm:py-20 lg:grid-cols-[240px_minmax(0,1fr)]">
        <nav aria-label="FAQ topics" className="hidden lg:block">
          <ul className="sticky top-[calc(var(--header-height)+24px)] space-y-1">
            {groups.map((g, i) => (
              <li key={g.title}>
                <a href={`#faq-${i}`} className="block rounded-xl px-4 py-2.5 text-[15px] font-medium text-ink/75 hover:bg-cream hover:text-ink">
                  {g.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-12">
          {groups.map((g, i) => (
            <section key={g.title} id={`faq-${i}`} className="scroll-mt-32">
              <h2 className="font-display text-3xl font-medium">{g.title}</h2>
              <div className="mt-4 border-t border-line">
                {g.items.map((item) => (
                  <details key={item.q} className="group border-b border-line">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[16px] font-semibold [&::-webkit-details-marker]:hidden">
                      {item.q}
                      <ChevronDown className="h-5 w-5 shrink-0 text-muted transition-transform duration-300 group-open:rotate-180" aria-hidden />
                    </summary>
                    <p className="pb-5 pr-8 text-[15.5px] leading-relaxed text-ink/75">{item.a}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}
          <div className="rounded-2xl bg-cream p-8 text-center">
            <p className="text-lg font-semibold">Still have a question?</p>
            <p className="mt-1 text-muted">Our team is happy to help — we reply within one business day.</p>
            <ButtonLink href="/contact" className="mt-5">
              Contact us
            </ButtonLink>
            <p className="mt-4 text-sm text-muted">
              Or read our{' '}
              <Link href="/shipping-policy" className="text-brand hover:underline">
                shipping
              </Link>{' '}
              and{' '}
              <Link href="/refund-policy" className="text-brand hover:underline">
                refund
              </Link>{' '}
              policies.
            </p>
          </div>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
