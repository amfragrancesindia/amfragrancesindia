import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import { requireAdmin } from '@/lib/auth';

export const metadata: Metadata = { title: 'Customers' };

export default async function AdminCustomersPage() {
  await requireAdmin('/admin/customers');
  let users: Awaited<ReturnType<typeof load>> | null = null;
  try {
    users = await load();
  } catch (error) {
    console.error('[admin/customers]', error);
  }
  if (!users) return <p className="rounded-2xl bg-white p-8 text-muted">Could not reach the database.</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
      <p className="text-muted">{users.length} registered accounts (most recent first).</p>
      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-soft">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-line text-muted">
            <tr>
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Phone</th>
              <th className="px-5 py-3 font-medium">Orders</th>
              <th className="px-5 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-5 py-3 font-medium">
                  {u.name || '—'} {u.role !== 'CUSTOMER' && <span className="ml-1 text-xs text-brand">({u.role.toLowerCase()})</span>}
                </td>
                <td className="px-5 py-3">{u.email}</td>
                <td className="px-5 py-3">{u.phone || '—'}</td>
                <td className="px-5 py-3">{u._count.orders}</td>
                <td className="px-5 py-3">{formatDate(u.createdAt)}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-muted">
                  No customers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function load() {
  return prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
    select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true, _count: { select: { orders: true } } },
  });
}
