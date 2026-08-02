export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: string;
  gender: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  images: string[];
  isPublished: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isLimited: boolean;
  longevity?: number;
  projection?: string;
  season: string[];
  occasion: string[];
  ingredients?: string;
  rating: number;
  reviewCount: number;
  stock: number;
  soldCount: number;
  createdAt: string;
  updatedAt: string;
  variants?: ProductVariant[];
  notes?: FragranceNote[];
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  volume?: string;
  price: number;
  sku: string;
  stock: number;
  isAvailable: boolean;
}

export interface FragranceNote {
  id: string;
  productId: string;
  noteType: 'TOP' | 'MIDDLE' | 'BASE';
  name: string;
  description?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
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

export interface Address {
  id: string;
  userId: string;
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

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: string;
  paymentId?: string;
  trackingNumber?: string;
  items: OrderItem[];
  shippingAddress: Address;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId?: string;
  name: string;
  image: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title?: string;
  comment: string;
  isVerified: boolean;
  isApproved: boolean;
  helpfulCount: number;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  perUserLimit?: number;
  isActive: boolean;
  startsAt?: string;
  expiresAt?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  category?: string;
  tags: string[];
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
}
