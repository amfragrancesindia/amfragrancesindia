'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Plus, Search, Users as UsersIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const customers = [
  { id: '1', name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 98765 43210', orders: 12, spent: 125000, joined: '2025-06-15' },
];

export default function AdminCustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-luxury-light">Customers</h1>
          <p className="text-luxury-muted mt-1">Manage your customer base</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-luxury-muted" />
            <input
              type="text"
              placeholder="Search customers..."
              className="pl-10 pr-4 py-2 bg-luxury-dark border border-white/10 rounded-md text-sm text-luxury-light placeholder:text-luxury-muted focus:outline-none focus:border-gold-500"
            />
          </div>
          <Button variant="primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-luxury-dark border border-white/5 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-white/10">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-medium text-luxury-muted">Customer</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-luxury-muted">Email</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-luxury-muted">Phone</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-luxury-muted">Orders</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-luxury-muted">Total Spent</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-luxury-muted">Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gold-500/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gold-500">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <span className="text-luxury-light font-medium">{customer.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-luxury-secondary">{customer.email}</td>
                <td className="px-6 py-4 text-luxury-secondary">{customer.phone}</td>
                <td className="px-6 py-4 text-luxury-light">{customer.orders}</td>
                <td className="px-6 py-4 text-luxury-light">₹{customer.spent.toLocaleString()}</td>
                <td className="px-6 py-4 text-luxury-secondary">{customer.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

