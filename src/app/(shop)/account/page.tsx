import Link from 'next/link';
import { MapPin, Package } from 'lucide-react';
import { ProfileForm } from '@/components/account/ProfileForm';
import { AccountUnavailable } from '@/components/account/Unavailable';
import { requireUser } from '@/lib/auth';
import { isDatabaseConfigured, prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

async function loadProfile(userId: string) {
  if (!isDatabaseConfigured()) return null;
  try {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, phone: true, createdAt: true, _count: { select: { orders: true, addresses: true } } },
    });
  } catch (error) {
    console.error('[account] could not load profile', error);
    return null;
  }
}

export default async function AccountPage() {
  const user = await requireUser('/account');
  const profile = await loadProfile(user.id);
  if (!profile) return <AccountUnavailable />;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link href="/account/orders" className="group flex items-center gap-4 rounded-2xl border border-line p-5 transition hover:border-brand-light">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-cream text-brand">
            <Package className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-2xl font-semibold">{profile._count.orders}</span>
            <span className="text-sm text-muted group-hover:text-ink">Orders</span>
          </span>
        </Link>
        <Link href="/account/addresses" className="group flex items-center gap-4 rounded-2xl border border-line p-5 transition hover:border-brand-light">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-cream text-brand">
            <MapPin className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-2xl font-semibold">{profile._count.addresses}</span>
            <span className="text-sm text-muted group-hover:text-ink">Saved addresses</span>
          </span>
        </Link>
      </div>

      <section className="rounded-2xl border border-line p-6 sm:p-8">
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-xl font-semibold">Profile</h2>
          <p className="text-sm text-muted">Member since {formatDate(profile.createdAt)}</p>
        </div>
        <ProfileForm name={profile.name ?? ''} phone={profile.phone ?? ''} email={profile.email} />
      </section>
    </div>
  );
}
