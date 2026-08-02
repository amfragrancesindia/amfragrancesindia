'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { Product } from '@/types/product';

interface BestSellersSectionProps {
  products?: Product[];
}

export function BestSellersSection({ products = [] }: BestSellersSectionProps) {
  return (
    <section className="py-20 md:py-32 bg-luxury-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl md:text-5xl text-luxury-light mb-4">
            Best Sellers
          </h2>
          <div className="w-24 h-0.5 bg-gold-500 mx-auto mb-6" />
          <p className="text-luxury-muted max-w-2xl mx-auto">
            Our most loved fragrances, chosen by discerning customers worldwide.
            Experience the scents that have captivated thousands.
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products.length > 0 ? (
            products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))
          ) : (
            Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-luxury-darker border border-white/5 rounded-lg overflow-hidden"
              >
                <div className="aspect-[3/4] bg-luxury-black animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-luxury-black rounded animate-pulse" />
                  <div className="h-3 bg-luxury-black rounded w-2/3 animate-pulse" />
                  <div className="h-5 bg-luxury-black rounded w-1/3 animate-pulse" />
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/catalog?bestseller=true"
            className="inline-flex items-center gap-2 text-gold-500 hover:text-gold-400 transition-colors font-medium"
          >
            Shop Bestsellers
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
