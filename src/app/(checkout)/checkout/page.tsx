'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AgeGate } from '@/components/layout/AgeGate';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

const steps = [
  { id: 1, name: 'Shipping' },
  { id: 2, name: 'Payment' },
  { id: 3, name: 'Review' },
];

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="min-h-screen bg-luxury-black">
      <AgeGate />
      <AnnouncementBar />
      <Header />

      <main className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-serif text-4xl text-luxury-light mb-8">Checkout</h1>

          {/* Stepper */}
          <div className="flex items-center justify-between mb-12">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                      currentStep >= step.id
                        ? 'bg-gold-500 text-luxury-black'
                        : 'bg-luxury-dark text-luxury-muted border border-white/10'
                    )}
                  >
                    {step.id}
                  </div>
                  <span
                    className={cn(
                      'text-sm font-medium hidden sm:block',
                      currentStep >= step.id ? 'text-luxury-light' : 'text-luxury-muted'
                    )}
                  >
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-16 sm:w-24 h-0.5 bg-white/10 mx-4" />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="bg-luxury-dark border border-white/5 rounded-lg p-6 md:p-8">
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="font-serif text-2xl text-luxury-light mb-6">Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Full Name" placeholder="John Doe" />
                  <Input label="Email" type="email" placeholder="john@example.com" />
                  <Input label="Phone" placeholder="+91 98765 43210" />
                  <Input label="Address" placeholder="123 Main Street" />
                  <Input label="City" placeholder="Mumbai" />
                  <Input label="State" placeholder="Maharashtra" />
                  <Input label="PIN Code" placeholder="400001" />
                  <Input label="Country" defaultValue="India" />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="font-serif text-2xl text-luxury-light mb-6">Payment Method</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallet', 'EMI', 'Cash on Delivery'].map((method) => (
                    <button
                      key={method}
                      className="p-4 border border-white/10 rounded-lg hover:border-gold-500 transition-colors text-left"
                    >
                      <span className="text-luxury-light font-medium">{method}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="font-serif text-2xl text-luxury-light mb-6">Review & Place Order</h2>
                <p className="text-luxury-muted">Review your order details before placing the order.</p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
              {currentStep > 1 ? (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              ) : (
                <Link href="/checkout/cart">
                  <Button variant="outline">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back to Cart
                  </Button>
                </Link>
              )}
              {currentStep < 3 ? (
                <Button
                  variant="primary"
                  onClick={() => setCurrentStep(currentStep + 1)}
                >
                  Continue
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button variant="primary">Place Order</Button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}
