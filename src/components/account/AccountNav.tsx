'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Heart, KeyRound, LogOut, MapPin, Package, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { href: '/account', label: 'Profile', Icon: User },
  { href: '/account/orders', label: 'Orders', Icon: Package },
  { href: '/account/addresses', label: 'Addresses', Icon: MapPin },
  { href: '/wishlist', label: 'Wishlist', Icon: Heart },
  { href: '/account/settings', label: 'Password', Icon: KeyRound },
];

export function AccountNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Account" className="-mx-4 flex gap-2 overflow-x-auto px-4 scrollbar-none lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0">
      {items.map(({ href, label, Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex shrink-0 items-center gap-3 rounded-xl px-4 py-2.5 text-[15px] font-medium transition',
              active ? 'bg-ink text-white' : 'text-ink/80 hover:bg-cream hover:text-ink',
            )}
          >
            <Icon className="h-[18px] w-[18px]" /> {label}
          </Link>
        );
      })}
      <button
        type="button"
        onClick={() => signOut({ redirectTo: '/' })}
        className="flex shrink-0 items-center gap-3 rounded-xl px-4 py-2.5 text-left text-[15px] font-medium text-ink/80 transition hover:bg-cream hover:text-danger lg:mt-3 lg:border-t lg:border-line lg:pt-4"
      >
        <LogOut className="h-[18px] w-[18px]" /> Sign out
      </button>
    </nav>
  );
}
