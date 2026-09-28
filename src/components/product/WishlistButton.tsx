'use client';

import { Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '@/components/providers/CartProvider';
import { cn } from '@/lib/utils';

interface WishlistButtonProps {
  slug: string;
  name: string;
  className?: string;
  variant?: 'floating' | 'outline';
}

export function WishlistButton({ slug, name, className, variant = 'floating' }: WishlistButtonProps) {
  const { isWishlisted, toggleWishlist, hydrated } = useCart();
  const active = hydrated && isWishlisted(slug);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const added = toggleWishlist(slug);
        toast.success(added ? `${name} saved to your wishlist` : `${name} removed from your wishlist`);
      }}
      aria-pressed={active}
      aria-label={active ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
      className={cn(
        'grid place-items-center rounded-full transition',
        variant === 'floating'
          ? 'h-8 w-8 bg-white/90 text-ink shadow-sm ring-1 ring-black/5 backdrop-blur hover:bg-white'
          : 'h-12 w-12 border border-line bg-white text-ink hover:border-ink',
        className,
      )}
    >
      <Heart className={cn('h-4 w-4 transition', variant === 'outline' && 'h-5 w-5', active && 'fill-danger text-danger')} />
    </button>
  );
}
