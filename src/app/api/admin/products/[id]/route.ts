import { NextResponse } from 'next/server';
import { errorCode, guardAdminRequest } from '@/lib/admin-api';
import { productSaveFailed, unfeatureOthers } from '@/lib/admin-products';
import { prisma } from '@/lib/prisma';
import { productInput, toProductData } from '@/lib/product-input';
import { fieldErrors } from '@/lib/validations';

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  const denied = await guardAdminRequest(req);
  if (denied) return denied;
  const { id } = await params;

  const parsed = productInput.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please check the highlighted fields.', fields: fieldErrors(parsed.error) }, { status: 400 });
  }
  try {
    // One single-row write: the product is never half-saved.
    const product = await prisma.product.update({ where: { id }, data: toProductData(parsed.data), select: { id: true, slug: true } });
    if (parsed.data.featured) await unfeatureOthers(product.id);
    return NextResponse.json({ product });
  } catch (error) {
    if (errorCode(error) === 'P2025') return NextResponse.json({ error: 'This product no longer exists.' }, { status: 404 });
    return productSaveFailed(error);
  }
}

export async function DELETE(req: Request, { params }: Ctx) {
  const denied = await guardAdminRequest(req);
  if (denied) return denied;
  const { id } = await params;
  try {
    // Past orders keep their own copy of the product name, size and price.
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (errorCode(error) === 'P2025') return NextResponse.json({ error: 'This product no longer exists.' }, { status: 404 });
    console.error('[admin/products] delete failed', error);
    return NextResponse.json({ error: 'The product could not be deleted. Please try again.' }, { status: 500 });
  }
}
