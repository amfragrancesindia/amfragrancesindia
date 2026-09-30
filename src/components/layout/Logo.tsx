import Link from 'next/link';
import logo from '@/lib/brand-logo.json';
import { cn } from '@/lib/utils';

interface MarkProps {
  className?: string;
  /** Accessible name; pass null when the logo sits inside an element that is already labelled. */
  title?: string | null;
}

const a11y = (title: string | null | undefined) =>
  title ? { role: 'img' as const, 'aria-label': title } : { 'aria-hidden': true as const };

/** The full AM Fragrances logo — AM monogram above the FRAGRANCES wordmark — drawn in currentColor. */
export function LogoLockup({ className, title = 'AM Fragrances' }: MarkProps) {
  return (
    <svg viewBox={logo.lockup.viewBox} className={className} focusable="false" {...a11y(title)}>
      <path d={logo.monogram.d} fill="currentColor" fillRule="evenodd" />
      <path
        d={logo.wordmark.d}
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={logo.wordmark.strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** The AM monogram on its own, for tight spaces. */
export function Monogram({ className, title = 'AM Fragrances' }: MarkProps) {
  return (
    <svg viewBox={logo.monogram.viewBox} className={className} focusable="false" {...a11y(title)}>
      <path d={logo.monogram.d} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}

/** Home link with the logo, drawn in the current text colour (e.g. text-logo or text-logo-light). */
export function Logo({ className, size = 'md' }: { className?: string; size?: 'md' | 'lg' }) {
  return (
    <Link href="/" aria-label="AM Fragrances — home" className={cn('inline-flex shrink-0', className)}>
      <LogoLockup title={null} className={size === 'lg' ? 'h-[84px] w-auto' : 'h-[46px] w-auto lg:h-[58px]'} />
    </Link>
  );
}
