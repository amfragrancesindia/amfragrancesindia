'use client';

import React from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const footerSections = [
  {
    title: 'Shop',
    links: [
      { name: 'All Fragrances', href: '/catalog' },
      { name: 'Men', href: '/catalog?gender=MEN' },
      { name: 'Women', href: '/catalog?gender=WOMEN' },
      { name: 'Unisex', href: '/catalog?gender=UNISEX' },
      { name: 'New Arrivals', href: '/catalog?isNew=true' },
      { name: 'Best Sellers', href: '/catalog?bestseller=true' },
      { name: 'Limited Edition', href: '/catalog?isLimited=true' },
    ],
  },
  {
    title: 'Help',
    links: [
      { name: 'Contact Us', href: '/contact' },
      { name: 'FAQs', href: '/faqs' },
      { name: 'Shipping & Returns', href: '/shipping' },
      { name: 'Track Order', href: '/track-order' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms & Conditions', href: '/terms' },
    ],
  },
  {
    title: 'About',
    links: [
      { name: 'Our Story', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
      { name: 'Sustainability', href: '/sustainability' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-luxury-darker border-t border-white/5">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/">
              <h2 className="font-serif text-2xl text-gold-500 tracking-[0.15em] mb-4">
                AMFRAGRANCESINDIA
              </h2>
            </Link>
            <p className="text-luxury-muted text-sm leading-relaxed mb-6 max-w-sm">
              Luxury fragrances crafted for the discerning. Experience the art of Indian
              perfumery with our exclusive collection of premium scents.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-luxury-muted">
                <Mail className="h-4 w-4 text-gold-500" />
                <span>luxury@amfragrancesindia.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-luxury-muted">
                <Phone className="h-4 w-4 text-gold-500" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-luxury-muted">
                <MapPin className="h-4 w-4 text-gold-500" />
                <span>Mumbai, India</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 mt-6">
              {[
                { icon: Instagram, href: '#' },
                { icon: Facebook, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Youtube, href: '#' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="p-2 border border-white/10 rounded-full hover:border-gold-500 hover:text-gold-500 transition-colors"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-display text-sm font-semibold text-luxury-light uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-luxury-muted hover:text-gold-500 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-luxury-muted">
              © {new Date().getFullYear()} AMFRAGRANCESINDIA. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-xs text-luxury-muted">Secure Payments:</span>
              <div className="flex items-center gap-3">
                {['Visa', 'MC', 'UPI', 'Razorpay'].map((payment) => (
                  <span
                    key={payment}
                    className="px-2 py-1 bg-luxury-dark border border-white/10 rounded text-xs text-luxury-muted"
                  >
                    {payment}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
