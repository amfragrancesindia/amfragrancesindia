import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { isDatabaseConfigured, prisma } from '@/lib/prisma';
import { fieldErrors, profileSchema } from '@/lib/validations';

export async function PATCH(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });
  if (!isDatabaseConfigured()) return NextResponse.json({ error: 'Accounts are not available right now.' }, { status: 503 });

  const parsed = profileSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please check the highlighted fields.', fields: fieldErrors(parsed.error) }, { status: 400 });
  }
  try {
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { name: parsed.data.name, phone: parsed.data.phone || null },
      select: { name: true, phone: true },
    });
    return NextResponse.json({ message: 'Profile updated.', user: updated });
  } catch (error) {
    console.error('[account/profile] failed', error);
    return NextResponse.json({ error: 'We could not update your profile.' }, { status: 500 });
  }
}
