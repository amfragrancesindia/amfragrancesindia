import Image from 'next/image';
import Link from 'next/link';
import { PurchasePanel } from '@/components/product/PurchasePanel';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { Product } from '@/lib/catalog';

export function FeaturedProduct({ product }: { product: Product }) {
  const discount = product.variants[0].mrp > product.variants[0].price;
  return (
    <section className="container-x pt-16 sm:pt-20">
      <SectionHeading title="Featured Perfume" />
      <div className="mt-8 grid grid-cols-1 overflow-hidden rounded-2xl border border-line md:grid-cols-2">
        <Link href={`/products/${product.slug}`} className="group relative block aspect-square bg-cream md:aspect-auto md:min-h-[520px]">
          <Image
            src={product.images[1] ?? product.images[0]}
            alt={`${product.name} with its gift box`}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition duration-700 group-hover:scale-[1.03]"
          />
          {discount && (
            <span className="absolute left-4 top-4 rounded-full bg-success px-3 py-1.5 text-xs font-semibold text-white">
              Special price
            </span>
          )}
        </Link>
        <div className="flex items-center bg-cream px-6 py-10 sm:px-10 lg:px-14">
          <div className="w-full">
            <PurchasePanel product={product} compact headingLevel="h3" />
          </div>
        </div>
      </div>
    </section>
  );
}
