import { NextResponse } from 'next/server';
import { errorCode } from './admin-api';
import { prisma } from './prisma';

/** Only one product is featured on the home page at a time. */
export async function unfeatureOthers(id: string) {
  await prisma.product.updateMany({ where: { featured: true, id: { not: id } }, data: { featured: false } });
}

export function productSaveFailed(error: unknown) {
  if (errorCode(error) === 'P2002') {
    return NextResponse.json(
      { error: 'Another product already uses this page address.', fields: { slug: 'Another product already uses this address' } },
      { status: 409 },
    );
  }
  console.error('[admin/products] save failed', error);
  return NextResponse.json({ error: 'The product could not be saved. Please try again.' }, { status: 500 });
}
