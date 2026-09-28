import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { isDatabaseConfigured, prisma } from '@/lib/prisma';

type Ctx = { params: Promise<{ id: string }> };

async function owned(ctx: Ctx) {
  const user = await getSessionUser();
  if (!user) return { response: NextResponse.json({ error: 'Please sign in.' }, { status: 401 }) };
  if (!isDatabaseConfigured()) return { response: NextResponse.json({ error: 'Accounts are not available right now.' }, { status: 503 }) };
  const { id } = await ctx.params;
  const address = await prisma.address.findFirst({ where: { id, userId: user.id } });
  if (!address) return { response: NextResponse.json({ error: 'Address not found.' }, { status: 404 }) };
  return { user, address };
}

/** Make this address the default. */
export async function PATCH(_req: Request, ctx: Ctx) {
  const { user, address, response } = await owned(ctx);
  if (!user || !address) return response;
  // D1 has no transactions: set the new default first, then clear the others.
  await prisma.address.update({ where: { id: address.id }, data: { isDefault: true } });
  await prisma.address.updateMany({ where: { userId: user.id, id: { not: address.id } }, data: { isDefault: false } });
  return NextResponse.json({ message: 'Default address updated.' });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const { user, address, response } = await owned(ctx);
  if (!user || !address) return response;
  await prisma.address.delete({ where: { id: address.id } });
  if (address.isDefault) {
    const next = await prisma.address.findFirst({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } });
    if (next) await prisma.address.update({ where: { id: next.id }, data: { isDefault: true } });
  }
  return NextResponse.json({ message: 'Address removed.' });
}
