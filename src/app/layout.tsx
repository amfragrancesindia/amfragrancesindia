import Providers from '@/components/providers/Providers';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata = {
  title: 'AMFRAGRANCESINDIA | Luxury Fragrances',
  description: 'Discover exclusive luxury fragrances at AMFRAGRANCESINDIA. Premium perfumes, attars, and oils.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans antialiased bg-luxury-black text-luxury-light">
        <Providers>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#111111',
                color: '#F5F5F0',
                border: '1px solid rgba(212, 175, 55, 0.3)',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
