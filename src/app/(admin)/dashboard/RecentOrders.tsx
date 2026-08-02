'use client';

import React from 'react';

const orders = [
  { id: 'AMF-ABC123', customer: 'Priya Sharma', email: 'priya@example.com', amount: 8999, status: 'DELIVERED', date: '2026-01-15' },
  { id: 'AMF-DEF456', customer: 'Rahul Kapoor', email: 'rahul@example.com', amount: 12999, status: 'SHIPPED', date: '2026-01-14' },
  { id: 'AMF-GHI789', customer: 'Ananya Reddy', email: 'ananya@example.com', amount: 7499, status: 'PROCESSING', date: '2026-01-14' },
  { id: 'AMF-JKL012', customer: 'Vikram Singh', email: 'vikram@example.com', amount: 9999, status: 'CONFIRMED', date: '2026-01-13' },
  { id: 'AMF-MNO345', customer: 'Deepika Patel', email: 'deepika@example.com', amount: 6999, status: 'PENDING', date: '2026-01-13' },
];

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  CONFIRMED: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  PROCESSING: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  SHIPPED: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  DELIVERED: 'bg-green-500/10 text-green-400 border-green-500/30',
  CANCELLED: 'bg-red-500/10 text-red-400 border-red-500/30',
};

export function RecentOrders() {
  return (
    <div className="bg-luxury-dark border border-white/5 rounded-lg overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <h3 className="font-serif text-xl text-luxury-light">Recent Orders</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-luxury-black/50">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-luxury-muted uppercase tracking-wider">Order ID</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-luxury-muted uppercase tracking-wider">Customer</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-luxury-muted uppercase tracking-wider">Amount</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-luxury-muted uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-luxury-muted uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-sm text-luxury-light font-medium">{order.id}</td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm text-luxury-light">{order.customer}</p>
                    <p className="text-xs text-luxury-muted">{order.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gold-500 font-medium">
                  ₹{order.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                    statusColors[order.status]
                  )}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-luxury-muted">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}
