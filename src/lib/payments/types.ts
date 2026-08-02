export const PaymentMethod = {
  UPI: 'UPI',
  CREDIT_CARD: 'CREDIT_CARD',
  DEBIT_CARD: 'DEBIT_CARD',
  NET_BANKING: 'NET_BANKING',
  WALLET: 'WALLET',
  EMI: 'EMI',
  COD: 'COD',
  GIFT_CARD: 'GIFT_CARD',
} as const;

export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod];

export interface OrderData {
  orderId: string;
  amount: number;
  currency: string;
  receipt?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: {
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  orderId?: string;
  error?: string;
  data?: Record<string, any>;
}

export interface PaymentConfig {
  keyId: string;
  keySecret: string;
  theme?: {
    color: string;
    backdrop_prompt_color: string;
  };
}

export interface RazorpayOrderResponse {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
}

