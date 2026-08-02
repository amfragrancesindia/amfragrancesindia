import { CartItem } from '@/types/product';

const CART_STORAGE_KEY = 'amf_cart';

export function getCartFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveCartToStorage(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function generateSKU(category: string, name: string, volume?: string): string {
  const categoryCode = category.replace(/\s+/g, '').substring(0, 3).toUpperCase();
  const nameCode = name.replace(/\s+/g, '').substring(0, 4).toUpperCase();
  const volumeCode = volume ? volume.replace(/\D/g, '').padStart(2, '0') : '00';
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `AMF-${categoryCode}-${nameCode}-${volumeCode}${random}`;
}

export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
}
