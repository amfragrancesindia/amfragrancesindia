import { cn } from '@/lib/utils';

const STYLES: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-800 ring-amber-200',
  CONFIRMED: 'bg-sky-50 text-sky-800 ring-sky-200',
  PROCESSING: 'bg-indigo-50 text-indigo-800 ring-indigo-200',
  SHIPPED: 'bg-violet-50 text-violet-800 ring-violet-200',
  DELIVERED: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  CANCELLED: 'bg-rose-50 text-rose-800 ring-rose-200',
  RETURNED: 'bg-stone-100 text-stone-700 ring-stone-200',
  PAID: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  FAILED: 'bg-rose-50 text-rose-800 ring-rose-200',
  REFUNDED: 'bg-stone-100 text-stone-700 ring-stone-200',
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[11.5px] font-semibold uppercase tracking-wide ring-1 ring-inset',
        STYLES[status] ?? 'bg-cream text-ink ring-line',
        className,
      )}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}
