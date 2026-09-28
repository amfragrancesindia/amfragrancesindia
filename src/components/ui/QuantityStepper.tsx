'use client';

import { Minus, Plus } from 'lucide-react';
import { MAX_QTY_PER_LINE } from '@/lib/pricing';
import { cn } from '@/lib/utils';

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  label?: string;
  className?: string;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = MAX_QTY_PER_LINE,
  size = 'md',
  label = 'Quantity',
  className,
}: QuantityStepperProps) {
  const btn = cn(
    'grid place-items-center rounded-full text-ink/70 transition hover:bg-cream hover:text-ink disabled:cursor-not-allowed disabled:opacity-30',
    size === 'sm' ? 'h-7 w-7' : 'h-9 w-9',
  );
  return (
    <div
      role="group"
      aria-label={label}
      className={cn('inline-flex items-center rounded-full border border-line bg-white', size === 'sm' ? 'p-0.5' : 'p-1', className)}
    >
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Decrease quantity">
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span
        className={cn('text-center font-medium tabular-nums', size === 'sm' ? 'w-7 text-sm' : 'w-10 text-[15px]')}
        aria-live="polite"
      >
        {value}
      </span>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity">
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
