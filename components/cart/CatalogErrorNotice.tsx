'use client';

import { RefreshCw, WifiOff } from 'lucide-react';
import { useCart } from '@/components/providers/CartProvider';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

/** Shown when the current prices couldn't be loaded (usually a network hiccup). */
export function CatalogErrorNotice({ className }: { className?: string }) {
  const { reloadCatalog } = useCart();
  return (
    <div className={cn('mx-auto max-w-md py-10 text-center', className)} role="alert">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-cream">
        <WifiOff className="h-7 w-7 text-brand" />
      </span>
      <h2 className="mt-5 text-xl font-semibold">We couldn’t load the latest prices</h2>
      <p className="mt-2 text-muted">Your items are safe. Please check your connection and try again.</p>
      <Button variant="outline" className="mt-6" onClick={reloadCatalog}>
        <RefreshCw className="h-4 w-4" /> Try again
      </Button>
    </div>
  );
}
