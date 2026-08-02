'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { Product } from '@/types/product';

interface NewArrivalsSectionProps {
  products?: Product[];
}

export function NewArrivalsSection({ products = [] }: NewArrivalsSectionProps) {
  return (
    <section className="py-20 md:py-32 bg-luxury-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <h2 className="font-serif text-4xl md:text-5xl text-luxury-light mb-4">
              New Arrivals
            </h2>
            <div className="w-24 h-0.5 bg-gold-500" />
          </div>
          <Link
            href="/catalog?isNew=true"
            className="hidden md:flex items-center gap-2 text-gold-500 hover:text-gold-400 transition-colors font-medium"
          >
            View All New Arrivals
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* Products Carousel */}
        <div className="relative">
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {products.length > 0 ? (
              products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex-shrink-0 w-[280px] snap-start"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))
            ) : (
              // Placeholder
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-[280px] bg-luxury-dark border border-white/5 rounded-lg overflow-hidden"
                >
                  <div className="aspect-[3/4] bg-luxury-darker animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-luxury-darker rounded animate-pulse" />
                    <div className="h-3 bg-luxury-darker rounded w-2/3 animate-pulse" />
                    <div className="h-5 bg-luxury-darker rounded w-1/3 animate-pulse" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Mobile View All */}
        <div className="md:hidden text-center mt-8">
          <Link href="/catalog?isNew=true" className="text-gold-500 font-medium">
            View All New Arrivals
          </Link>
        </div>
      </div>
    </section>
  );
}
