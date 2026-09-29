import { NextResponse, after } from 'next/server';
import type { Order, OrderItem } from '@prisma/client';
import { getSessionUser } from '@/lib/auth';
import { sendOrderConfirmation, sendOrderNotification, type OrderEmailData } from '@/lib/email';
import { checkoutCapabilities, generateOrderNumber } from '@/lib/orders';
import { computeTotals, priceCart } from '@/lib/pricing';
import { prisma } from '@/lib/prisma';
import { storeLookup } from '@/lib/products';
import { createRazorpayOrder } from '@/lib/razorpay';
import { rateLimit, tooManyRequests } from '@/lib/rate-limit';
import { checkoutSchema, fieldErrors } from '@/lib/validations';

/** Response for a checkout that was already submitted with the same key. */
function existingOrderResponse(order: Order & { items: OrderItem[] }) {
  const online = order.paymentMethod === 'ONLINE';
  const paid = order.paymentStatus === 'PAID';
  return NextResponse.json({
    orderNumber: order.orderNumber,
    paymentMethod: online ? 'ONLINE' : 'COD',
    totals: { subtotal: order.subtotal, discount: order.discount, shipping: order.shipping, total: order.total },
    items: order.items.map((i) => ({ name: i.name, size: i.variantLabel, quantity: i.quantity, lineTotal: i.total, image: i.image })),
    emailSent: false,
    paid,
    razorpay:
      online && !paid && order.razorpayOrderId
        ? { keyId: process.env.RAZORPAY_KEY_ID!, orderId: order.razorpayOrderId, amount: order.total * 100, currency: 'INR' }
        : undefined,
  });
}

async function findByCheckoutKey(checkoutKey: string, email: string) {
  const order = await prisma.order.findUnique({ where: { checkoutKey }, include: { items: true } });
  // The key is random and never shown, but only ever hand an order back to
  // the same customer who created it.
  return order && order.customerEmail === email ? order : null;
}

