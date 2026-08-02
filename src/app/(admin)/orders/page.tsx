'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Search, Plus, ShoppingCart, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

const orders = [
  { id: 'AMF-ABC123', customer: 'Priya Sharma', email: 'priya@example.com', items: 3, amount: 26997, status: 'DELIVERED', date: '2026-01-15', payment: 'Razorpay' },
];

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-luxury-light">Orders</h1>
          <p className="text-luxury-muted mt-1">Manage and track orders</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-luxury-muted" />
            <input
              type="text"
              placeholder="Search orders..."
              className="pl-10 pr-4 py-2 bg-luxury-dark border border-white/10 rounded-md text-sm text-luxury-light placeholder:text-luxury-muted focus:outline-none focus:border-gold-500"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-luxury-dark border border-white/5 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-white/10">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-medium text-luxury-muted">Order ID</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-luxury-muted">Customer</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-luxury-muted">Items</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-luxury-muted">Amount</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-luxury-muted">Status</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-luxury-muted">Date</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-luxury-muted">Payment</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-luxury-muted">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-luxury-light font-mono text-sm">{order.id}</td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-luxury-light font-medium">{order.customer}</p>
                    <p className="text-xs text-luxury-muted">{order.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-luxury-secondary">{order.items}</td>
                <td className="px-6 py-4 text-luxury-light font-medium">₹{order.amount.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                    order.status === 'DELIVERED' ? 'bg-green-500/10 text-green-400' : order.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-blue-500/10 text-blue-400'
                  )}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-luxury-secondary">{order.date}</td>
                <td className="px-6 py-4 text-luxury-secondary">{order.payment}</td>
                <td className="px-6 py-4">
                  <button className="p-1 text-luxury-muted hover:text-luxury-light transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

