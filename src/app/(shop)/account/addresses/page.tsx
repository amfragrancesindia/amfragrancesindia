import { AddressBook } from '@/components/account/AddressBook';
import { AccountUnavailable } from '@/components/account/Unavailable';
import { isDatabaseConfigured } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default function AddressesPage() {
  if (!isDatabaseConfigured()) return <AccountUnavailable />;
  return <AddressBook />;
}
