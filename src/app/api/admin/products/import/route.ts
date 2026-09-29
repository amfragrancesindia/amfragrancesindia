import { NextResponse } from 'next/server';
import { guardAdminRequest } from '@/lib/admin-api';
import { prisma } from '@/lib/prisma';
import { productInput, productToInput, toProductData } from '@/lib/product-input';
import { STARTER_PRODUCTS } from '@/lib/starter-products';

/** Copies the store's original products into the database (skips any already there). */
export async function POST(req: Request) {
  const denied = await guardAdminRequest(req);
  if (denied) return denied;

  const existing = new Set((await prisma.product.findMany({ select: { slug: true } })).map((p) => p.slug));
  const anyFeatured = (await prisma.product.count({ where: { featured: true } })) > 0;
  let created = 0;
  for (const starter of STARTER_PRODUCTS) {
    if (existing.has(starter.slug)) continue;
    const input = productInput.parse({ ...productToInput(starter), featured: !!starter.featured && !anyFeatured });
    await prisma.product.create({ data: toProductData(input) });
    created += 1;
  }
  return NextResponse.json({ created, skipped: STARTER_PRODUCTS.length - created });
}
