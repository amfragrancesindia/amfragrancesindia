import Image from 'next/image';
import Link from 'next/link';
import { Package } from 'lucide-react';
import { StatusBadge } from '@/components/account/StatusBadge';
import { AccountUnavailable } from '@/components/account/Unavailable';
import { ButtonLink } from '@/components/ui/Button';
import { requireUser } from '@/lib/auth';
import { isDatabaseConfigured, prisma } from '@/lib/prisma';
import { site } from '@/lib/site';
import { formatDate, formatPrice } from '@/lib/utils';

export const dynamic = 'force-dynamic';

async function loadOrders(userId: string) {
  if (!isDatabaseConfigured()) return null;
  try {
    return await prisma.order.findMany({
      // Online checkouts that were never paid are abandoned attempts, not orders.
      where: { userId, OR: [{ paymentMethod: 'COD' }, { paymentStatus: 'PAID' }] },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  } catch (error) {
    console.error('[account/orders] could not load orders', error);
    return null;
  }
}

export default async function OrdersPage() {
  const user = await requireUser('/account/orders');
  const orders = await loadOrders(user.id);
  if (!orders) return <AccountUnavailable />;

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-line p-10 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-cream">
          <Package className="h-6 w-6 text-brand" />
        </span>
        <h2 className="mt-4 text-lg font-semibold">No orders yet</h2>
        <p className="mt-1 text-sm text-muted">Orders you place while signed in will appear here.</p>
        <ButtonLink href="/products" className="mt-6">
          Start shopping
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {orders.map((order) => (
        <article key={order.id} className="overflow-hidden rounded-2xl border border-line">
          <header className="flex flex-wrap items-center justify-between gap-3 bg-cream px-5 py-4 sm:px-6">
            <div className="flex flex-wrap gap-x-8 gap-y-1 text-sm">
              <p>
                <span className="text-muted">Order </span>
                <span className="font-semibold" translate="no">
                  #{order.orderNumber}
                </span>
              </p>
              <p>
                <span className="text-muted">Placed </span>
                {formatDate(order.createdAt)}
              </p>
              <p>
                <span className="text-muted">Total </span>
                <span className="font-semibold">{formatPrice(order.total)}</span>
              </p>
            </div>
            <StatusBadge status={order.status} />
          </header>
          <ul className="divide-y divide-line px-5 sm:px-6">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 py-4">
                <Link href={`/products/${item.productId}`} className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-cream">
                  <Image src={item.image} alt="" fill sizes="64px" className="object-cover" />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link href={`/products/${item.productId}`} className="font-medium hover:text-brand">
                    {item.name}
                  </Link>
                  <p className="text-sm text-muted">
                    {item.variantLabel} × {item.quantity}
                  </p>
                </div>
                <p className="font-medium">{formatPrice(item.total)}</p>
              </li>
            ))}
          </ul>
          <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-5 py-3 text-sm text-muted sm:px-6">
            <span>
              {order.paymentMethod === 'COD'
                ? `Cash on Delivery · ${order.paymentStatus === 'PAID' ? 'Payment received' : 'Pay when it arrives'}`
                : 'Paid online'}
            </span>
            {order.trackingNumber ? (
              <span>
                Tracking: <span className="font-medium text-ink">{order.trackingNumber}</span>
              </span>
            ) : (
              <a href={`mailto:${site.email}?subject=${encodeURIComponent(`Order ${order.orderNumber}`)}`} className="text-brand hover:underline">
                Need help?
              </a>
            )}
          </footer>
        </article>
      ))}
    </div>
  );
}
