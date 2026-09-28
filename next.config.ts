import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';
import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
];

// Old URLs that were linked from the previous site (or never existed) are
// redirected so bookmarks, shared links and search results keep working.
const legacyRedirects: Array<[string, string]> = [
  ['/catalog', '/products'],
  ['/shop', '/products'],
  ['/favorites', '/wishlist'],
  ['/account/wishlist', '/wishlist'],
  ['/checkout/cart', '/cart'],
  ['/checkout/checkout', '/checkout'],
  ['/checkout/coupons', '/cart'],
  ['/checkout/order-confirmation', '/order-success'],
  ['/auth/login', '/login'],
  ['/auth/register', '/register'],
  ['/auth/forgot-password', '/forgot-password'],
  ['/auth/reset-password', '/reset-password'],
  ['/faqs', '/faq'],
  ['/privacy', '/privacy-policy'],
  ['/shipping', '/shipping-policy'],
  ['/returns', '/refund-policy'],
  ['/track-order', '/account/orders'],
  ['/dashboard', '/admin/dashboard'],
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // A stray package-lock.json in the user profile folder confuses Next's
  // workspace-root detection; pin it to this project.
  outputFileTracingRoot: process.cwd(),
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Prisma's generated client has to be bundled as-is for the Workers runtime.
  serverExternalPackages: ['@prisma/client', '.prisma/client'],
  images: {
    // The product photos are already small WebP files (under 110 KB), so they
    // are served as they are instead of through an image-resizing service.
    unoptimized: true,
    qualities: [75, 82],
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
  async redirects() {
    return legacyRedirects.map(([source, destination]) => ({ source, destination, permanent: true }));
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
};

export default nextConfig;

// Lets `next dev` use the bindings from wrangler.jsonc (the local D1 database).
initOpenNextCloudflareForDev();
