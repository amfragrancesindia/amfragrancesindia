import { NextResponse } from 'next/server';
import { guardAdminRequest } from '@/lib/admin-api';
import { productSaveFailed, unfeatureOthers } from '@/lib/admin-products';
import { prisma } from '@/lib/prisma';
import { productInput, toProductData } from '@/lib/product-input';
import { fieldErrors } from '@/lib/validations';

export async function POST(req: Request) {
  const denied = await guardAdminRequest(req);
  if (denied) return denied;

  const parsed = productInput.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please check the highlighted fields.', fields: fieldErrors(parsed.error) }, { status: 400 });
  }
  try {
    const product = await prisma.product.create({ data: toProductData(parsed.data), select: { id: true, slug: true } });
    if (parsed.data.featured) await unfeatureOthers(product.id);
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    return productSaveFailed(error);
  }
}
