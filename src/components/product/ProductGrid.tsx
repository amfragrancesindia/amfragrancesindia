import type { Product } from '@/lib/catalog';
import { cn } from '@/lib/utils';
import { ProductCard } from './ProductCard';

export function ProductGrid({ products, className, priorityCount = 0 }: { products: Product[]; className?: string; priorityCount?: number }) {
  return (
    <ul className={cn('grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4', className)}>
      {products.map((product, i) => (
        <li key={product.slug} className="flex">
          <ProductCard product={product} priority={i < priorityCount} className="w-full" />
        </li>
      ))}
    </ul>
  );
}
