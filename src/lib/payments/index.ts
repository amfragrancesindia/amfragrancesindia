import type { PaymentMethod, PaymentResult, OrderData } from './types';
import { createRazorpayOrder, verifyRazorpaySignature } from './razorpay';
import { processCODOrder, validateCODAvailability } from './cod';
import { processGiftCardPayment } from './giftcard';
import { defaultConfig } from './utils';

export const processPayment = async (
  method: PaymentMethod,
  amount: number,
  receipt: string,
  metadata?: Record<string, unknown>
): Promise<PaymentResult> => {
  switch (method) {
    case 'UPI':
    case 'CREDIT_CARD':
    case 'DEBIT_CARD':
    case 'NET_BANKING':
    case 'WALLET':
    case 'EMI':
      // All these go through Razorpay
      try {
        const orderData = await createRazorpayOrder(amount, receipt);
        return {
          success: true,
          orderId: orderData.orderId,
        };
      } catch (error) {
        console.error('Payment processing error:', error);
        return {
          success: false,
          error: 'Payment processing failed',
        };
      }

    case 'COD':
      if (!validateCODAvailability(metadata?.pincode as string)) {
        return {
          success: false,
          error: 'COD not available for this pincode',
        };
      }
      const codResult = await processCODOrder({ orderNumber: receipt, amount });
      return {
        success: codResult.success,
        orderId: codResult.orderId,
      };

    case 'GIFT_CARD':
      if (!metadata?.giftCardCode) {
        return {
          success: false,
          error: 'Gift card code required',
        };
      }
      const giftCardResult = await processGiftCardPayment(
        metadata.giftCardCode as string,
        amount
      );
      return {
        success: giftCardResult.success,
        orderId: receipt,
      };

    default:
      return {
        success: false,
        error: 'Unsupported payment method',
      };
  }
};

export const verifyPayment = (
  method: PaymentMethod,
  orderId: string,
  paymentId: string,
  signature: string
): boolean => {
  if (
    ['UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'NET_BANKING', 'WALLET', 'EMI'].includes(
      method
    )
  ) {
    return verifyRazorpaySignature(orderId, paymentId, signature);
  }
  // For COD and GIFT_CARD, verification is simpler
  return true;
};
