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
import { forgotPasswordSchema } from '@/lib/validations';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data = { email: formData.get('email') as string };

    const result = forgotPasswordSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setEmailSent(true);
        toast.success('Password reset link sent to your email');
      } else {
        toast.error('Something went wrong');
      }
    } catch {
      toast.error('Something went wrong');
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
              <h1 className="font-serif text-3xl text-luxury-light">Reset Password</h1>
              <p className="text-luxury-muted mt-2">
                Enter your email and we'll send you a reset link
              </p>
            </div>

            {emailSent ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✓</span>
                </div>
                <p className="text-luxury-secondary mb-6">
                  We've sent a password reset link to your email address.
                </p>
                <Link href="/auth/login">
                  <Button variant="primary" className="w-full">Back to Login</Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  error={errors.email}
                />
                <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
                  Send Reset Link
                </Button>
              </form>
            )}

            <p className="mt-6 text-center text-sm text-luxury-muted">
              Remember your password?{' '}
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
