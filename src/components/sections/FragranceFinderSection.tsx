'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function FragranceFinderSection() {
  return (
    <section className="py-20 md:py-32 bg-luxury-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gold-500/10 via-luxury-dark to-purple-500/10 border border-gold-500/20"
        >
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=1920&q=80')] bg-cover bg-center opacity-10" />
          <div className="relative z-10 px-8 py-16 md:px-16 md:py-24 text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-500/20 mb-6"
            >
              <Sparkles className="h-8 w-8 text-gold-500" />
            </motion.div>
            <h2 className="font-serif text-4xl md:text-5xl text-luxury-light mb-4">
              Find Your Signature Scent
            </h2>
            <p className="text-luxury-secondary text-lg max-w-2xl mx-auto mb-8">
              Not sure which fragrance suits you? Take our interactive scent quiz and
              discover your perfect match based on your personality, preferences, and lifestyle.
            </p>
            <Link href="/quiz">
              <Button variant="primary" size="lg">
                Take the Quiz
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
