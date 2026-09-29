/** Snapshot the checkout keeps in sessionStorage for the confirmation page. */
export interface OrderReceipt {
  orderNumber: string;
  placedAt: string;
  paymentMethod: 'COD' | 'ONLINE';
  email: string;
  name: string;
  items: Array<{ name: string; size: string; quantity: number; lineTotal: number; image: string }>;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  /** Whether a confirmation email actually went out (email service configured and accepted). */
  emailSent?: boolean;
}

export const RECEIPT_STORAGE_KEY = 'amf_last_order';
