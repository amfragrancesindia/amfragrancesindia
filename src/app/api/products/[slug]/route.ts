import { NextResponse } from 'next/server';
import { getProductPage } from '@/lib/products';

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const product = await getProductPage((await params).slug);
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  return NextResponse.json(product);
}
