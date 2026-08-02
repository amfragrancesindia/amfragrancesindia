'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PaymentMethod } from '@/lib/payments/types';

interface PaymentGatewayProps {
  method: PaymentMethod;
  amount: number;
  orderId: string;
  onSuccess: (paymentId: string) => void;
  onFailure: (error: string) => void;
}

export function PaymentGateway({ method, amount, orderId, onSuccess, onFailure }: PaymentGatewayProps) {
  const [isLoading, setIsLoading] = useState(false);
  const razorpayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (method === 'COD' || method === 'GIFT_CARD') {
      handleProcess();
    }
  }, [method]);

  const handleProcess = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, method, orderId }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.paymentId) {
          onSuccess(data.paymentId);
        } else {
          // Open Razorpay modal
          openRazorpay(data.razorpayOrder);
        }
      } else {
        onFailure(data.error || 'Payment failed');
      }
    } catch {
      onFailure('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const openRazorpay = (orderData: { id: string; amount: number; currency: string }) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'AMFRAGRANCESINDIA',
        description: 'Luxury Fragrances',
        order_id: orderData.id,
        handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          onSuccess(response.razorpay_payment_id);
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#D4AF37',
          backdrop_prompt_color: '#0A0A0A',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    };
  };

  const getPaymentLabel = () => {
    const labels: Record<PaymentMethod, string> = {
      CREDIT_CARD: 'Pay with Credit Card',
      DEBIT_CARD: 'Pay with Debit Card',
      UPI: 'Pay with UPI',
      NET_BANKING: 'Pay with Net Banking',
      WALLET: 'Pay with Wallet',
      EMI: 'Pay with EMI',
      COD: 'Cash on Delivery',
      GIFT_CARD: 'Pay with Gift Card',
    };
    return labels[method];
  };

  if (method === 'COD') {
    return (
      <div className="text-center py-8">
        <p className="text-luxury-secondary mb-4">
          You have selected Cash on Delivery. Please keep the exact amount ready at the time of delivery.
        </p>
        <p className="text-sm text-luxury-muted">
          Additional ₹40 COD charges apply
        </p>
      </div>
    );
  }

  if (method === 'GIFT_CARD') {
    return (
      <div className="space-y-4">
        <Input label="Gift Card Code" placeholder="Enter gift card code" />
        <Button variant="primary" onClick={handleProcess} isLoading={isLoading} className="w-full">
          Apply Gift Card
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <p className="text-luxury-secondary mb-6">
        Click below to proceed with {getPaymentLabel()}
      </p>
      <Button
        variant="primary"
        size="lg"
        onClick={handleProcess}
        isLoading={isLoading}
        className="min-w-[200px]"
      >
        Pay {formatPrice(amount)}
      </Button>
    </div>
  );
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}
