'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const announcement = {
  text: 'Free shipping on orders above ₹1,999 | Use code WELCOME10 for 10% off',
  link: '/catalog',
};

export function AnnouncementBar() {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-gold-500 text-luxury-black"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-medium py-2 text-center">
          {announcement.link ? (
            <Link href={announcement.link} className="hover:underline">
              {announcement.text}
            </Link>
          ) : (
            announcement.text
          )}
        </p>
      </div>
    </motion.div>
  );
}
