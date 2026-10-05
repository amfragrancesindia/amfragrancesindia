import crypto from 'crypto';
import type { Order, OrderItem } from '@prisma/client';
import type { OrderEmailData } from './email';
import { isEmailConfigured } from './email';
import { isDatabaseConfigured } from './prisma';
import { isRazorpayConfigured } from './razorpay';

/** e.g. AMF-250928-3F9A1C (date in IST + random suffix). */
export function generateOrderNumber(): string {
  const ist = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
  const ymd = ist.toISOString().slice(2, 10).replace(/-/g, '');
  return `AMF-${ymd}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
}

/**
 * Which payment options checkout can offer right now. Orders are only accepted
 * when they can actually reach the store: saved to the database, or at least
 * emailed to the store.
 */
export function checkoutCapabilities() {
  const database = isDatabaseConfigured();
  const emailNotify = isEmailConfigured();
  return {
    // The webhook secret is required too: it's how a payment still gets
    // recorded if the customer closes the tab before returning from UPI.
    online: database && isRazorpayConfigured() && Boolean(process.env.RAZORPAY_WEBHOOK_SECRET),
    // The store doesn't offer Cash on Delivery: orders go to WhatsApp, where
    // the store confirms them and arranges payment.
    cod: false,
    database,
    emailNotify,
  };
}

interface StoredAddress {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export function orderToEmailData(order: Order & { items: OrderItem[] }): OrderEmailData {
  const address = (order.shippingAddress ?? {}) as StoredAddress;
  return {
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    paymentMethod: order.paymentMethod === 'ONLINE' ? 'ONLINE' : 'COD',
    address: {
      line1: address.line1 ?? '',
      line2: address.line2 ?? '',
      city: address.city ?? '',
      state: address.state ?? '',
      pincode: address.pincode ?? '',
    },
    items: order.items.map((i) => ({ name: i.name, size: i.variantLabel, quantity: i.quantity, lineTotal: i.total })),
    subtotal: order.subtotal,
    discount: order.discount,
    shipping: order.shipping,
    total: order.total,
  };
}
