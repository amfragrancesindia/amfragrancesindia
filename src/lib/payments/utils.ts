import type { PaymentMethod, PaymentConfig } from './types';

export const defaultConfig: PaymentConfig = {
  keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
  keySecret: process.env.RAZORPAY_KEY_SECRET || '',
  theme: {
    color: '#D4AF37',
    backdrop_prompt_color: '#0A0A0A',
  },
};

export const getPaymentMethodLabel = (method: PaymentMethod): string => {
  const labels: Record<PaymentMethod, string> = {
    CREDIT_CARD: 'Credit Card',
    DEBIT_CARD: 'Debit Card',
    UPI: 'UPI',
    NET_BANKING: 'Net Banking',
    WALLET: 'Wallet',
    EMI: 'EMI',
    COD: 'Cash on Delivery',
    GIFT_CARD: 'Gift Card',
  };
  return labels[method];
};

export const getPaymentMethodIcon = (method: PaymentMethod): string => {
  const icons: Record<PaymentMethod, string> = {
    CREDIT_CARD: '💳',
    DEBIT_CARD: '💳',
    UPI: '📱',
    NET_BANKING: '🏦',
    WALLET: '👛',
    EMI: '📊',
    COD: '💵',
    GIFT_CARD: '🎁',
  };
  return icons[method];
};
