import crypto from 'crypto';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { isDatabaseConfigured, prisma } from '@/lib/prisma';
import { rateLimit, tooManyRequests } from '@/lib/rate-limit';
import { fieldErrors, resetPasswordSchema } from '@/lib/validations';

export async function POST(req: Request) {
  if (!(await rateLimit(req, 'reset-password', 8, 900))) return tooManyRequests();
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: 'Password reset is not available right now.' }, { status: 503 });
  }

  const parsed = resetPasswordSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please check the highlighted fields.', fields: fieldErrors(parsed.error) }, { status: 400 });
  }
  const { email, token, password } = parsed.data;
  const identifier = `reset:${email}`;
  const hashed = crypto.createHash('sha256').update(token).digest('hex');

  const invalid = () =>
    NextResponse.json({ error: 'This reset link is invalid or has expired. Please request a new one.' }, { status: 400 });

  try {
    const where = { identifier, token: hashed, expires: { gt: new Date() } };
    // Cheap check first, so invalid links never cost a password hash.
    if (!(await prisma.verificationToken.findFirst({ where, select: { token: true } }))) return invalid();
    const passwordHash = await bcrypt.hash(password, 12);
    // Deleting the token is the single-statement "use once" step (D1 has no
    // transactions), so the same link can never be used twice.
    const used = await prisma.verificationToken.deleteMany({ where });
    if (used.count === 0) return invalid();
    await prisma.user.update({
      where: { email },
      // Receiving the email proves ownership of the address. Bumping the
      // session version signs out every existing session on the account.
      data: { password: passwordHash, emailVerified: new Date(), sessionVersion: { increment: 1 } },
    });
    await prisma.verificationToken.deleteMany({ where: { identifier } });
  } catch (error) {
    console.error('[reset-password] failed', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Your password has been updated. You can now sign in.' });
}
