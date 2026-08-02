'use client';

import React from 'react';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AgeGate } from '@/components/layout/AgeGate';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-luxury-black">
      <AgeGate />
      <AnnouncementBar />
      <Header />
      <main className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="font-serif text-8xl md:text-9xl text-gold-500 mb-4">404</h1>
          <h2 className="font-serif text-3xl md:text-4xl text-luxury-light mb-4">
            Page Not Found
          </h2>
          <p className="text-luxury-muted mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
            Let us guide you back to luxury.
          </p>
          <Link href="/">
            <Button variant="primary">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
