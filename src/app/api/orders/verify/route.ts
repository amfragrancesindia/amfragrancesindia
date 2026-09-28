import { NextResponse, after } from 'next/server';
import { sendOrderConfirmation, sendOrderNotification } from '@/lib/email';
import { orderToEmailData } from '@/lib/orders';
import { isDatabaseConfigured, prisma } from '@/lib/prisma';
import { verifyPaymentSignature } from '@/lib/razorpay';
import { rateLimit, tooManyRequests } from '@/lib/rate-limit';
import { verifyPaymentSchema } from '@/lib/validations';

export async function POST(req: Request) {
  if (!(await rateLimit(req, 'verify', 20, 60))) return tooManyRequests();
  if (!isDatabaseConfigured()) return NextResponse.json({ error: 'Payments are not available.' }, { status: 503 });

  const parsed = verifyPaymentSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payment details.' }, { status: 400 });
  const { orderNumber, razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;

  const order = await prisma.order.findUnique({ where: { orderNumber }, include: { items: true } });
  if (!order || order.razorpayOrderId !== razorpay_order_id) {
    return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
  }
  if (!verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
    return NextResponse.json({ error: 'Payment could not be verified.' }, { status: 400 });
  }

  // Only the request that flips the order to PAID sends the emails, so a
  // retry or the webhook arriving first never duplicates them.
  const { count } = await prisma.order.updateMany({
    where: { id: order.id, paymentStatus: { not: 'PAID' } },
    data: { paymentStatus: 'PAID', status: 'CONFIRMED', razorpayPaymentId: razorpay_payment_id, paymentId: razorpay_payment_id },
  });

  let emailSent = false;
  if (count === 1) {
    const data = orderToEmailData(order);
    emailSent = await sendOrderConfirmation(data);
    after(() => sendOrderNotification(data));
  }
  return NextResponse.json({ ok: true, emailSent });
}
