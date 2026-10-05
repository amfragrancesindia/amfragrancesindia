'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { AlertCircle, Banknote, CreditCard, Lock, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useCart } from '@/components/providers/CartProvider';
import { CatalogErrorNotice } from '@/components/cart/CatalogErrorNotice';
import { CouponForm } from '@/components/cart/CouponForm';
import { OrderTotals } from '@/components/cart/OrderTotals';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Field, Input, Select, Textarea } from '@/components/ui/Field';
import { site } from '@/lib/site';
import { cn, formatPrice } from '@/lib/utils';
import { INDIAN_STATES, checkoutSchema, fieldErrors } from '@/lib/validations';
import { RECEIPT_STORAGE_KEY, type OrderReceipt } from '@/types/order';

type FormState = {
  email: string;
  name: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  notes: string;
};

interface CreatedOrder {
  orderNumber: string;
  paymentMethod: 'COD' | 'ONLINE';
  totals: { subtotal: number; discount: number; shipping: number; total: number };
  items: OrderReceipt['items'];
  emailSent?: boolean;
  /** True when a retried checkout finds its order already paid. */
  paid?: boolean;
  razorpay?: { keyId: string; orderId: string; amount: number; currency: string };
}

function newCheckoutKey(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
  on: (event: 'payment.failed', handler: (response: { error?: { description?: string } }) => void) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

function loadRazorpay(): Promise<boolean> {
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

interface CheckoutFormProps {
  cod: boolean;
  online: boolean;
  signedIn: boolean;
  defaultEmail: string;
  defaultName: string;
}

export function CheckoutForm({ cod, online, signedIn, defaultEmail, defaultName }: CheckoutFormProps) {
  const router = useRouter();
  const { hydrated, catalogError, lines, totals, clearCart } = useCart();
  const [form, setForm] = useState<FormState>({
    email: defaultEmail,
    name: defaultName,
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    notes: '',
  });
  const [method, setMethod] = useState<'ONLINE' | 'COD'>(online ? 'ONLINE' : 'COD');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [placed, setPlaced] = useState(false);
  // An online order already created for this exact cart + address, awaiting payment.
  const pending = useRef<{ fingerprint: string; order: CreatedOrder } | null>(null);
  // One idempotency key per distinct submission, reused if the same one is retried.
  const attempt = useRef<{ fingerprint: string; key: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  if (!hydrated) {
    return (
      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_400px]" aria-busy>
        <div className="skeleton h-[520px]" />
        <div className="skeleton h-[420px]" />
      </div>
    );
  }

  if (catalogError && !placed) return <CatalogErrorNotice className="mt-8" />;

  if (!cod && !online) {
    return (
      <div className="mx-auto mt-10 max-w-lg rounded-2xl border border-line bg-cream p-8 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-brand" />
        <h2 className="mt-4 text-xl font-semibold">Online ordering is temporarily unavailable</h2>
        <p className="mt-2 text-muted">
          Please message us on{' '}
          <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="font-medium text-brand">
            WhatsApp
          </a>{' '}
          or email{' '}
          <a href={`mailto:${site.email}`} className="font-medium text-brand">
            {site.email}
          </a>{' '}
          and we’ll take your order personally.
        </p>
      </div>
    );
  }

  if (lines.length === 0 && !placed) {
    return (
      <div className="mx-auto mt-10 max-w-md py-10 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-cream">
          <ShoppingBag className="h-7 w-7 text-brand" />
        </span>
        <h2 className="mt-5 text-xl font-semibold">Your cart is empty</h2>
        <p className="mt-2 text-muted">Add a fragrance to your cart to check out.</p>
        <ButtonLink href="/products" className="mt-6">
          Shop the collection
        </ButtonLink>
      </div>
    );
  }

  const update =
    (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setForm((f) => ({ ...f, [key]: value }));
      if (errors[key]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
      }
    };

  const finish = (order: CreatedOrder, emailSent = order.emailSent) => {
    const receipt: OrderReceipt = {
      orderNumber: order.orderNumber,
      placedAt: new Date().toISOString(),
      paymentMethod: order.paymentMethod,
      email: form.email.trim(),
      name: form.name.trim(),
      items: order.items,
      ...order.totals,
      emailSent,
    };
    try {
      sessionStorage.setItem(RECEIPT_STORAGE_KEY, JSON.stringify(receipt));
    } catch {
      /* the confirmation page falls back to the order number */
    }
    pending.current = null;
    setPlaced(true);
    clearCart();
    router.replace(`/order-success?order=${encodeURIComponent(order.orderNumber)}`);
  };

  const pay = async (order: CreatedOrder) => {
    const loaded = await loadRazorpay();
    if (!loaded || !window.Razorpay || !order.razorpay) {
      toast.error('Could not open the payment window. Please check your connection and try again.');
      setSubmitting(false);
      return;
    }
    const rzp = new window.Razorpay({
      key: order.razorpay.keyId,
      amount: order.razorpay.amount,
      currency: order.razorpay.currency,
      order_id: order.razorpay.orderId,
      name: site.name,
      description: `Order ${order.orderNumber}`,
      image: `${window.location.origin}/icon.png`,
      prefill: { name: form.name, email: form.email, contact: form.phone },
      notes: { orderNumber: order.orderNumber },
      theme: { color: '#5A4A3A' },
      handler: async (response: RazorpayResponse) => {
        try {
          const res = await fetch('/api/orders/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderNumber: order.orderNumber, ...response }),
          });
          const body = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(body.error || 'We could not confirm your payment.');
          finish(order, body.emailSent);
        } catch (err) {
          toast.error(
            `${err instanceof Error ? err.message : 'We could not confirm your payment.'} If money was debited, contact us with order ${order.orderNumber}.`,
            { duration: 8000 },
          );
          setSubmitting(false);
        }
      },
      modal: {
        ondismiss: () => {
          setSubmitting(false);
          toast('Payment cancelled. Your cart is saved — you can try again.');
        },
      },
    });
    rzp.on('payment.failed', (response) => {
      toast.error(response.error?.description || 'Payment failed. Please try again or order on WhatsApp.');
    });
    rzp.open();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const payload = {
      email: form.email,
      address: {
        name: form.name,
        phone: form.phone,
        line1: form.line1,
        line2: form.line2,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
      },
      items: lines.map((l) => ({ slug: l.slug, variantId: l.variantId, quantity: l.quantity })),
      paymentMethod: method,
      couponCode: totals.couponCode ?? '',
      notes: form.notes,
    };

    const parsed = checkoutSchema.safeParse(payload);
    if (!parsed.success) {
      const mapped = Object.fromEntries(
        Object.entries(fieldErrors(parsed.error)).map(([key, message]) => [key.replace(/^address\./, ''), message]),
      );
      setErrors(mapped);
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    setErrors({});
    setSubmitting(true);

    const fingerprint = JSON.stringify(parsed.data);
    if (method === 'ONLINE' && pending.current?.fingerprint === fingerprint) {
      await pay(pending.current.order);
      return;
    }
    if (attempt.current?.fingerprint !== fingerprint) attempt.current = { fingerprint, key: newCheckoutKey() };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...parsed.data, checkoutKey: attempt.current.key }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.fields) setErrors(data.fields);
        throw new Error(data.error || 'We could not place your order. Please try again.');
      }
      const order = data as CreatedOrder;
      if (order.paid) {
        finish(order);
      } else if (order.paymentMethod === 'ONLINE') {
        pending.current = { fingerprint, order };
        await pay(order);
      } else {
        finish(order);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  const payLabel = method === 'COD' ? `Place Order · ${formatPrice(totals.total)}` : `Pay ${formatPrice(totals.total)}`;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="mt-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-10">
      <div className="space-y-6">
        <Card step={1} title="Contact">
          <Field label="Email address" error={errors.email} hint="We’ll send your order confirmation here.">
            {(id, describedBy) => (
              <Input
                id={id}
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={update('email')}
                invalid={!!errors.email}
                aria-describedby={describedBy}
                placeholder="you@example.com"
              />
            )}
          </Field>
          {!signedIn && (
            <p className="mt-3 text-sm text-muted">
              Have an account?{' '}
              <Link href="/login?callbackUrl=/checkout" className="font-medium text-brand underline-offset-4 hover:underline">
                Sign in
              </Link>{' '}
              to track orders easily. Guest checkout is fine too.
            </p>
          )}
        </Card>

        <Card step={2} title="Shipping address">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Full name" error={errors.name}>
              {(id, d) => <Input id={id} autoComplete="name" value={form.name} onChange={update('name')} invalid={!!errors.name} aria-describedby={d} />}
            </Field>
            <Field label="Mobile number" error={errors.phone}>
              {(id, d) => (
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-muted">+91</span>
                  <Input
                    id={id}
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    value={form.phone}
                    onChange={update('phone')}
                    invalid={!!errors.phone}
                    aria-describedby={d}
                    placeholder="98765 43210"
                    className="pl-12"
                  />
                </div>
              )}
            </Field>
            <Field label="House / flat no., building, street" error={errors.line1} className="sm:col-span-2">
              {(id, d) => <Input id={id} autoComplete="address-line1" value={form.line1} onChange={update('line1')} invalid={!!errors.line1} aria-describedby={d} />}
            </Field>
            <Field label="Area, landmark" optional error={errors.line2} className="sm:col-span-2">
              {(id, d) => <Input id={id} autoComplete="address-line2" value={form.line2} onChange={update('line2')} invalid={!!errors.line2} aria-describedby={d} />}
            </Field>
            <Field label="City" error={errors.city}>
              {(id, d) => <Input id={id} autoComplete="address-level2" value={form.city} onChange={update('city')} invalid={!!errors.city} aria-describedby={d} />}
            </Field>
            <Field label="PIN code" error={errors.pincode}>
              {(id, d) => (
                <Input
                  id={id}
                  inputMode="numeric"
                  autoComplete="postal-code"
                  maxLength={6}
                  value={form.pincode}
                  onChange={update('pincode')}
                  invalid={!!errors.pincode}
                  aria-describedby={d}
                />
              )}
            </Field>
            <Field label="State" error={errors.state} className="sm:col-span-2">
              {(id, d) => (
                <Select id={id} autoComplete="address-level1" value={form.state} onChange={update('state')} invalid={!!errors.state} aria-describedby={d}>
                  <option value="">Select your state</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
          </div>
        </Card>

        <Card step={3} title="Payment">
          <div className="grid gap-3" role="radiogroup" aria-label="Payment method">
            {online && (
              <PaymentOption
                selected={method === 'ONLINE'}
                onSelect={() => setMethod('ONLINE')}
                icon={<CreditCard className="h-5 w-5" />}
                title="Pay online"
                text="UPI, cards, net banking and wallets — secured by Razorpay"
              />
            )}
            {cod && (
              <PaymentOption
                selected={method === 'COD'}
                onSelect={() => setMethod('COD')}
                icon={<Banknote className="h-5 w-5" />}
                title="Cash on Delivery"
                text="Pay in cash or by UPI when your order arrives"
              />
            )}
          </div>
        </Card>

        <Card title="Order notes" optional>
          <Field label="Anything we should know?" optional error={errors.notes}>
            {(id, d) => (
              <Textarea
                id={id}
                value={form.notes}
                onChange={update('notes')}
                maxLength={300}
                invalid={!!errors.notes}
                aria-describedby={d}
                placeholder="Gift message, delivery instructions…"
                className="min-h-[96px]"
              />
            )}
          </Field>
        </Card>
      </div>

      <aside className="rounded-2xl bg-cream p-6 lg:sticky lg:top-[calc(var(--header-height)+24px)]" aria-label="Order summary">
        <h2 className="text-lg font-semibold">Order Summary</h2>
        <ul className="mt-5 max-h-[300px] space-y-4 overflow-y-auto pr-1">
          {lines.map((line) => (
            <li key={line.key} className="flex items-center gap-3">
              <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white">
                <Image src={line.image} alt="" fill sizes="64px" className="object-cover" />
                <span className="absolute right-1 top-1 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[11px] font-semibold text-white">
                  {line.quantity}
                </span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-medium">{line.name}</span>
                <span className="block text-[13px] text-muted">{line.size}</span>
              </span>
              <span className="text-[15px] font-medium">{formatPrice(line.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 border-t border-line pt-5">
          <CouponForm />
        </div>
        <div className="mt-6">
          <OrderTotals totals={totals} />
        </div>
        <Button type="submit" size="lg" className="mt-6 w-full" loading={submitting}>
          {!submitting && <Lock className="h-4 w-4" />}
          {submitting ? (method === 'ONLINE' ? 'Opening secure payment…' : 'Placing your order…') : payLabel}
        </Button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[12.5px] text-muted">
          <ShieldCheck className="h-4 w-4" /> Your details are encrypted and never shared.
        </p>
        <p className="mt-2 text-center text-[12px] text-muted">
          By placing your order you agree to our{' '}
          <Link href="/terms" className="underline underline-offset-2">
            Terms
          </Link>{' '}
          and{' '}
          <Link href="/refund-policy" className="underline underline-offset-2">
            Refund Policy
          </Link>
          .
        </p>
      </aside>
    </form>
  );
}

function Card({ step, title, optional, children }: { step?: number; title: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line p-5 sm:p-7">
      <h2 className="mb-5 flex items-center gap-3 text-lg font-semibold">
        {step && <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-[13px] font-semibold text-white">{step}</span>}
        {title}
        {optional && <span className="text-sm font-normal text-muted">(optional)</span>}
      </h2>
      {children}
    </section>
  );
}

function PaymentOption({
  selected,
  onSelect,
  icon,
  title,
  text,
}: {
  selected: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        'flex w-full items-center gap-4 rounded-xl border p-4 text-left transition',
        selected ? 'border-brand-light bg-cream ring-1 ring-brand-light' : 'border-line hover:border-ink/40',
      )}
    >
      <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-full', selected ? 'bg-brand-light text-white' : 'bg-cream text-brand')}>
        {icon}
      </span>
      <span className="flex-1">
        <span className="block font-semibold">{title}</span>
        <span className="block text-sm text-muted">{text}</span>
      </span>
      <span className={cn('grid h-5 w-5 place-items-center rounded-full border-2', selected ? 'border-brand-light' : 'border-line')} aria-hidden>
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-brand-light" />}
      </span>
    </button>
  );
}
