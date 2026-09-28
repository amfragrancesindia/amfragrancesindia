import Link from 'next/link';
import { cn } from '@/lib/utils';

/** Stacked "AM / FRAGRANCES" wordmark, matching the lettering on the bottles. */
export function Logo({ className, size = 'md' }: { className?: string; size?: 'md' | 'lg' }) {
  return (
    <Link href="/" aria-label="AM Fragrances — home" className={cn('inline-flex flex-col items-center leading-none', className)}>
      <span
        className={cn(
          'font-logo font-normal',
          size === 'lg' ? 'text-[40px] tracking-[0.3em] pl-[0.3em]' : 'text-[26px] tracking-[0.28em] pl-[0.28em] lg:text-[32px]',
        )}
      >
        AM
      </span>
      <span
        className={cn(
          'font-logo',
          size === 'lg' ? 'mt-1.5 text-[11px] tracking-[0.55em] pl-[0.55em]' : 'mt-1 text-[8px] tracking-[0.5em] pl-[0.5em] lg:text-[9.5px]',
        )}
      >
        FRAGRANCES
      </span>
    </Link>
  );
}
