import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { ContactForm } from '@/components/contact/ContactForm';
import { PageHeader } from '@/components/ui/PageHeader';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: `Questions about an order or a fragrance? Contact AM Fragrances by phone, email or the form — we reply within one business day.`,
  alternates: { canonical: '/contact' },
};

const channels = [
  { Icon: Phone, label: 'Call us', value: site.phone, href: site.phoneHref },
  { Icon: Mail, label: 'Email us', value: site.email, href: `mailto:${site.email}` },
  { Icon: Instagram, label: 'Instagram', value: '@amfragrancesindia', href: site.social.instagram },
  { Icon: MapPin, label: 'Based in', value: site.address },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact Us"
        crumb="Contact"
        intro="Whether you need help choosing a fragrance, have a question about your order or want to talk about gifting, we’d love to hear from you."
      />
      <div className="container-x grid grid-cols-1 gap-12 py-14 sm:py-20 lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-16">
        <aside className="space-y-4">
          {channels.map(({ Icon, label, value, href }) => {
            const content = (
              <>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-cream text-brand">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm text-muted">{label}</span>
                  <span className="block break-words font-medium">{value}</span>
                </span>
              </>
            );
            return href ? (
              <a
                key={label}
                href={href}
                {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="flex items-center gap-4 rounded-2xl border border-line p-4 transition hover:border-brand-light"
              >
                {content}
              </a>
            ) : (
              <div key={label} className="flex items-center gap-4 rounded-2xl border border-line p-4">
                {content}
              </div>
            );
          })}
          <div className="flex items-start gap-4 rounded-2xl bg-cream p-4 text-sm text-ink/80">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
            <p>
              <span className="font-medium text-ink">Support hours</span>
              <br />
              {site.hours}
            </p>
          </div>
          <p className="px-1 text-sm text-muted">
            Looking for quick answers? Visit our{' '}
            <Link href="/faq" className="font-medium text-brand hover:underline">
              FAQs
            </Link>
            .
          </p>
        </aside>

        <section aria-labelledby="contact-form-title">
          <h2 id="contact-form-title" className="text-2xl font-semibold">
            Send us a message
          </h2>
          <p className="mb-8 mt-1 text-muted">We reply within one business day.</p>
          <ContactForm />
        </section>
      </div>
    </>
  );
}
