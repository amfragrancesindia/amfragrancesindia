import { NextResponse } from 'next/server';
import { sendOrderConfirmation, sendOrderNotification } from '@/lib/email';
import { orderToEmailData } from '@/lib/orders';
import { isDatabaseConfigured, prisma } from '@/lib/prisma';
import { verifyWebhookSignature } from '@/lib/razorpay';

// Razorpay webhook: https://razorpay.com/docs/webhooks/
// Configure the URL https://<your-domain>/api/payment/webhook with the
// events payment.captured, payment.failed and order.paid, and put the secret
// in RAZORPAY_WEBHOOK_SECRET. Requests without a valid signature are rejected.
export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get('x-razorpay-signature') ?? '';
  if (!verifyWebhookSignature(raw, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let event: {
    event?: string;
    payload?: { payment?: { entity?: { id?: string; order_id?: string } }; order?: { entity?: { id?: string } } };
  };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  if (!isDatabaseConfigured()) return NextResponse.json({ received: true });

  const payment = event.payload?.payment?.entity;
  const razorpayOrderId = payment?.order_id ?? event.payload?.order?.entity?.id;
  if (!razorpayOrderId) return NextResponse.json({ received: true });

  try {
    if (event.event === 'payment.captured' || event.event === 'order.paid') {
      const { count } = await prisma.order.updateMany({
        where: { razorpayOrderId, paymentStatus: { not: 'PAID' } },
        data: {
          paymentStatus: 'PAID',
          status: 'CONFIRMED',
          ...(payment?.id ? { razorpayPaymentId: payment.id, paymentId: payment.id } : {}),
        },
      });
      if (count === 1) {
        const order = await prisma.order.findUnique({ where: { razorpayOrderId }, include: { items: true } });
        if (order) {
          const data = orderToEmailData(order);
          await Promise.allSettled([sendOrderConfirmation(data), sendOrderNotification(data)]);
        }
      }
    } else if (event.event === 'payment.failed') {
      await prisma.order.updateMany({
        where: { razorpayOrderId, paymentStatus: 'PENDING' },
        data: { paymentStatus: 'FAILED' },
      });
    }
  } catch (error) {
    console.error('[webhook] failed to process', event.event, error);
    // A 5xx makes Razorpay retry later.
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
