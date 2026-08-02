'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AgeGate } from '@/components/layout/AgeGate';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { HeroSection } from '@/components/sections/HeroSection';
import { FeaturedCollectionSection } from '@/components/sections/FeaturedCollectionSection';
import { BrandStorySection } from '@/components/sections/BrandStorySection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { NewsletterSection } from '@/components/sections/NewsletterSection';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Sparkles, Gift, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

const featuredProducts = [
  { id: '1', name: 'Royal Oud', slug: 'royal-oud', price: 8999, compareAtPrice: 11999, images: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&q=80', category: 'EAU_DE_PARFUM', gender: 'MEN', rating: 4.8, reviewCount: 124, stock: 15, isLimited: true },
  { id: '2', name: 'Saffron Elixir', slug: 'saffron-elixir', price: 7499, images: [''], category: 'EAU_DE_PARFUM', gender: 'WOMEN', rating: 4.9, reviewCount: 89, stock: 23, isBestseller: true },
  { id: '3', name: 'Jasmine Noir', slug: 'jasmine-noir', price: 6999, compareAtPrice: 8999, images: [''], category: 'EAU_DE_PARFUM', gender: 'WOMEN', rating: 4.7, reviewCount: 56, stock: 18, isNew: true },
  { id: '4', name: 'Amber Mystique', slug: 'amber-mystique', price: 9999, images: [''], category: 'LUXURY_COLLECTION', gender: 'UNISEX', rating: 5.0, reviewCount: 42, stock: 8, isLimited: true },
];

const categories = [
  { name: 'Men\'s Fragrances', href: '/catalog?gender=MEN', images: [''] },
  { name: 'Women\'s Fragrances', href: '/catalog?gender=WOMEN', images: [''] },
  { name: 'Unisex', href: '/catalog?gender=UNISEX', images: [''] },
  { name: 'Luxury Collection', href: '/catalog?category=LUXURY_COLLECTION', images: [''] },
  { name: 'Attars', href: '/catalog?category=ATTAR', images: [''] },
  { name: 'Gift Sets', href: '/catalog?category=GIFT_COLLECTION', images: [''] },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-luxury-black">
      <AgeGate />
      <AnnouncementBar />
      <Header />

      <main>
        <HeroSection />

        {/* Categories */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={category.href}>
                    <div className="group relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer">
                      <img
                        src={category.images[0]}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/80 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="font-serif text-sm text-luxury-light group-hover:text-gold-500 transition-colors">
                          {category.name}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <FeaturedCollectionSection products={featuredProducts} />

        {/* Why Choose Us */}
        <section className="py-20 md:py-32 bg-luxury-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl text-luxury-light mb-4">
                Why Choose Us
              </h2>
              <p className="text-luxury-muted max-w-xl mx-auto">
                Experience the difference of genuine luxury fragrances.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Sparkles,
                  title: '100% Authentic',
                  description: 'Every fragrance is sourced directly from authorized distributors and comes with a certificate of authenticity.',
                },
                {
                  icon: Gift,
                  title: 'Premium Packaging',
                  description: 'Luxurious presentation with elegant boxes, making every purchase perfect for gifting.',
                },
                {
                  icon: Flame,
                  title: 'Long-Lasting',
                  description: 'Our fragrances are crafted with the finest ingredients for exceptional longevity and sillage.',
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-8"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-500/10 mb-6">
                    <feature.icon className="h-8 w-8 text-gold-500" />
                  </div>
                  <h3 className="font-serif text-2xl text-luxury-light mb-4">{feature.title}</h3>
                  <p className="text-luxury-muted leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Instagram Gallery */}
        <section className="py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl md:text-5xl text-luxury-light mb-4">
                @AMFRAGRANCESINDIA
              </h2>
              <p className="text-luxury-muted">Share your fragrance moments with us</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {[
                'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80',
                'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80',
                'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80',
                'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80',
                'https://images.unsplash.com/photo-1557174364-dc3859a8f87d?w=400&q=80',
                'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&q=80',
              ].map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="aspect-square rounded-lg overflow-hidden cursor-pointer group">
                    <img
                      src={image}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <BrandStorySection />
        <TestimonialsSection />
        <NewsletterSection />
      </main>

      <Footer />
    </div>
  );
}
