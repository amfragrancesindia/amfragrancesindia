import type { Metadata } from 'next';
import type { Prisma } from '@prisma/client';
import Link from 'next/link';
import { IndianRupee, Mail, ShoppingBag, Users } from 'lucide-react';
import { StatusBadge } from '@/components/account/StatusBadge';
import { prisma } from '@/lib/prisma';
import { formatDate, formatPrice } from '@/lib/utils';
import { requireAdmin } from '@/lib/auth';

export const metadata: Metadata = { title: 'Dashboard' };

// Real orders: cash on delivery, or online orders that were actually paid
// (unpaid online checkouts are abandoned payment attempts).
const placed: Prisma.OrderWhereInput = { OR: [{ paymentMethod: 'COD' }, { paymentStatus: 'PAID' }] };

async function loadStats() {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [orders30, revenue30, customers, newMessages, pending, recent] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: since }, ...placed } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { createdAt: { gte: since }, status: { notIn: ['CANCELLED', 'RETURNED'] }, ...placed },
    }),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.contactInquiry.count({ where: { status: 'NEW' } }),
    prisma.order.count({ where: { status: { in: ['PENDING', 'CONFIRMED', 'PROCESSING'] }, ...placed } }),
    prisma.order.findMany({ where: placed, orderBy: { createdAt: 'desc' }, take: 8 }),
  ]);
  return { orders30, revenue30: revenue30._sum.total ?? 0, customers, newMessages, pending, recent };
}

export default async function DashboardPage() {
  await requireAdmin('/admin/dashboard');
  let stats: Awaited<ReturnType<typeof loadStats>> | null = null;
  try {
    stats = await loadStats();
  } catch (error) {
    console.error('[admin/dashboard]', error);
  }
  if (!stats) return <p className="rounded-2xl bg-white p-8 text-muted">Could not read the database. Check that the D1 tables have been created (see DEPLOYMENT.md) and try again.</p>;

  const cards = [
    { label: 'Orders (30 days)', value: stats.orders30.toString(), Icon: ShoppingBag },
    { label: 'Revenue (30 days)', value: formatPrice(stats.revenue30), Icon: IndianRupee },
    { label: 'Customers', value: stats.customers.toString(), Icon: Users },
    { label: 'New messages', value: stats.newMessages.toString(), Icon: Mail },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted">{stats.pending} orders need attention.</p>
      </div>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, Icon }) => (
          <li key={label} className="rounded-2xl bg-white p-5 shadow-soft">
            <Icon className="h-5 w-5 text-brand" />
            <p className="mt-3 text-2xl font-semibold">{value}</p>
            <p className="text-sm text-muted">{label}</p>
          </li>
        ))}
      </ul>
      <section className="rounded-2xl bg-white p-5 shadow-soft sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent orders</h2>
          <Link href="/admin/orders" className="text-sm font-medium text-brand hover:underline">
            View all
          </Link>
        </div>
        {stats.recent.length === 0 ? (
          <p className="mt-4 text-muted">No orders yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="text-muted">
                <tr>
                  <th className="py-2 font-medium">Order</th>
                  <th className="py-2 font-medium">Customer</th>
                  <th className="py-2 font-medium">Date</th>
                  <th className="py-2 font-medium">Total</th>
                  <th className="py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {stats.recent.map((o) => (
                  <tr key={o.id}>
                    <td className="py-3 font-medium">{o.orderNumber}</td>
                    <td className="py-3">{o.customerName || '—'}</td>
                    <td className="py-3">{formatDate(o.createdAt)}</td>
                    <td className="py-3">{formatPrice(o.total)}</td>
                    <td className="py-3">
                      <StatusBadge status={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
