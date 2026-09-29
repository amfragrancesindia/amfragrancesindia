import { z } from 'zod';

export const INDIAN_STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh',
  'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry',
  'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
  'West Bengal',
] as const;

const email = z.string().trim().toLowerCase().email('Please enter a valid email address').max(254);
const name = z.string().trim().min(2, 'Please enter your full name').max(80, 'Name is too long');

/** Accepts "98765 43210", "+91 98765-43210", "09876543210" and stores 10 digits. */
export const indianMobile = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s()-]/g, '').replace(/^(\+?91|0)(?=\d{10}$)/, ''))
  .pipe(z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'));

const strongPassword = z
  .string()
  .min(8, 'Use at least 8 characters')
  .max(72, 'Use at most 72 characters')
  .regex(/[a-z]/, 'Add a lowercase letter')
  .regex(/[A-Z]/, 'Add an uppercase letter')
  .regex(/[0-9]/, 'Add a number');

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Please enter your password').max(72),
});

export const registerSchema = z
  .object({
    name,
    email,
    phone: z.union([indianMobile, z.literal('')]).optional(),
    password: strongPassword,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, { message: "Passwords don't match", path: ['confirmPassword'] });

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z
  .object({
    email,
    token: z.string().min(20).max(200),
    password: strongPassword,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, { message: "Passwords don't match", path: ['confirmPassword'] });

export const addressSchema = z.object({
  name,
  phone: indianMobile,
  line1: z.string().trim().min(5, 'Please enter your house number and street').max(160),
  line2: z.string().trim().max(160).optional().or(z.literal('')),
  city: z.string().trim().min(2, 'Please enter your city').max(80),
  state: z.enum(INDIAN_STATES, { errorMap: () => ({ message: 'Please select your state' }) }),
  pincode: z.string().trim().regex(/^[1-9]\d{5}$/, 'Enter a valid 6-digit PIN code'),
});

export const cartItemSchema = z.object({
  slug: z.string().min(1).max(80),
  variantId: z.string().min(1).max(40),
  quantity: z.number().int().min(1).max(10),
});

export const checkoutSchema = z.object({
  email,
  address: addressSchema,
  items: z.array(cartItemSchema).min(1, 'Your cart is empty').max(30),
  paymentMethod: z.enum(['COD', 'ONLINE']),
  couponCode: z.string().trim().max(30).optional().or(z.literal('')),
  notes: z.string().trim().max(300).optional().or(z.literal('')),
  /** Random id per checkout attempt, so a retried request can't create a second order. */
  checkoutKey: z.string().uuid().optional(),
});

export const verifyPaymentSchema = z.object({
  orderNumber: z.string().min(6).max(40),
  razorpay_order_id: z.string().min(6).max(60),
  razorpay_payment_id: z.string().min(6).max(60),
  razorpay_signature: z.string().min(20).max(200),
});

export const CONTACT_SUBJECTS = ['Order enquiry', 'Product question', 'Returns & refunds', 'Bulk & corporate gifting', 'Other'] as const;

export const contactSchema = z.object({
  name,
  email,
  phone: z.union([indianMobile, z.literal('')]).optional(),
  subject: z.enum(CONTACT_SUBJECTS, { errorMap: () => ({ message: 'Please choose a subject' }) }),
  message: z.string().trim().min(10, 'Please write at least 10 characters').max(2000, 'Message is too long'),
});

export const newsletterSchema = z.object({ email });

export const profileSchema = z.object({
  name,
  phone: z.union([indianMobile, z.literal('')]).optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Please enter your current password').max(72),
    newPassword: strongPassword,
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, { message: "Passwords don't match", path: ['confirmPassword'] });

export const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED'] as const;

export const orderUpdateSchema = z.object({
  status: z.enum(ORDER_STATUSES),
  trackingNumber: z.string().trim().max(80).optional().or(z.literal('')),
});

/** Flatten a Zod error into { field: message } for forms. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join('.');
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}
