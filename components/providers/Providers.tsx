'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './CartProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1C1916',
              color: '#FFFFFF',
              borderRadius: '999px',
              padding: '10px 18px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#C9A961', secondary: '#1C1916' } },
          }}
        />
      </CartProvider>
    </SessionProvider>
  );
}
