import { NextResponse } from 'next/server';
import { getProduct, queryProducts, type Product } from '@/lib/catalog';

// Public catalogue API (read-only). Supports ?q=, ?gender=, ?category=,
// ?sort= and ?slugs=a,b,c.
export function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const slugs = params.get('slugs');
  const list: Product[] = slugs
    ? slugs
        .split(',')
        .slice(0, 50)
        .map((s) => getProduct(s.trim()))
        .filter((p): p is Product => !!p)
    : queryProducts({
        q: params.get('q')?.slice(0, 80) ?? undefined,
        gender: params.get('gender') ?? undefined,
        category: params.get('category') ?? undefined,
        sort: params.get('sort') ?? undefined,
      });
  return NextResponse.json({ products: list, count: list.length });
}
