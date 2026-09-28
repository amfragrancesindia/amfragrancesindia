import crypto from 'crypto';

export function isRazorpayConfigured(): boolean {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

/** Creates a Razorpay order through the REST API (the Node SDK doesn't run on Workers). */
export async function createRazorpayOrder(amountInRupees: number, receipt: string, notes: Record<string, string> = {}) {
  if (!isRazorpayConfigured()) throw new Error('Razorpay is not configured');
  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`)}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount: Math.round(amountInRupees * 100), currency: 'INR', receipt, notes }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Razorpay returned ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const order = (await res.json()) as { id: string; amount: number; currency: string };
  return { id: order.id, amount: Number(order.amount), currency: order.currency };
}

function safeEqualHex(expected: string, received: string): boolean {
  if (!/^[a-f0-9]+$/i.test(received) || expected.length !== received.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(received, 'hex'));
}

/** Verifies the signature Razorpay Checkout returns after a successful payment. */
export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;
  const expected = crypto.createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex');
  return safeEqualHex(expected, signature);
}

/** Verifies a webhook body. Returns false when no webhook secret is configured. */
export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  return safeEqualHex(expected, signature);
}
