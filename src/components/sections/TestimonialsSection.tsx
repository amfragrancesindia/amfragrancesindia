'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
    text: 'Absolutely stunning fragrances. Royal Oud is now my signature scent. The quality and longevity are unmatched.',
    product: 'Royal Oud',
  },
  {
    id: 2,
    name: 'Rahul Kapoor',
    location: 'Delhi',
    rating: 5,
    text: 'The Saffron Elixir is incredible. Gets compliments every time I wear it. Premium quality at an amazing price.',
    product: 'Saffron Elixir',
  },
  {
    id: 3,
    name: 'Ananya Reddy',
    location: 'Bangalore',
    rating: 5,
    text: 'Beautiful packaging, amazing scents. Jasmine Noir is my favorite. Will definitely be ordering more!',
    product: 'Jasmine Noir',
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 md:py-32 bg-luxury-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl text-luxury-light mb-4">
            What Our Customers Say
          </h2>
          <p className="text-luxury-muted max-w-xl mx-auto">
            Don't just take our word for it — hear from our community of fragrance lovers.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-luxury-black border border-white/5 rounded-lg p-8 hover:border-gold-500/20 transition-colors"
            >
              <Quote className="h-8 w-8 text-gold-500/30 mb-4" />
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-gold-500 fill-gold-500" />
                ))}
              </div>
              <p className="text-luxury-secondary leading-relaxed mb-6 italic">
                "{testimonial.text}"
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-luxury-light">{testimonial.name}</p>
                  <p className="text-sm text-luxury-muted">{testimonial.location}</p>
                </div>
                <span className="text-xs text-gold-500 bg-gold-500/10 px-2 py-1 rounded">
                  {testimonial.product}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
