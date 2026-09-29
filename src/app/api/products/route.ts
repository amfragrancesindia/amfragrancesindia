import { NextResponse } from 'next/server';
import { findProduct, queryProducts, type Product } from '@/lib/catalog';
import { getStoreProducts } from '@/lib/products';

// Public catalogue API (read-only). Supports ?q=, ?gender=, ?category=,
// ?sort= and ?slugs=a,b,c.
export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const products = await getStoreProducts();
  const slugs = params.get('slugs');
  const list: Product[] = slugs
    ? slugs
        .split(',')
        .slice(0, 50)
        .map((s) => findProduct(products, s.trim()))
        .filter((p): p is Product => !!p)
    : queryProducts(products, {
        q: params.get('q')?.slice(0, 80) ?? undefined,
        gender: params.get('gender') ?? undefined,
        category: params.get('category') ?? undefined,
        sort: params.get('sort') ?? undefined,
      });
  // Never cached: the cart prices from this, and checkout charges the database price.
  return NextResponse.json({ products: list, count: list.length }, { headers: { 'Cache-Control': 'no-store' } });
}
