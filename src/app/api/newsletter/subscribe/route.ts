import { NextResponse } from 'next/server';
import { isDatabaseConfigured, prisma } from '@/lib/prisma';
import { rateLimit, tooManyRequests } from '@/lib/rate-limit';
import { newsletterSchema } from '@/lib/validations';

export async function POST(req: Request) {
  if (!(await rateLimit(req, 'newsletter', 5, 600))) return tooManyRequests();

  const parsed = newsletterSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });

  if (!isDatabaseConfigured()) {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Sign-ups are paused right now. Please try again later.' }, { status: 503 });
    }
    console.info('[newsletter] development mode — subscriber not stored:', parsed.data.email);
    return NextResponse.json({ message: 'You’re on the list. Thank you!' });
  }

  try {
    await prisma.newsletterSubscriber.upsert({
      where: { email: parsed.data.email },
      update: { isActive: true },
      create: { email: parsed.data.email },
    });
    return NextResponse.json({ message: 'You’re on the list. Thank you!' });
  } catch (error) {
    console.error('[newsletter] could not save subscriber', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
