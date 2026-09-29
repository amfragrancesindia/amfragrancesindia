'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Mail, Package, ShoppingBag, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { href: '/admin/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', Icon: ShoppingBag },
  { href: '/admin/products', label: 'Products', Icon: Package },
  { href: '/admin/customers', label: 'Customers', Icon: Users },
  { href: '/admin/messages', label: 'Messages', Icon: Mail },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="flex gap-1 overflow-x-auto scrollbar-none lg:flex-col">
      {items.map(({ href, label, Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex shrink-0 items-center gap-3 rounded-xl px-4 py-2.5 text-[15px] font-medium transition',
              active ? 'bg-white text-ink shadow-soft' : 'text-ink/70 hover:bg-white/60 hover:text-ink',
            )}
          >
            <Icon className="h-[18px] w-[18px]" /> {label}
          </Link>
        );
      })}
    </nav>
  );
}
