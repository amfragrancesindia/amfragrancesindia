'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Heart, Instagram, Mail, Package, User } from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { WhatsAppLink } from '@/components/ui/WhatsAppLink';
import { navigation, site } from '@/lib/site';
import { cn } from '@/lib/utils';
import { Drawer } from './Drawer';

const shopLinks = [
  { name: 'Men', href: '/products?gender=men' },
  { name: 'Women', href: '/products?gender=women' },
  { name: 'Unisex', href: '/products?gender=unisex' },
];

export function MobileMenu({ open, onClose, signedIn }: { open: boolean; onClose: () => void; signedIn: boolean }) {
  const pathname = usePathname();
  return (
    <Drawer open={open} onClose={onClose} side="left" title="Menu">
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <nav aria-label="Mobile" className="space-y-1">
          {navigation.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center justify-between rounded-xl px-3 py-3 text-[17px] font-medium',
                  active ? 'bg-cream text-brand' : 'text-ink hover:bg-cream',
                )}
              >
                {item.name}
                <ChevronRight className="h-4 w-4 text-muted" />
              </Link>
            );
          })}
        </nav>

        <p className="eyebrow mb-2 mt-7 px-3">Shop by</p>
        <div className="flex flex-wrap gap-2 px-3">
          {shopLinks.map((l) => (
            <Link key={l.href} href={l.href} onClick={onClose} className="rounded-full border border-line px-3.5 py-1.5 text-sm hover:border-brand hover:text-brand">
              {l.name}
            </Link>
          ))}
        </div>

        <div className="mt-7 space-y-1 border-t border-line pt-5">
          <Link href={signedIn ? '/account' : '/login'} onClick={onClose} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-cream">
            <User className="h-5 w-5 text-brand" /> {signedIn ? 'My Account' : 'Sign in / Register'}
          </Link>
          <Link href="/account/orders" onClick={onClose} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-cream">
            <Package className="h-5 w-5 text-brand" /> My Orders
          </Link>
          <Link href="/wishlist" onClick={onClose} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-cream">
            <Heart className="h-5 w-5 text-brand" /> Wishlist
          </Link>
        </div>
      </div>
      <div className="space-y-2 border-t border-line bg-cream px-8 py-5 text-sm text-ink/80">
        <WhatsAppLink className="flex items-center gap-3">
          <WhatsAppIcon className="h-4 w-4 text-brand" /> Chat on WhatsApp
        </WhatsAppLink>
        <a href={`mailto:${site.email}`} className="flex items-center gap-3">
          <Mail className="h-4 w-4 text-brand" /> {site.email}
        </a>
        <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
          <Instagram className="h-4 w-4 text-brand" /> {site.social.instagramHandle}
        </a>
      </div>
    </Drawer>
  );
}
