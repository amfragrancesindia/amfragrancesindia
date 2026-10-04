'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, RotateCcw, ShoppingCart, Truck, Wallet } from 'lucide-react';
import { useCart } from '@/components/providers/CartProvider';
import { Button, buttonVariants } from '@/components/ui/Button';
import { Price } from '@/components/ui/Price';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { getVariant, type Product } from '@/lib/catalog';
import { site } from '@/lib/site';
import { cn } from '@/lib/utils';
import { orderMessage, whatsappOrderLink } from '@/lib/whatsapp';
import { copyOrderForChat } from './ProductCardActions';
import { WishlistButton } from './WishlistButton';

interface PurchasePanelProps {
  product: Product;
  /** Compact layout for the home page "Featured Perfume" card. */
  compact?: boolean;
  headingLevel?: 'h1' | 'h3';
}

export function PurchasePanel({ product, compact, headingLevel = 'h1' }: PurchasePanelProps) {
  const { addItem } = useCart();
  const [variantId, setVariantId] = useState((product.variants.find((v) => v.inStock) ?? product.variants[0]).id);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const variant = getVariant(product, variantId);
  const Heading = headingLevel;

  const addToCart = () => {
    addItem(product.slug, variant.id, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  // Buy Now opens WhatsApp with this order (copied for pasting while the store's number isn't set).
  const message = orderMessage(product, variant, quantity);

  return (
    <div>
      <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-gold">
        {variant.size} · {product.concentration}
      </p>
      <Heading
        className={cn(
          'mt-2 font-medium tracking-tight text-navy',
          compact ? 'text-3xl sm:text-[36px]' : 'text-[32px] leading-tight sm:text-[40px]',
        )}
      >
        {compact ? <Link href={`/products/${product.slug}`} className="hover:text-brand">{product.name}</Link> : product.name}
      </Heading>
      <p className={cn('mt-3 text-[15.5px] leading-relaxed text-ink/70', compact && 'line-clamp-3')}>
        {compact ? product.description : product.tagline}
      </p>

      <div className="mt-5">
        <Price price={variant.price} mrp={variant.mrp} size="lg" />
        <p className="mt-1 text-[13px] text-muted">Inclusive of all taxes</p>
      </div>

      {product.variants.length > 1 && (
        <fieldset className="mt-6">
          <legend className="mb-2.5 text-sm font-semibold text-ink">Size</legend>
          <div className="flex flex-wrap gap-2.5">
            {product.variants.map((v) => {
              const selected = v.id === variant.id;
              return (
                <label
                  key={v.id}
                  className={cn(
                    'relative flex cursor-pointer flex-col rounded-xl border px-4 py-2.5 text-left transition',
                    selected ? 'border-brand-light bg-white ring-1 ring-brand-light' : 'border-line bg-white/70 hover:border-ink/40',
                    !v.inStock && 'cursor-not-allowed opacity-50',
                  )}
                >
                  <input
                    type="radio"
                    name={`size-${product.slug}`}
                    value={v.id}
                    checked={selected}
                    disabled={!v.inStock}
                    onChange={() => setVariantId(v.id)}
                    className="sr-only"
                  />
                  <span className="text-[15px] font-semibold">{v.size}</span>
                  <span className="text-[13px] text-muted">{v.inStock ? `₹${v.price.toLocaleString('en-IN')}` : 'Sold out'}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      <div className="mt-6">
        <p className="mb-2.5 text-sm font-semibold text-ink">Quantity</p>
        <QuantityStepper value={quantity} onChange={setQuantity} />
      </div>

      <div className="mt-7 flex items-center gap-2.5 sm:gap-3">
        <Button variant="outline" size="lg" className="min-w-0 flex-1 px-3 sm:px-6" onClick={addToCart} disabled={!variant.inStock}>
          {added ? <Check className="h-5 w-5 shrink-0" /> : <ShoppingCart className="h-5 w-5 shrink-0" />}
          {added ? 'Added' : 'Add to Cart'}
        </Button>
        <a
          href={whatsappOrderLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => copyOrderForChat(message)}
          aria-disabled={!variant.inStock || undefined}
          title="Order on WhatsApp"
          className={cn(
            buttonVariants({ size: 'lg' }),
            'min-w-0 flex-1 bg-[#25D366] px-3 text-white hover:bg-[#1DA851] sm:px-6',
            !variant.inStock && 'pointer-events-none opacity-50',
          )}
        >
          <WhatsAppIcon className="h-5 w-5 shrink-0" />
          Buy Now
        </a>
        {!compact && <WishlistButton slug={product.slug} name={product.name} variant="outline" className="shrink-0" />}
      </div>
      {!variant.inStock && <p className="mt-3 text-sm font-medium text-danger">This size is currently sold out.</p>}

      {!compact && (
        <ul className="mt-8 grid grid-cols-1 gap-3 rounded-2xl border border-line bg-cream/60 p-5 text-[14px] text-ink/80 sm:grid-cols-2">
          <li className="flex items-center gap-3">
            <Truck className="h-5 w-5 shrink-0 text-brand" /> Free shipping above ₹{site.shipping.freeThreshold.toLocaleString('en-IN')}
          </li>
          <li className="flex items-center gap-3">
            <Wallet className="h-5 w-5 shrink-0 text-brand" /> Cash on Delivery available
          </li>
          <li className="flex items-center gap-3">
            <RotateCcw className="h-5 w-5 shrink-0 text-brand" /> {site.returns.days}-day returns on unopened items
          </li>
          <li className="flex items-center gap-3">
            <WhatsAppIcon className="h-5 w-5 shrink-0 text-brand" /> Order on WhatsApp
          </li>
        </ul>
      )}
    </div>
  );
}
