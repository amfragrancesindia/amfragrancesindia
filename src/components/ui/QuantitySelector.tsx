'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function QuantitySelector({ value, onChange, min = 1, max = 99 }: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-0 border border-white/10 rounded-lg overflow-hidden">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={cn(
          'p-2 hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed'
        )}
      >
        <Minus className="h-4 w-4 text-luxury-light" />
      </button>
      <span className="w-12 text-center text-sm font-medium text-luxury-light">
        {value}
      </span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={cn(
          'p-2 hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed'
        )}
      >
        <Plus className="h-4 w-4 text-luxury-light" />
      </button>
    </div>
  );
}
