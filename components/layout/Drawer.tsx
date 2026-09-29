'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side: 'left' | 'right' | 'top';
  title: string;
  hideTitle?: boolean;
  className?: string;
  children: React.ReactNode;
}

/** Accessible slide-over panel: locks scroll, closes on Escape/backdrop, restores focus. */
export function Drawer({ open, onClose, side, title, hideTitle, className, children }: DrawerProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  // Parents pass inline callbacks; keep the latest one without re-running the
  // open/close effect (which would steal focus on every parent render).
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow, paddingRight } = document.body.style;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    const t = window.setTimeout(() => {
      const preferred = panelRef.current?.querySelector<HTMLElement>('[data-autofocus]');
      (preferred ?? closeRef.current)?.focus();
    }, 50);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
      if (e.key === 'Tab' && panelRef.current) {
        // Keep keyboard focus inside the panel.
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      previouslyFocused?.focus?.();
    };
  }, [open]);

  const variants = {
    left: { initial: { x: '-100%' }, animate: { x: 0 }, exit: { x: '-100%' } },
    right: { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } },
    top: { initial: { y: '-100%' }, animate: { y: 0 }, exit: { y: '-100%' } },
  }[side];

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50" role="presentation">
          <motion.div
            className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={cn(
              'absolute flex flex-col bg-white shadow-2xl',
              side === 'left' && 'inset-y-0 left-0 w-[88%] max-w-sm',
              side === 'right' && 'inset-y-0 right-0 w-full max-w-md',
              side === 'top' && 'inset-x-0 top-0 max-h-[92vh]',
              className,
            )}
            {...variants}
            transition={{ type: 'tween', ease: [0.22, 1, 0.36, 1], duration: 0.4 }}
          >
            <div className={cn('flex items-center justify-between border-b border-line px-5 py-4', hideTitle && 'sr-only')}>
              <h2 className="text-lg font-semibold">{title}</h2>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="grid h-9 w-9 place-items-center rounded-full text-ink/70 transition hover:bg-cream hover:text-ink"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
