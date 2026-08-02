export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: string;
  gender: Gender;
  price: number;
  compareAtPrice?: number;
  sku: string;
  isPublished: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isLimited: boolean;
  isBestseller?: boolean;
  longevity?: number;
  projection?: string;
  season: string[];
  occasion: string[];
  ingredients?: string;
  rating: number;
  reviewCount: number;
  stock: number;
  images: string[];
  variants?: ProductVariant[];
  notes?: {
    top: FragranceNote[];
    heart: FragranceNote[];
    base: FragranceNote[];
  };
}

export interface ProductVariant {
  id: string;
  name: string;
  volume?: string;
  price: number;
  sku: string;
  stock: number;
  isAvailable: boolean;
}

export interface FragranceNote {
  name: string;
  description?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant?: {
    id: string;
    name: string;
    volume?: string;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  image: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  title?: string;
  comment: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  expiresAt?: string;
}

export type Gender = 'MEN' | 'WOMEN' | 'UNISEX';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURNED';
export type CouponType = 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';
