import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature') || '';

    // Verify webhook signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body);
    console.log('Webhook event:', event.event);

    // Handle payment captured event
    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;

      // Update order status to CONFIRMED
      await prisma.order.updateMany({
        where: { razorpayOrderId: orderId },
        data: {
          status: 'CONFIRMED',
          paymentId: payment.id,
          razorpayPaymentId: payment.id,
        },
      });

      console.log('Order confirmed:', orderId);
      return NextResponse.json({ status: 'ok' });
    }

    // Handle payment failed event
    if (event.event === 'payment.failed') {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;

      await prisma.order.updateMany({
        where: { razorpayOrderId: orderId },
        data: {
          status: 'CANCELLED',
          paymentId: payment.id,
          razorpayPaymentId: payment.id,
        },
      });

      console.log('Payment failed:', payment.id);
      return NextResponse.json({ status: 'ok' });
    }

    // Handle order paid event
    if (event.event === 'order.paid') {
      const order = event.payload.order.entity;
      console.log('Order paid:', order.id);
      return NextResponse.json({ status: 'ok' });
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
