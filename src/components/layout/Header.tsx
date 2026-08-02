'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Heart, Search, User, Menu, X } from 'lucide-react';
import { useCart } from '@/components/providers/CartProvider';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/catalog' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled
          ? 'bg-luxury-black/95 backdrop-blur-md border-b border-white/10'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <h1
              className={cn(
                'font-serif text-xl md:text-2xl transition-all duration-500 tracking-[0.15em]',
                isScrolled ? 'text-luxury-light' : 'text-luxury-light'
              )}
            >
              AMFRAGRANCESINDIA
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm font-medium tracking-wider uppercase transition-colors',
                  pathname === item.href
                    ? 'text-gold-500'
                    : 'text-luxury-secondary hover:text-luxury-light'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link href="/search" className="hidden md:block">
              <Search className="h-5 w-5 text-luxury-secondary hover:text-luxury-light transition-colors" />
            </Link>
            <Link href="/account" className="hidden md:block">
              <User className="h-5 w-5 text-luxury-secondary hover:text-luxury-light transition-colors" />
            </Link>
            <Link href="/account/wishlist" className="hidden md:block">
              <Heart className="h-5 w-5 text-luxury-secondary hover:text-luxury-light transition-colors" />
            </Link>
            <Link href="/checkout/cart" className="relative">
              <ShoppingBag className="h-5 w-5 text-luxury-secondary hover:text-luxury-light transition-colors" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-gold-500 text-luxury-black text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-luxury-light" />
              ) : (
                <Menu className="h-6 w-6 text-luxury-light" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-luxury-dark border-t border-white/10"
        >
          <nav className="px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  'block px-4 py-3 rounded-lg text-sm font-medium',
                  pathname === item.href
                    ? 'bg-gold-500/10 text-gold-500'
                    : 'text-luxury-secondary hover:text-luxury-light'
                )}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t border-white/10 pt-2 mt-2 space-y-2">
              <Link href="/account" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-luxury-secondary">My Account</Link>
              <Link href="/search" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-luxury-secondary">Search</Link>
            </div>
          </nav>
        </motion.div>
      )}
    </header>
  );
}
