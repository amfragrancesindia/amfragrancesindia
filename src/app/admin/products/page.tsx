import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CATEGORY_LABELS, GENDER_LABELS, products } from '@/lib/catalog';
import { formatPrice } from '@/lib/utils';
import { requireAdmin } from '@/lib/auth';

export const metadata: Metadata = { title: 'Products' };

export default async function AdminProductsPage() {
  await requireAdmin('/admin/products');
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
      <p className="text-muted">
        The catalogue lives in <code className="rounded bg-white px-1.5 py-0.5 text-[13px]">src/lib/catalog.ts</code> — edit prices, sizes, stock
        and images there and redeploy.
      </p>
      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-soft">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-line text-muted">
            <tr>
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">For</th>
              <th className="px-5 py-3 font-medium">Type</th>
              <th className="px-5 py-3 font-medium">Sizes &amp; prices</th>
              <th className="px-5 py-3 font-medium">Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {products.map((p) => (
              <tr key={p.slug}>
                <td className="px-5 py-3">
                  <Link href={`/products/${p.slug}`} className="flex items-center gap-3 font-medium hover:text-brand">
                    <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-cream">
                      <Image src={p.images[0]} alt="" fill sizes="44px" className="object-cover" />
                    </span>
                    {p.name}
                  </Link>
                </td>
                <td className="px-5 py-3">{GENDER_LABELS[p.gender]}</td>
                <td className="px-5 py-3">{CATEGORY_LABELS[p.category]}</td>
                <td className="px-5 py-3">
                  {p.variants.map((v) => (
                    <span key={v.id} className="block">
                      {v.size}: {formatPrice(v.price)} <span className="text-muted line-through">{formatPrice(v.mrp)}</span>
                    </span>
                  ))}
                </td>
                <td className="px-5 py-3">
                  {p.variants.map((v) => (
                    <span key={v.id} className={`block ${v.inStock ? 'text-success' : 'text-danger'}`}>
                      {v.inStock ? 'In stock' : 'Sold out'}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
