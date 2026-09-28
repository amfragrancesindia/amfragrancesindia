import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AccountNav } from '@/components/account/AccountNav';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { getSessionUser } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'My Account',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect('/login?callbackUrl=/account');

  return (
    <div className="container-x pb-20 pt-6 sm:pt-8">
      <Breadcrumbs items={[{ name: 'My Account' }]} />
      <div className="mt-6">
        <h1 className="text-[32px] font-semibold tracking-tight sm:text-4xl">My Account</h1>
        <p className="mt-1 text-muted">Signed in as {user.email}</p>
      </div>
      <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-12">
        <AccountNav />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
