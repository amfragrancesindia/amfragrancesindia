'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

const products = [
  { id: '1', name: 'Royal Oud', category: 'Eau de Parfum', gender: 'Men', price: 8999, stock: 15, status: 'Active', image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=100&q=80' },
];

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-luxury-light">Products</h1>
          <p className="text-luxury-muted mt-1">Manage your product catalog</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-luxury-muted" />
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 bg-luxury-dark border border-white/10 rounded-md text-sm text-luxury-light placeholder:text-luxury-muted focus:outline-none focus:border-gold-500"
            />
          </div>
          <Button variant="primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-luxury-dark border border-white/5 rounded-lg overflow-hidden hover:border-gold-500/30 transition-colors">
            <div className="aspect-square bg-luxury-black relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <button className="p-1.5 bg-luxury-black/50 rounded-full text-luxury-muted hover:text-luxury-light transition-colors">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-luxury-light">{product.name}</h3>
              <p className="text-sm text-luxury-muted">{product.category} · {product.gender}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-lg font-semibold text-gold-500">₹{product.price.toLocaleString()}</span>
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded',
                  product.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                )}>
                  {product.status}
                </span>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-md text-sm text-luxury-secondary transition-colors">
                  <Eye className="h-3.5 w-3.5" />
                  View
                </button>
                <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-md text-sm text-luxury-secondary transition-colors">
                  <Edit className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-md text-red-400 transition-colors">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

