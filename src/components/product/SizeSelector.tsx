'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductVariant {
  id: string;
  name: string;
  volume?: string;
  price: number;
  stock: number;
  isAvailable: boolean;
}

interface SizeSelectorProps {
  variants: ProductVariant[];
  selectedVariantId: string | null;
  onSelect: (variant: ProductVariant) => void;
}

export function SizeSelector({ variants, selectedVariantId, onSelect }: SizeSelectorProps) {
  return (
    <div>
      <label className="text-sm font-medium text-luxury-secondary mb-3 block">
        Size: <span className="text-gold-500">
          {variants.find((v) => v.id === selectedVariantId)?.name || 'Select'}
        </span>
      </label>
      <div className="flex flex-wrap gap-3">
        {variants.map((variant) => (
          <button
            key={variant.id}
            onClick={() => onSelect(variant)}
            disabled={!variant.isAvailable}
            className={cn(
              'relative px-6 py-3 border rounded-lg text-sm font-medium transition-all',
              selectedVariantId === variant.id
                ? 'border-gold-500 bg-gold-500/10 text-gold-500'
                : 'border-white/10 text-luxury-secondary hover:border-gold-500/50',
              !variant.isAvailable && 'opacity-40 cursor-not-allowed line-through'
            )}
          >
            {variant.name}
            {variant.volume && <span className="text-xs ml-1">({variant.volume})</span>}
            {selectedVariantId === variant.id && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-gold-500 rounded-full flex items-center justify-center">
                <Check className="h-3 w-3 text-luxury-black" />
              </span>
            )}
            {!variant.isAvailable && (
              <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded">
                Sold Out
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
