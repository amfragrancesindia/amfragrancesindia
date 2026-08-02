'use client';

import React from 'react';

const products = [
  { name: 'Royal Oud', revenue: 450000, units: 50, category: 'Luxury Collection' },
  { name: 'Saffron Elixir', revenue: 320000, units: 42, category: 'Eau de Parfum' },
  { name: 'Golden Oud', revenue: 280000, units: 20, category: 'Luxury Collection' },
  { name: 'White Musk', revenue: 250000, units: 41, category: 'Eau de Toilette' },
  { name: 'Jasmine Noir', revenue: 180000, units: 25, category: 'Eau de Parfum' },
];

export function TopProducts() {
  return (
    <div className="bg-luxury-dark border border-white/5 rounded-lg overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <h3 className="font-serif text-xl text-luxury-light">Top Products</h3>
      </div>
      <div className="divide-y divide-white/5">
        {products.map((product, index) => (
          <div key={index} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-4">
              <span className="text-lg font-serif text-gold-500 w-6">{index + 1}</span>
              <div>
                <p className="text-sm font-medium text-luxury-light">{product.name}</p>
                <p className="text-xs text-luxury-muted">{product.category}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gold-500">₹{product.revenue.toLocaleString()}</p>
              <p className="text-xs text-luxury-muted">{product.units} units</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
