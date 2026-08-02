'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const coupons = [
  { id: '1', code: 'LUXURY20', type: 'PERCENTAGE', value: 20, minPurchase: 5000, usedCount: 245, usageLimit: 500, isActive: true, expiresAt: '2026-02-28' },
  { id: '2', code: 'FLAT500', type: 'FIXED_AMOUNT', value: 500, minPurchase: 3000, usedCount: 89, usageLimit: 200, isActive: true, expiresAt: '2026-01-31' },
  { id: '3', code: 'FREESHIP', type: 'FREE_SHIPPING', value: 0, minPurchase: 1999, usedCount: 567, usageLimit: 1000, isActive: true, expiresAt: '2026-03-15' },
  { id: '4', code: 'DIWALI10', type: 'PERCENTAGE', value: 10, minPurchase: 2000, usedCount: 432, usageLimit: 500, isActive: false, expiresAt: '2025-11-15' },
];

export default function AdminCouponsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-luxury-light">Coupons</h1>
          <p className="text-luxury-muted mt-1">Manage discount codes and promotions</p>
        </div>
        <Button variant="primary">
          <Plus className="h-4 w-4 mr-2" />
          Create Coupon
        </Button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon) => (
          <div key={coupon.id} className="bg-luxury-dark border border-white/5 rounded-lg p-6 hover:border-gold-500/30 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-serif text-xl text-gold-500">{coupon.code}</h3>
                <span className={cn(
                  'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1',
                  coupon.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                )}>
                  {coupon.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold text-luxury-light">
                  {coupon.type === 'PERCENTAGE' ? `${coupon.value}%` : coupon.type === 'FIXED_AMOUNT' ? `₹${coupon.value}` : 'FREE'}
                </p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-luxury-secondary">
              {coupon.minPurchase > 0 && (
                <p>Min. Purchase: ₹{coupon.minPurchase.toLocaleString()}</p>
              )}
              <p>Usage: {coupon.usedCount} / {coupon.usageLimit || '∞'}</p>
              <p>Expires: {coupon.expiresAt}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

