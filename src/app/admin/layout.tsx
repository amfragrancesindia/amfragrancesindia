import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import { AdminNav } from '@/components/admin/AdminNav';
import { Monogram } from '@/components/layout/Logo';
import { getSessionUser, isAdmin } from '@/lib/auth';
import { isDatabaseConfigured } from '@/lib/prisma';

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s | Admin — AM Fragrances' },
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect('/login?callbackUrl=/admin/dashboard');
  if (!isAdmin(user)) redirect('/account');

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/admin/dashboard" className="flex items-center gap-3" aria-label="AM Fragrances admin">
            <Monogram title={null} className="h-8 w-auto text-logo" />
            <span className="text-sm font-semibold uppercase tracking-widest text-muted">Admin</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-muted sm:inline">{user.email}</span>
            <Link href="/" className="inline-flex items-center gap-1.5 font-medium text-brand hover:underline">
              View store <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>
      <div className="mx-auto grid grid-cols-1 max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 lg:px-8 lg:py-10">
        <AdminNav />
        <main className="min-w-0">
          {isDatabaseConfigured() ? (
            children
          ) : (
            <div className="rounded-2xl border border-line bg-white p-8">
              <h1 className="text-xl font-semibold">Connect a database</h1>
              <p className="mt-2 text-muted">
                Orders, customers and messages are stored in a Cloudflare D1 database. Add its ID to{' '}
                <code>wrangler.jsonc</code> (binding <code>DB</code>) and create the tables — see DEPLOYMENT.md.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
