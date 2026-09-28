import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { isEmailConfigured, sendPasswordReset } from '@/lib/email';
import { isDatabaseConfigured, prisma } from '@/lib/prisma';
import { rateLimit, tooManyRequests } from '@/lib/rate-limit';
import { absoluteUrl } from '@/lib/utils';
import { forgotPasswordSchema } from '@/lib/validations';

const GENERIC = 'If an account exists for this email, a reset link is on its way. It expires in 1 hour.';

export async function POST(req: Request) {
  if (!(await rateLimit(req, 'forgot-password', 5, 900))) return tooManyRequests();
  // Without email the link could never arrive, so don't claim it was sent.
  // (Depends only on server configuration, so it reveals nothing about accounts.)
  if (!isDatabaseConfigured() || (process.env.NODE_ENV === 'production' && !isEmailConfigured())) {
    return NextResponse.json(
      { error: 'Password reset by email is not available right now. Please contact us and we’ll help you sign in.' },
      { status: 503 },
    );
  }

  const parsed = forgotPasswordSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  const { email } = parsed.data;

  try {
    const user = await prisma.user.findUnique({ where: { email }, select: { id: true, isActive: true } });
    if (user?.isActive) {
      const token = crypto.randomBytes(32).toString('hex');
      const identifier = `reset:${email}`;
      // Only the hash is stored, so a database leak can't be used to reset passwords.
      await prisma.verificationToken.deleteMany({ where: { identifier } });
      await prisma.verificationToken.create({
        data: {
          identifier,
          token: crypto.createHash('sha256').update(token).digest('hex'),
          expires: new Date(Date.now() + 60 * 60 * 1000),
        },
      });
      await sendPasswordReset(email, absoluteUrl(`/reset-password?token=${token}&email=${encodeURIComponent(email)}`));
    }
  } catch (error) {
    console.error('[forgot-password] failed', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }

  // Same answer whether or not the account exists (no account enumeration).
  return NextResponse.json({ message: GENERIC });
}
