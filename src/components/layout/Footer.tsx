import Link from 'next/link';
import { Clock, Instagram, Mail, MapPin } from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { WhatsAppLink } from '@/components/ui/WhatsAppLink';
import { site } from '@/lib/site';
import { Logo } from './Logo';
import { NewsletterForm } from './NewsletterForm';

const columns = [
  {
    title: 'Shop',
    links: [
      { name: 'Men', href: '/products?gender=men' },
      { name: 'Women', href: '/products?gender=women' },
      { name: 'Unisex', href: '/products?gender=unisex' },
      { name: 'All Products', href: '/products' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'FAQs', href: '/faq' },
      { name: 'Track Your Order', href: '/account/orders' },
    ],
  },
  {
    title: 'Policies',
    links: [
      { name: 'Shipping Policy', href: '/shipping-policy' },
      { name: 'Refund & Returns', href: '/refund-policy' },
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Terms of Service', href: '/terms' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-brand text-white">
      <div className="border-b border-white/10">
        <div className="container-x flex flex-col gap-6 py-10 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-display text-3xl">Join the AM circle</p>
            <p className="mt-1 text-sm text-white/70">New launches, private offers and fragrance notes — never spam.</p>
          </div>
          <NewsletterForm />
        </div>
      </div>

      {/* Phones and tablets: the brand on top, then Shop | Company and Policies | Contact Us in pairs
          (on phones the right column is a little wider, so the email address fits on its line). */}
      <div className="container-x grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-x-6 gap-y-10 py-14 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-[1.3fr_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_1.35fr]">
        <div className="col-span-2 lg:col-span-1">
          <Logo size="lg" className="text-logo-light" />
          <p className="mt-5 max-w-xs text-[15px] text-white/80">{site.tagline}</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/60">
            Luxury eaux de parfum crafted in India — long-lasting fragrances in 100 ml flacons, each with its own gift box.
          </p>
          <a
            href={site.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="AM Fragrances on Instagram"
            className="mt-5 inline-grid h-10 w-10 place-items-center rounded-full border border-white/25 transition hover:border-white hover:bg-white hover:text-brand"
          >
            <Instagram className="h-[18px] w-[18px]" />
          </a>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-[17px] font-bold">{col.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[15px] text-white/80 transition-colors hover:text-white">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="text-[17px] font-bold">Contact Us</h3>
          <ul className="mt-4 space-y-3 text-[14px] text-white/80 sm:text-[15px]">
            <li>
              <WhatsAppLink className="flex items-start gap-2.5 hover:text-white sm:gap-3">
                <WhatsAppIcon className="mt-[3px] h-4 w-4 shrink-0" /> Chat on WhatsApp
              </WhatsAppLink>
            </li>
            <li>
              {/* On narrow phones the address wraps after the @ rather than inside the domain. */}
              <a href={`mailto:${site.email}`} className="flex items-start gap-2.5 [overflow-wrap:anywhere] hover:text-white sm:gap-3">
                <Mail className="mt-[3px] h-4 w-4 shrink-0" aria-hidden />
                <span>
                  {site.email.split('@')[0]}@<wbr />
                  {site.email.split('@')[1]}
                </span>
              </a>
            </li>
            <li className="flex items-start gap-2.5 sm:gap-3">
              <MapPin className="mt-[3px] h-4 w-4 shrink-0" aria-hidden /> {site.address}
            </li>
            <li className="flex items-start gap-2.5 text-[13px] text-white/65 sm:gap-3 sm:text-sm">
              <Clock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> {site.hours}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        {/* Room below (phones) or to the right (wider screens) so the floating buttons never cover this line. */}
        <div className="container-x flex flex-col items-center justify-between gap-3 pb-24 pt-6 text-[13px] text-white/65 sm:flex-row sm:pb-6 sm:pr-28">
          <p>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
          <p>{site.onlinePayments ? 'Order on WhatsApp · Secure online payments · UPI · Cards' : 'Order on WhatsApp · Delivered across India'}</p>
        </div>
      </div>
    </footer>
  );
}
