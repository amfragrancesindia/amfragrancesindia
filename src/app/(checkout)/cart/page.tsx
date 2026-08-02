'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AgeGate } from '@/components/layout/AgeGate';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { useCart } from '@/components/providers/CartProvider';
import { Button } from '@/components/ui/Button';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { Price } from '@/components/ui/Price';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, discount, shipping, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-luxury-black">
        <AgeGate />
        <AnnouncementBar />
        <Header />
        <main className="pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ShoppingBag className="h-24 w-24 text-luxury-muted mx-auto mb-6" />
            <h1 className="font-serif text-4xl text-luxury-light mb-4">Your Cart is Empty</h1>
            <p className="text-luxury-muted mb-8">
              Looks like you haven't added any fragrances to your cart yet.
            </p>
            <Link href="/catalog">
              <Button variant="primary" size="lg">
                Explore Collection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black">
      <AgeGate />
      <AnnouncementBar />
      <Header />

      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl md:text-5xl text-luxury-light mb-8">
            Shopping Cart
          </h1>
          <p className="text-luxury-muted mb-8">
            {items.reduce((sum, item) => sum + item.quantity, 0)} items
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="flex gap-4 p-4 bg-luxury-dark border border-white/5 rounded-lg"
                >
                  {/* Image */}
                  <div className="w-24 h-32 flex-shrink-0 rounded-md overflow-hidden bg-luxury-darker">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-lg text-luxury-light">{item.name}</h3>
                      {item.variant && (
                        <p className="text-sm text-luxury-muted">
                          {item.variant.name} {item.variant.volume && `(${item.variant.volume})`}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <QuantitySelector
                        value={item.quantity}
                        onChange={(qty) => updateQuantity(item.productId, item.variantId, qty)}
                        min={1}
                        max={99}
                      />
                      <div className="flex items-center gap-4">
                        <Price price={item.price * item.quantity} size="md" />
                        <button
                          onClick={() => removeItem(item.productId, item.variantId)}
                          className="p-2 text-luxury-muted hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-luxury-dark border border-white/5 rounded-lg p-6 space-y-4">
                <h3 className="font-serif text-xl text-luxury-light">Order Summary</h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-luxury-secondary">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Discount</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-luxury-secondary">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-luxury-light">Total</span>
                    <span className="text-gold-500">{formatPrice(total)}</span>
                  </div>
                </div>

                <Link href="/checkout/checkout">
                  <Button variant="primary" size="lg" className="w-full">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>

                <Link href="/catalog">
                  <Button variant="outline" size="md" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

