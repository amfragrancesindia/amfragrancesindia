// Store-wide settings. Update contact details here and they change everywhere
// (header, footer, contact page, emails, policies, structured data).
export const site = {
  name: 'AM Fragrances',
  legalName: 'AM Fragrances India',
  tagline: 'A Signature in Every Scent',
  description:
    'Luxury perfumes, attars and perfume oils crafted in India. Discover long-lasting eau de parfums inspired by Indian heritage — saffron, oud, rose and sandalwood.',
  // Public address used in emails, the sitemap and social previews.
  // NEXT_PUBLIC_APP_URL (set at build time) overrides it, e.g. for a test copy.
  url: (
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.NODE_ENV === 'production' ? 'https://amfragrancesindia.com' : 'http://localhost:3000')
  ).replace(/\/$/, ''),
  email: 'luxury@amfragrancesindia.com',
  phone: '+91 98765 43210',
  phoneHref: 'tel:+919876543210',
  address: 'Mumbai, Maharashtra, India',
  hours: 'Monday – Saturday, 10:00 AM – 7:00 PM IST',
  social: {
    instagram: 'https://www.instagram.com/amfragrancesindia',
  },
  shipping: {
    freeThreshold: 1999,
    fee: 99,
    dispatch: '1–2 business days',
    delivery: '3–7 business days',
    metroDelivery: '2–4 business days',
  },
  returns: {
    days: 7,
  },
} as const;

export const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Products', href: '/products' },
  { name: 'Contact', href: '/contact' },
] as const;
