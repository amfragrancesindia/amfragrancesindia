import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: string;
  as?: 'h1' | 'h2';
  action?: { href: string; label: string };
  className?: string;
}

/** Section title followed by a hairline rule, in the style of the reference site. */
export function SectionHeading({ title, as: Tag = 'h2', action, className }: SectionHeadingProps) {
  return (
    <div className={cn('flex items-center gap-5 sm:gap-8', className)}>
      <Tag className="shrink-0 text-[22px] font-semibold tracking-tight text-ink sm:text-2xl">{title}</Tag>
      <span className="h-px flex-1 bg-line" aria-hidden />
      {action && (
        <Link
          href={action.href}
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-brand hover:text-ink"
        >
          {action.label}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Link>
      )}
    </div>
  );
}
