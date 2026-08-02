import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'new' | 'sale' | 'limited' | 'bestseller' | 'outofstock';
  className?: string;
}

export function Badge({ children, variant = 'new', className }: BadgeProps) {
  const variants = {
    new: 'bg-gold-500 text-luxury-black',
    sale: 'bg-red-500 text-white',
    limited: 'bg-purple-500 text-white',
    bestseller: 'bg-emerald-500 text-white',
    outofstock: 'bg-gray-500 text-white',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase rounded-sm',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
