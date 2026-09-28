import type { Metadata, Viewport } from 'next';
import { Cinzel, Cormorant_Garamond, Pinyon_Script, Urbanist } from 'next/font/google';
import Providers from '@/components/providers/Providers';
import { site } from '@/lib/site';
import './globals.css';

const urbanist = Urbanist({ subsets: ['latin'], variable: '--font-urbanist', display: 'swap' });
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});
const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel', display: 'swap' });
const pinyon = Pinyon_Script({ subsets: ['latin'], weight: '400', variable: '--font-pinyon', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Luxury Perfumes & Attars from India`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: ['luxury perfume India', 'attar', 'oud perfume', 'saffron perfume', 'eau de parfum', 'perfume oil', 'AM Fragrances'],
  openGraph: {
    type: 'website',
    siteName: site.name,
    locale: 'en_IN',
    title: `${site.name} — Luxury Perfumes & Attars from India`,
    description: site.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — Luxury Perfumes & Attars from India`,
    description: site.description,
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-IN"
      className={`${urbanist.variable} ${cormorant.variable} ${cinzel.variable} ${pinyon.variable}`}
    >
      <body className="min-h-screen bg-white font-sans text-ink antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
