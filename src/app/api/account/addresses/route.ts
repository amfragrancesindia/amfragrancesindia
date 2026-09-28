import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionUser } from '@/lib/auth';
import { isDatabaseConfigured, prisma } from '@/lib/prisma';
import { addressSchema, fieldErrors } from '@/lib/validations';

const createSchema = addressSchema.extend({ isDefault: z.boolean().optional() });
const MAX_ADDRESSES = 10;

async function guard() {
  const user = await getSessionUser();
  if (!user) return { response: NextResponse.json({ error: 'Please sign in.' }, { status: 401 }) };
  if (!isDatabaseConfigured()) return { response: NextResponse.json({ error: 'Accounts are not available right now.' }, { status: 503 }) };
  return { user };
}

export async function GET() {
  const { user, response } = await guard();
  if (!user) return response;
  const addresses = await prisma.address.findMany({
    where: { userId: user.id },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
  });
  return NextResponse.json({ addresses });
}

export async function POST(req: Request) {
  const { user, response } = await guard();
  if (!user) return response;

  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please check the highlighted fields.', fields: fieldErrors(parsed.error) }, { status: 400 });
  }
  const count = await prisma.address.count({ where: { userId: user.id } });
  if (count >= MAX_ADDRESSES) {
    return NextResponse.json({ error: `You can save up to ${MAX_ADDRESSES} addresses.` }, { status: 400 });
  }
  const { isDefault, line2, ...rest } = parsed.data;
  const makeDefault = isDefault || count === 0;

  const address = await prisma.address.create({
    data: { ...rest, line2: line2 || null, isDefault: makeDefault, userId: user.id },
  });
  // D1 has no transactions, so the new default is saved before the old one is
  // cleared: an interruption can leave two defaults, never none.
  if (makeDefault) {
    await prisma.address.updateMany({ where: { userId: user.id, id: { not: address.id } }, data: { isDefault: false } });
  }
  return NextResponse.json({ address }, { status: 201 });
}
