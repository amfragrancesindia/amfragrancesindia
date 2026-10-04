import Image from 'next/image';
import Link from 'next/link';
import { isInStock, startingVariant, type Product } from '@/lib/catalog';
import { Price } from '@/components/ui/Price';
import { cn } from '@/lib/utils';
import { orderMessage } from '@/lib/whatsapp';
import { WhatsAppBuyButton } from './WhatsAppBuyButton';
import { WishlistButton } from './WishlistButton';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  className?: string;
}

export function ProductCard({ product, priority, className }: ProductCardProps) {
  const variant = startingVariant(product);
  const inStock = isInStock(product);
  const href = `/products/${product.slug}`;

  return (
    <article
      className={cn(
        'group relative flex flex-col rounded-2xl border border-line/80 bg-white p-2 transition duration-300 hover:border-line hover:shadow-card sm:p-2.5',
        className,
      )}
    >
      <Link href={href} className="relative block aspect-square overflow-hidden rounded-xl bg-cream" tabIndex={-1} aria-hidden>
        <Image
          src={product.images[0]}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 1280px) 300px, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
        />
        {product.images[1] && (
          <Image
            src={product.images[1]}
            alt=""
            fill
            sizes="(min-width: 1280px) 300px, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="hidden object-cover opacity-0 transition duration-700 ease-out group-hover:opacity-100 lg:block"
          />
        )}
        {(product.badge || !inStock) && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-white/95 px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-wider text-brand shadow-sm">
            {inStock ? product.badge : 'Sold out'}
          </span>
        )}
      </Link>
      <WishlistButton slug={product.slug} name={product.name} className="absolute right-4 top-4 sm:right-5 sm:top-5" />

      <div className="flex flex-1 flex-col px-1 pb-1 pt-3 sm:px-1.5">
        <p className="text-[12px] text-muted">
          {variant.size} · {product.concentration}
        </p>
        <h3 className="mt-1 text-[15px] font-medium leading-snug text-ink sm:text-base">
          <Link href={href} className="hover:text-brand">
            {product.name}
          </Link>
        </h3>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <Price price={variant.price} mrp={variant.mrp} size="sm" />
          {inStock && <WhatsAppBuyButton message={orderMessage(product, variant, 1)} name={product.name} />}
        </div>
      </div>
    </article>
  );
}
