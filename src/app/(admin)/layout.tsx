'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Archive,
  Tag,
  FileText,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Inventory', href: '/admin/inventory', icon: Archive },
  { name: 'Coupons', href: '/admin/coupons', icon: Tag },
  { name: 'Blog', href: '/admin/blog', icon: FileText },
  { name: 'Reviews', href: '/admin/reviews', icon: MessageSquare },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-luxury-black">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen bg-luxury-dark border-r border-white/10 transition-all duration-300',
          sidebarCollapsed ? 'w-[72px]' : 'w-[260px]'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-white/10">
          <Link href="/admin/dashboard">
            <h1
              className={cn(
                'font-serif text-xl text-luxury-light transition-all duration-300',
                sidebarCollapsed ? 'text-sm tracking-wider' : 'tracking-[0.15em]'
              )}
            >
              {sidebarCollapsed ? 'AF' : 'ADMIN'}
            </h1>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                'text-luxury-muted hover:text-luxury-light hover:bg-white/5'
              )}
              title={sidebarCollapsed ? item.name : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!sidebarCollapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* Collapse Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute bottom-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-5 w-5 text-luxury-muted" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-luxury-muted" />
          )}
        </button>
      </aside>

      {/* Main Content */}
      <div className={cn('transition-all duration-300', sidebarCollapsed ? 'ml-[72px]' : 'ml-[260px]')}>
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-luxury-black/90 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center justify-between h-full px-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative max-w-md w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-luxury-muted" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 bg-luxury-dark border border-white/10 rounded-md text-sm text-luxury-light placeholder:text-luxury-muted focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-luxury-muted hover:text-luxury-light transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gold-500/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gold-500">A</span>
                </div>
                <span className="text-sm text-luxury-light hidden sm:block">Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
