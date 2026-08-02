'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AgeGate } from '@/components/layout/AgeGate';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { registerSchema } from '@/lib/validations';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    };

    const result = registerSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success('Account created successfully!');
        router.push('/auth/login');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Something went wrong');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-black">
      <AgeGate />
      <AnnouncementBar />
      <Header />

      <main className="pt-20 min-h-[calc(100vh-80px)] flex items-center justify-center py-12">
        <div className="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-luxury-dark border border-white/5 rounded-lg p-8">
            <div className="text-center mb-8">
              <h1 className="font-serif text-3xl text-luxury-light">Create Account</h1>
              <p className="text-luxury-muted mt-2">Join AMFRAGRANCESINDIA</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Full Name"
                name="name"
                placeholder="John Doe"
                error={errors.name}
              />
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="you@example.com"
                error={errors.email}
              />
              <Input
                label="Phone"
                name="phone"
                placeholder="+91 98765 43210"
                error={errors.phone}
              />
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                error={errors.password}
              />
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                error={errors.confirmPassword}
              />

              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" required className="mt-1 accent-gold-500" />
                <span className="text-sm text-luxury-muted">
                  I agree to the{' '}
                  <Link href="/terms" className="text-gold-500 hover:text-gold-400">Terms & Conditions</Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-gold-500 hover:text-gold-400">Privacy Policy</Link>
                </span>
              </label>

              <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
                Create Account
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-luxury-muted">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-gold-500 hover:text-gold-400 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
