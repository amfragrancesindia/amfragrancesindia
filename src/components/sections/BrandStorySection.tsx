'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

export function BrandStorySection() {
  return (
    <section className="py-20 md:py-32 bg-luxury-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-sm text-gold-500 uppercase tracking-wider mb-4">Our Story</p>
            <h2 className="font-serif text-4xl md:text-5xl text-luxury-light mb-6">
              The Art of<br />Indian Luxury
            </h2>
            <div className="w-24 h-0.5 bg-gold-500 mb-6" />
            <p className="text-luxury-secondary text-lg leading-relaxed mb-6">
              AMFRAGRANCESINDIA was born from a passion for creating exceptional fragrances
              that celebrate India's rich olfactory heritage while embracing modern luxury.
            </p>
            <p className="text-luxury-muted leading-relaxed mb-8">
              From the bustling markets of Mumbai, our founder discovered the timeless
              art of Indian perfumery. Today, we blend centuries-old traditions with
              international techniques to create world-class fragrances.
            </p>
            <Link href="/about">
              <Button variant="primary">
                Discover Our Story
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=800&q=80"
              alt="Our story"
              className="w-full rounded-lg"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
