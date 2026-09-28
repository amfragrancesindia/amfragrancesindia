import type { Metadata } from 'next';
import { StatusBadge } from '@/components/account/StatusBadge';
import { OrderStatusControl } from '@/components/admin/OrderStatusControl';
import { prisma } from '@/lib/prisma';
import { formatDate, formatPrice } from '@/lib/utils';
import { requireAdmin } from '@/lib/auth';

export const metadata: Metadata = { title: 'Orders' };

interface Address {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export default async function AdminOrdersPage() {
  await requireAdmin('/admin/orders');
  let orders: Awaited<ReturnType<typeof load>> | null = null;
  try {
    orders = await load();
  } catch (error) {
    console.error('[admin/orders]', error);
  }
  if (!orders) return <p className="rounded-2xl bg-white p-8 text-muted">Could not reach the database.</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
      <p className="text-muted">
        Latest {orders.length} orders. Marking a Cash on Delivery order as Delivered records it as paid. Online orders still marked
        “Pending / Pending” are checkouts where payment was not completed.
      </p>
      <div className="mt-6 space-y-4">
        {orders.length === 0 && <p className="rounded-2xl bg-white p-8 text-muted">No orders yet.</p>}
        {orders.map((o) => {
          const a = (o.shippingAddress ?? {}) as Address;
          return (
            <article key={o.id} className="rounded-2xl bg-white p-5 shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    {o.orderNumber} <span className="font-normal text-muted">· {formatDate(o.createdAt)}</span>
                  </p>
                  <p className="text-sm text-muted">
                    {o.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online'} · {formatPrice(o.total)}
                    {o.couponCode ? ` · ${o.couponCode}` : ''}
                  </p>
                </div>
                <div className="flex gap-2">
                  <StatusBadge status={o.status} />
                  <StatusBadge status={o.paymentStatus} />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                <div>
                  <p className="font-medium">{o.customerName}</p>
                  <p className="break-all text-muted">{o.customerEmail}</p>
                  <p className="text-muted">+91 {o.customerPhone}</p>
                </div>
                <p className="text-muted">
                  {a.line1}
                  {a.line2 ? `, ${a.line2}` : ''}
                  <br />
                  {a.city}, {a.state} {a.pincode}
                </p>
                <ul className="text-muted">
                  {o.items.map((i) => (
                    <li key={i.id}>
                      {i.name} ({i.variantLabel}) × {i.quantity}
                    </li>
                  ))}
                </ul>
              </div>
              {o.notes && <p className="mt-3 rounded-lg bg-cream px-3 py-2 text-sm">Note: {o.notes}</p>}
              <div className="mt-4 border-t border-line pt-4">
                <OrderStatusControl id={o.id} status={o.status} trackingNumber={o.trackingNumber} />
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function load() {
  return prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: 'desc' }, take: 100 });
}
