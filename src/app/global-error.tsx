'use client';

import { Monogram } from '@/components/layout/Logo';

// Last-resort boundary for errors in the root layout itself.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en-IN">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#FAF8F2', color: '#1C1916' }}>
        <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, textAlign: 'center' }}>
          <div>
            <div style={{ width: 64, margin: '0 auto', color: '#9A7536' }}>
              <Monogram />
            </div>
            <h1 style={{ fontSize: 24, margin: '16px 0 8px' }}>Something went wrong</h1>
            <p style={{ color: '#6F665C', margin: '0 0 24px' }}>Please refresh the page or try again in a moment.</p>
            <button
              type="button"
              onClick={reset}
              style={{ background: '#5A4A3A', color: '#fff', border: 0, borderRadius: 8, padding: '12px 24px', fontSize: 15, cursor: 'pointer' }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
