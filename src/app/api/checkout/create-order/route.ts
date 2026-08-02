import { NextRequest, NextResponse } from 'next/server';
import { createRazorpayOrder } from '@/lib/payments/razorpay';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, method, orderId } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // For Razorpay-based payment methods
    if (['UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'NET_BANKING', 'WALLET', 'EMI'].includes(method)) {
      try {
        const razorpayOrder = await createRazorpayOrder(amount, orderId);
        return NextResponse.json({
          success: true,
          razorpayOrder,
        });
      } catch (error) {
        console.error('Razorpay order creation failed:', error);
        return NextResponse.json(
          { error: 'Payment gateway error' },
          { status: 500 }
        );
      }
    }

    // For COD
    if (method === 'COD') {
      return NextResponse.json({
        success: true,
        orderId,
      });
    }

    return NextResponse.json(
      { error: 'Unsupported payment method' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
