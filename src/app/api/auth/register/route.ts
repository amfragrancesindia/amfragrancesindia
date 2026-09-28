import { NextResponse, after } from 'next/server';
import bcrypt from 'bcryptjs';
import { sendWelcomeEmail } from '@/lib/email';
import { isDatabaseConfigured, prisma } from '@/lib/prisma';
import { rateLimit, tooManyRequests } from '@/lib/rate-limit';
import { fieldErrors, registerSchema } from '@/lib/validations';

export async function POST(req: Request) {
  if (!(await rateLimit(req, 'register', 5, 600))) return tooManyRequests();
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: 'Account registration is not available right now.' }, { status: 503 });
  }

  const parsed = registerSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please check the highlighted fields.', fields: fieldErrors(parsed.error) }, { status: 400 });
  }
  const { name, email, phone, password } = parsed.data;

  try {
    const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please sign in instead.', fields: { email: 'This email is already registered' } },
        { status: 409 },
      );
    }
    await prisma.user.create({
      data: { name, email, phone: phone || null, password: await bcrypt.hash(password, 12), role: 'CUSTOMER' },
    });
  } catch (error) {
    console.error('[register] failed', error);
    return NextResponse.json({ error: 'We could not create your account. Please try again.' }, { status: 500 });
  }

  after(() => sendWelcomeEmail(email, name));
  return NextResponse.json({ message: 'Account created.' }, { status: 201 });
}
