'use client';

import React from 'react';
import Image from 'next/image';

interface PriceProps {
  price: number;
  compareAtPrice?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Price({ price, compareAtPrice, size = 'md', className }: PriceProps) {
  const sizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-3xl',
  };

  const discount = compareAtPrice
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  return (
    <div className={cn('flex items-baseline gap-3', className)}>
      <span className={cn('font-semibold text-gold-500', sizes[size])}>
        ₹{price.toLocaleString()}
      </span>
      {compareAtPrice && compareAtPrice > price && (
        <>
          <span className={cn('text-luxury-muted line-through', size === 'lg' ? 'text-lg' : 'text-sm')}>
            ₹{compareAtPrice.toLocaleString()}
          </span>
          <span className="px-2 py-0.5 bg-red-500/10 text-red-400 text-xs font-medium rounded">
            {discount}% OFF
          </span>
        </>
      )}
    </div>
  );
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}
