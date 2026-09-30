// Store-wide settings. Update contact details here and they change everywhere
// (header, footer, contact page, emails, policies, structured data).
export const site = {
  name: 'AM Fragrances',
  legalName: 'AM Fragrances India',
  tagline: 'A Signature in Every Scent',
  description:
    'Luxury perfumes, attars and perfume oils crafted in India. Discover long-lasting eau de parfums inspired by Indian heritage — saffron, oud, rose and sandalwood.',
  // Public address used in emails, the sitemap, search results and social previews.
  // NEXT_PUBLIC_APP_URL (set at build time) overrides it, e.g. for a test copy. www and the
  // workers.dev address redirect here (cloudflare-worker.js).
  url: (
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.NODE_ENV === 'production' ? 'https://amfragrancesindia.com' : 'http://localhost:3000')
  ).replace(/\/$/, ''),
  email: 'luxury@amfragrancesindia.com',
  // WhatsApp Business chat link: opens a chat with the store (the number itself stays private).
  whatsapp: 'https://wa.me/message/W4E4LAHLVOUBE1',
  address: 'Mumbai, Maharashtra, India',
  hours: 'Monday – Saturday, 10:00 AM – 7:00 PM IST',
  social: {
    instagram: 'https://www.instagram.com/amfragrancesindia',
    instagramHandle: '@amfragrancesindia',
  },
  // Online payment (UPI, cards, net banking) through Razorpay. Switch this on once the Razorpay keys
  // are set (DEPLOYMENT.md, section 3), so the home page, cart, footer and FAQ mention it. Checkout
  // itself only ever offers the payment options that are really configured.
  onlinePayments: false,
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
