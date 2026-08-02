import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/product';
import { StarRating } from '@/components/ui/StarRating';
import { formatPrice } from '@/lib/utils';
import { Heart } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-[3/4] bg-luxury-dark rounded-lg overflow-hidden mb-4">
          {!imageError ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-luxury-muted">
              No Image
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <span className="px-2 py-1 bg-green-500 text-luxury-black text-xs font-medium uppercase tracking-wider">
                New
              </span>
            )}
            {discount > 0 && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium uppercase tracking-wider">
                -{discount}%
              </span>
            )}
            {product.isLimited && (
              <span className="px-2 py-1 bg-purple-500 text-white text-xs font-medium uppercase tracking-wider">
                Limited
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div
            className={cn(
              'absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300',
              isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
            )}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsWishlisted(!isWishlisted);
              }}
              className={cn(
                'p-2 rounded-full backdrop-blur-md transition-colors',
                isWishlisted
                  ? 'bg-red-500 text-white'
                  : 'bg-luxury-black/50 text-luxury-light hover:text-gold-500'
              )}
            >
              <Heart className={cn('h-4 w-4', isWishlisted && 'fill-current')} />
            </button>
          </div>

          {/* Quick Add to Cart (appears on hover) */}
          {isHovered && product.stock > 0 && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-luxury-black/80 to-transparent">
              <button className="w-full py-2 bg-gold-500 text-luxury-black text-sm font-medium rounded hover:bg-gold-400 transition-colors">
                Quick Add
              </button>
            </div>
          )}

          {/* Out of Stock Overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-luxury-black/50 flex items-center justify-center">
              <span className="px-4 py-2 bg-luxury-black text-luxury-light text-sm font-medium">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="space-y-2">
        <p className="text-xs text-luxury-muted uppercase tracking-wider">
          {product.category.replace(/_/g, ' ')}
        </p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-serif text-lg text-luxury-light group-hover:text-gold-500 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <StarRating rating={product.rating} size="sm" />
          <span className="text-xs text-luxury-muted">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-gold-500">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="text-sm text-luxury-muted line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}
