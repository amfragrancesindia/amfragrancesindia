'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Search, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const inventory = [
  { id: '1', name: 'Royal Oud', sku: 'AMF-EDP-ROY-001', category: 'Eau de Parfum', stock: 15, lowStock: 10, status: 'In Stock' },
];

export default function AdminInventoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-luxury-light">Inventory</h1>
          <p className="text-luxury-muted mt-1">Track and manage stock levels</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-luxury-muted" />
            <input
              type="text"
              placeholder="Search inventory..."
              className="pl-10 pr-4 py-2 bg-luxury-dark border border-white/10 rounded-md text-sm text-luxury-light placeholder:text-luxury-muted focus:outline-none focus:border-gold-500"
            />
          </div>
          <Button variant="primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-luxury-dark border border-white/5 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-white/10">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-medium text-luxury-muted">Product</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-luxury-muted">SKU</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-luxury-muted">Category</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-luxury-muted">Stock</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-luxury-muted">Status</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-luxury-light font-medium">{item.name}</td>
                <td className="px-6 py-4 text-luxury-secondary font-mono text-sm">{item.sku}</td>
                <td className="px-6 py-4 text-luxury-secondary">{item.category}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    'font-medium',
                    item.stock < item.lowStock ? 'text-red-400' : 'text-luxury-light'
                  )}>
                    {item.stock}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                    item.status === 'In Stock' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                  )}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

