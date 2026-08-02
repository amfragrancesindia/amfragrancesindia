'use client';

import React from 'react';
import { DollarSign, ShoppingBag, Users, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const stats = [
  { label: 'Total Revenue', value: '₹12,45,678', change: '+12.5%', trend: 'up', icon: DollarSign },
  { label: 'Total Orders', value: '1,234', change: '+8.2%', trend: 'up', icon: ShoppingBag },
  { label: 'Total Customers', value: '8,901', change: '+15.3%', trend: 'up', icon: Users },
  { label: 'Low Stock Alerts', value: '23', change: '+5', trend: 'down', icon: AlertTriangle },
];

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-luxury-dark border border-white/5 rounded-lg p-6 hover:border-gold-500/30 transition-colors"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gold-500/10 rounded-lg">
              <stat.icon className="h-6 w-6 text-gold-500" />
            </div>
            <div className={cn(
              'flex items-center gap-1 text-sm',
              stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
            )}>
              {stat.trend === 'up' ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{stat.change}</span>
            </div>
          </div>
          <div>
            <p className="text-2xl font-semibold text-luxury-light">{stat.value}</p>
            <p className="text-sm text-luxury-muted mt-1">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