export async function POST(req: Request) {
  if (!(await rateLimit(req, 'orders', 8, 60))) return tooManyRequests();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    const fields = Object.fromEntries(
      Object.entries(fieldErrors(parsed.error)).map(([k, v]) => [k.replace(/^address\./, ''), v]),
    );
    return NextResponse.json({ error: 'Please check the highlighted fields.', fields }, { status: 400 });
  }
  const input = parsed.data;

  const caps = checkoutCapabilities();
  if (input.paymentMethod === 'ONLINE' && !caps.online) {
    return NextResponse.json({ error: 'Online payment is not available right now. Please choose Cash on Delivery.' }, { status: 400 });
  }
  if (input.paymentMethod === 'COD' && !caps.cod) {
    return NextResponse.json({ error: 'We can’t take orders online right now. Please contact us to order.' }, { status: 503 });
  }

  // A retry of a request that already created an order (for example after a
  // timeout) gets that order back instead of a duplicate.
  if (caps.database && input.checkoutKey) {
    try {
      const existing = await findByCheckoutKey(input.checkoutKey, input.email);
      if (existing) return existingOrderResponse(existing);
    } catch (error) {
      console.error('[orders] could not check for an existing order', error);
    }
  }

  // Prices always come from the database — never from the browser.
  let lookup: Awaited<ReturnType<typeof storeLookup>>;
  try {
    lookup = await storeLookup();
  } catch (error) {
    console.error('[orders] could not load products', error);
    return NextResponse.json({ error: 'We could not check prices right now. Please try again in a moment.' }, { status: 503 });
  }
  const { lines, rejected } = priceCart(input.items, lookup);
  if (rejected.length > 0 || lines.length === 0) {
    return NextResponse.json(
      { error: 'Some items in your cart are no longer available. Please review your cart and try again.' },
      { status: 409 },
    );
  }
  const totals = computeTotals(lines, input.couponCode || null);
  if (input.couponCode && totals.couponError) {
    return NextResponse.json({ error: totals.couponError }, { status: 400 });
  }

  const orderNumber = generateOrderNumber();
  const { address } = input;
  const emailData: OrderEmailData = {
    orderNumber,
    customerName: address.name,
    customerEmail: input.email,
    customerPhone: address.phone,
    paymentMethod: input.paymentMethod,
    address: { line1: address.line1, line2: address.line2 || '', city: address.city, state: address.state, pincode: address.pincode },
    items: lines.map((l) => ({ name: l.name, size: l.size, quantity: l.quantity, lineTotal: l.lineTotal })),
    subtotal: totals.subtotal,
    discount: totals.discount,
    shipping: totals.shipping,
    total: totals.total,
  };

  let razorpay: { keyId: string; orderId: string; amount: number; currency: string } | undefined;
  if (input.paymentMethod === 'ONLINE') {
    try {
      const rzp = await createRazorpayOrder(totals.total, orderNumber, { orderNumber });
      razorpay = { keyId: process.env.RAZORPAY_KEY_ID!, orderId: rzp.id, amount: rzp.amount, currency: rzp.currency };
    } catch (error) {
      console.error('[orders] Razorpay order creation failed', error);
      return NextResponse.json(
        { error: 'The payment service is not responding. Please try again or choose Cash on Delivery.' },
        { status: 502 },
      );
    }
  }

  if (caps.database) {
    let orderId: string | null = null;
    try {
      const sessionUser = await getSessionUser();
      const user = sessionUser ? await prisma.user.findUnique({ where: { id: sessionUser.id }, select: { id: true } }) : null;
      // Order and items are written separately: D1 has no transactions, and a
      // nested write would silently run as separate queries anyway.
      const order = await prisma.order.create({
        select: { id: true },
        data: {
          orderNumber,
          checkoutKey: input.checkoutKey ?? null,
          userId: user?.id ?? null,
          status: input.paymentMethod === 'COD' ? 'CONFIRMED' : 'PENDING',
          paymentStatus: 'PENDING',
          paymentMethod: input.paymentMethod,
          customerName: address.name,
          customerEmail: input.email,
          customerPhone: address.phone,
          shippingAddress: { ...emailData.address, country: 'India' },
          couponCode: totals.couponCode ?? null,
          subtotal: totals.subtotal,
          discount: totals.discount,
          shipping: totals.shipping,
          tax: totals.gstIncluded,
          total: totals.total,
          razorpayOrderId: razorpay?.orderId ?? null,
          notes: input.notes || null,
        },
      });
      orderId = order.id;
      await prisma.orderItem.createMany({
        data: lines.map((l) => ({
          orderId: order.id,
          productId: l.slug,
          variantId: l.variantId,
          variantLabel: l.size,
          name: l.name,
          image: l.image,
          quantity: l.quantity,
          unitPrice: l.unitPrice,
          total: l.lineTotal,
        })),
      });
    } catch (error) {
      // Never leave an order without its items behind.
      if (orderId) await prisma.order.delete({ where: { id: orderId } }).catch(() => undefined);
      // Two identical requests raced: the other one saved the order first.
      // P2002 = unique constraint (checked by code: the error class comes from
      // the WebAssembly client, not the '@prisma/client' entry).
      if (input.checkoutKey && (error as { code?: string } | null)?.code === 'P2002') {
        const existing = await findByCheckoutKey(input.checkoutKey, input.email).catch(() => null);
        if (existing) return existingOrderResponse(existing);
        return NextResponse.json({ error: 'This checkout has expired. Please refresh the page and try again.' }, { status: 409 });
      }
      console.error('[orders] could not save order', error);
      return NextResponse.json({ error: 'We could not save your order. Please try again in a moment.' }, { status: 500 });
    }
  } else if (caps.emailNotify) {
    // No database: the order only counts once it has reached the store's inbox.
    if (!(await sendOrderNotification(emailData))) {
      return NextResponse.json({ error: 'We could not place your order. Please try again or contact us.' }, { status: 503 });
    }
  } else {
    console.info(`[orders] development mode — order ${orderNumber} not stored:`, JSON.stringify(emailData));
  }

  let emailSent = false;
  if (input.paymentMethod === 'COD') {
    emailSent = await sendOrderConfirmation(emailData);
    if (caps.database) after(() => sendOrderNotification(emailData));
  }

  return NextResponse.json(
    {
      orderNumber,
      paymentMethod: input.paymentMethod,
      totals: { subtotal: totals.subtotal, discount: totals.discount, shipping: totals.shipping, total: totals.total },
      items: lines.map((l) => ({ name: l.name, size: l.size, quantity: l.quantity, lineTotal: l.lineTotal, image: l.image })),
      emailSent,
      razorpay,
    },
    { status: 201 },
  );
}
