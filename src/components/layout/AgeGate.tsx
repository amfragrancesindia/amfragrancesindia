'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';

const MINIMUM_AGE = 18;

export function AgeGate() {
  const [isVisible, setIsVisible] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem('age_verified');
    if (verified === 'true') {
      setIsVerified(true);
    } else {
      setIsVisible(true);
    }
  }, []);

  const handleVerify = () => {
    localStorage.setItem('age_verified', 'true');
    setIsVerified(true);
    setIsVisible(false);
  };

  const handleDeny = () => {
    window.location.href = 'https://www.google.com';
  };

  return (
    <AnimatePresence>
      {isVisible && !isVerified && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-luxury-black/95 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="max-w-md mx-auto px-6 text-center"
          >
            <h2 className="font-serif text-4xl text-gold-500 mb-4">Age Verification</h2>
            <p className="text-luxury-secondary mb-2">
              You must be {MINIMUM_AGE} years or older to enter this website.
            </p>
            <p className="text-luxury-muted text-sm mb-8">
              By entering, you confirm that you are of legal age to purchase
              fragrance products in your country.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" onClick={handleVerify} size="lg">
                I am {MINIMUM_AGE} or older
              </Button>
              <Button variant="outline" onClick={handleDeny} size="lg">
                Exit
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
