import { NextResponse } from 'next/server';
import { sendContactNotification } from '@/lib/email';
import { isDatabaseConfigured, prisma } from '@/lib/prisma';
import { rateLimit, tooManyRequests } from '@/lib/rate-limit';
import { contactSchema, fieldErrors } from '@/lib/validations';

export async function POST(req: Request) {
  if (!(await rateLimit(req, 'contact', 5, 600))) return tooManyRequests();

  const parsed = contactSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please check the highlighted fields.', fields: fieldErrors(parsed.error) }, { status: 400 });
  }
  const data = { ...parsed.data, phone: parsed.data.phone || undefined };

  let stored = false;
  if (isDatabaseConfigured()) {
    try {
      await prisma.contactInquiry.create({
        data: { name: data.name, email: data.email, phone: data.phone ?? null, subject: data.subject, message: data.message },
      });
      stored = true;
    } catch (error) {
      console.error('[contact] could not save enquiry', error);
    }
  }
  const emailed = await sendContactNotification(data);

  if (!stored && !emailed && process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'We couldn’t send your message right now. Please email or call us directly.' },
      { status: 503 },
    );
  }
  return NextResponse.json({ message: 'Thank you — we’ll get back to you within one business day.' });
}
