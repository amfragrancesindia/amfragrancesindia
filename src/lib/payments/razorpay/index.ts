import Razorpay from 'razorpay';
import type { OrderData } from '../types';
import { defaultConfig } from '../utils';

let razorpayInstance: Razorpay | null = null;

export const getRazorpayInstance = (): Razorpay => {
  if (!razorpayInstance) {
    if (!defaultConfig.keyId || !defaultConfig.keySecret) {
      throw new Error('Razorpay credentials not configured');
    }
    razorpayInstance = new Razorpay({
      key_id: defaultConfig.keyId,
      key_secret: defaultConfig.keySecret,
    });
  }
  return razorpayInstance;
};

export const createRazorpayOrder = async (amount: number, receipt: string): Promise<OrderData> => {
  const razorpay = getRazorpayInstance();

  const order = await razorpay.orders.create({
    amount: Math.round(amount * 100), // Convert to paise
    currency: 'INR',
    receipt,
    payment_capture: true as any,
  });

  return {
    orderId: order.id,
    amount: (order.amount as number) / 100,
    currency: order.currency,
    receipt: order.receipt,
  };
};

export const verifyRazorpaySignature = (
  orderId: string,
  paymentId: string,
  signature: string
): boolean => {
  const crypto = require('crypto');
  const generatedSignature = crypto
    .createHmac('sha256', defaultConfig.keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return generatedSignature === signature;
};

export const fetchRazorpayPayment = async (paymentId: string) => {
  const razorpay = getRazorpayInstance();
  return await razorpay.payments.fetch(paymentId);
};

export const captureRazorpayPayment = async (paymentId: string, amount: number) => {
  const razorpay = getRazorpayInstance();
  return await razorpay.payments.capture(paymentId, Math.round(amount * 100), 'INR');
};
