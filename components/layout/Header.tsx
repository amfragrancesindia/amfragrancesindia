'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Heart, Menu, Search, ShoppingCart, User } from 'lucide-react';
import { useCart } from '@/components/providers/CartProvider';
import { navigation } from '@/lib/site';
import { cn } from '@/lib/utils';
import { AnnouncementBar } from './AnnouncementBar';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';
import { SearchOverlay } from './SearchOverlay';

export function Header() {
  const pathname = usePathname();
  const { itemCount, hydrated, openDrawer, wishlist } = useCart();
  const { status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const isHome = pathname === '/';
  const transparent = isHome && !scrolled && !searchOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close overlays when navigating.
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  const circle = cn(
    'relative grid h-9 w-9 place-items-center rounded-full transition-colors duration-300',
    transparent ? 'bg-white text-ink hover:bg-cream' : 'bg-ink text-white hover:bg-brand',
  );
  const plain = 'relative grid h-10 w-10 place-items-center rounded-full';
  const count = hydrated ? itemCount : 0;

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded-md bg-ink px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
      >
        Skip to content
      </a>
      <header className="fixed inset-x-0 top-0 z-40">
        <AnnouncementBar hidden={scrolled} />
        <div
          className={cn(
            'transition-[background-color,box-shadow,color] duration-300',
            transparent ? 'bg-transparent text-white' : 'bg-white/95 text-ink shadow-header backdrop-blur-md',
          )}
        >
          <div className="container-x grid h-[var(--header-height)] grid-cols-[1fr_auto_1fr] items-center gap-3">
            {/* Left: menu (mobile) + navigation (desktop) */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                className={cn(plain, '-ml-2 lg:hidden')}
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={menuOpen}
              >
                <Menu className="h-[22px] w-[22px]" />
              </button>
              <button type="button" className={cn(plain, 'lg:hidden')} onClick={() => setSearchOpen(true)} aria-label="Search">
                <Search className="h-5 w-5" />
              </button>
              <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={cn(
                      'text-[15px] font-medium transition-colors',
                      isActive(item.href)
                        ? transparent
                          ? 'font-semibold text-gold-soft'
                          : 'font-semibold text-brand'
                        : transparent
                          ? 'text-white/90 hover:text-white'
                          : 'text-ink/85 hover:text-brand',
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            <Logo />

            {/* Right: actions */}
            <div className="flex items-center justify-end gap-1 lg:gap-3">
              <button type="button" className={cn(circle, 'hidden lg:grid')} onClick={() => setSearchOpen(true)} aria-label="Search">
                <Search className="h-[18px] w-[18px]" />
              </button>
              <button
                type="button"
                className={cn(plain, 'lg:hidden')}
                onClick={openDrawer}
                aria-label={`Cart, ${count} item${count === 1 ? '' : 's'}`}
              >
                <ShoppingCart className="h-[21px] w-[21px]" />
                <CountBadge count={count} />
              </button>
              <button
                type="button"
                className={cn(circle, 'hidden lg:grid')}
                onClick={openDrawer}
                aria-label={`Cart, ${count} item${count === 1 ? '' : 's'}`}
              >
                <ShoppingCart className="h-[18px] w-[18px]" />
                <CountBadge count={count} />
              </button>
              <Link href="/wishlist" className={cn(circle, 'hidden lg:grid')} aria-label={`Wishlist, ${wishlist.length} saved`}>
                <Heart className="h-[18px] w-[18px]" />
                <CountBadge count={hydrated ? wishlist.length : 0} />
              </Link>
              <Link
                href={status === 'authenticated' ? '/account' : '/login'}
                className={cn(circle, 'hidden lg:grid')}
                aria-label={status === 'authenticated' ? 'My account' : 'Sign in'}
              >
                <User className="h-[18px] w-[18px]" />
              </Link>
            </div>
          </div>
        </div>
      </header>
      {/* Pages other than the home hero start below the fixed header. */}
      {!isHome && <div aria-hidden className="h-[calc(var(--header-height)+36px)]" />}

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} signedIn={status === 'authenticated'} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

function CountBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-gold px-1 text-[10.5px] font-semibold leading-none text-white ring-2 ring-white">
      {count > 99 ? '99+' : count}
    </span>
  );
}
