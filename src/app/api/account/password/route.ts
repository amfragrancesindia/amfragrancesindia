import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getSessionUser } from '@/lib/auth';
import { isDatabaseConfigured, prisma } from '@/lib/prisma';
import { rateLimit, tooManyRequests } from '@/lib/rate-limit';
import { changePasswordSchema, fieldErrors } from '@/lib/validations';

export async function POST(req: Request) {
  if (!(await rateLimit(req, 'change-password', 6, 900))) return tooManyRequests();
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });
  if (!isDatabaseConfigured()) return NextResponse.json({ error: 'Accounts are not available right now.' }, { status: 503 });

  const parsed = changePasswordSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please check the highlighted fields.', fields: fieldErrors(parsed.error) }, { status: 400 });
  }

  const record = await prisma.user.findUnique({ where: { id: user.id }, select: { password: true } });
  if (!record) return NextResponse.json({ error: 'Account not found.' }, { status: 404 });
  if (!record.password) {
    return NextResponse.json(
      { error: 'Your account uses Google sign-in. Use “Forgot password” on the sign-in page to create a password.' },
      { status: 400 },
    );
  }
  if (!(await bcrypt.compare(parsed.data.currentPassword, record.password))) {
    return NextResponse.json({ error: 'Your current password is incorrect.', fields: { currentPassword: 'Incorrect password' } }, { status: 400 });
  }

  // Changing the password ends all sessions, including this one.
  await prisma.user.update({
    where: { id: user.id },
    data: { password: await bcrypt.hash(parsed.data.newPassword, 12), sessionVersion: { increment: 1 } },
  });
  return NextResponse.json({ message: 'Password changed. Please sign in again with your new password.' });
}
