import Link from 'next/link';
import { site } from '@/lib/site';
import { cn } from '@/lib/utils';

export function AnnouncementBar({ hidden }: { hidden?: boolean }) {
  return (
    <div
      className={cn(
        'overflow-hidden bg-brand text-white transition-[max-height,opacity] duration-300',
        hidden ? 'max-h-0 opacity-0' : 'max-h-9 opacity-100',
      )}
    >
      <p className="container-x flex h-9 items-center justify-center gap-2 text-center text-[12.5px] tracking-wide">
        <span>Free shipping on orders above ₹{site.shipping.freeThreshold.toLocaleString('en-IN')}</span>
        <span className="hidden text-white/50 sm:inline" aria-hidden>
          ·
        </span>
        <span className="hidden sm:inline">
          Use code{' '}
          <Link href="/products" className="font-semibold text-gold-soft underline-offset-2 hover:underline">
            WELCOME10
          </Link>{' '}
          for 10% off
        </span>
      </p>
    </div>
  );
}
