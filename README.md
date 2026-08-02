# 🧴 AMFRAGRANCESINDIA - Luxury Perfume E-Commerce Platform

> **Enterprise-grade luxury perfume e-commerce platform built with Next.js 15, TypeScript, and Tailwind CSS.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-cyan)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5-green)](https://www.prisma.io/)
[![Vercel](https://img.shields.io/badge/Vercel-Deploy-black)](https://vercel.com/)

## ✨ Features

### 🎨 Premium Design
- Luxury fragrance-inspired UI/UX
- Custom animations & transitions
- Glassmorphism effects
- High-end typography (Playfair Display + Inter)
- Fully responsive design
- Mobile-first approach

### 🛍️ Shopping Experience
- Advanced product catalog
- Smart search & filters
- Product comparison
- Wishlist & cart
- Coupon system
- Gift cards
- Back-in-stock notifications

### 💳 Payments
- Razorpay integration
- UPI, Cards, Net Banking
- Wallets & EMI
- Secure checkout
- PCI DSS compliant

### 👤 User Accounts
- Email & mobile registration
- OTP verification
- Social login (Google)
- Order history
- Address book
- Profile management

### ⚙️ Admin Dashboard
- Product management
- Order management
- Customer management
- Inventory control
- Coupon management
- Blog management
- Analytics & reports

### 📈 Marketing
- SEO optimized
- Blog system
- Email marketing
- Abandoned cart recovery
- Referral system

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (Supabase)
- Razorpay account
- Resend account (emails)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/amfrangrances/amfragrancesindia.git
cd amfragrancesindia
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials.

4. **Set up database:**
```bash
npx prisma migrate deploy
npx prisma db seed
```

5. **Run development server:**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📦 Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | Next.js 15, React 19, TypeScript |
| **Styling** | Tailwind CSS |
| **Database** | PostgreSQL (Supabase) |
| **ORM** | Prisma |
| **Authentication** | NextAuth.js v5 |
| **Payments** | Razorpay |
| **Email** | Resend |
| **Hosting** | Vercel |
| **Storage** | Supabase Storage |

## 📁 Project Structure

```
am-fragrances/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Initial data
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/           # Authentication pages
│   │   ├── (shop)/           # Shop pages
│   │   ├── admin/            # Admin dashboard
│   │   └── api/              # API routes
│   ├── components/           # React components
│   ├── lib/                  # Utilities
│   └── types/                # TypeScript types
└── public/                    # Static assets
```

## 🎨 Design System

### Colors
- **Primary:** `#0a0a0a` (Rich Black)
- **Secondary:** `#c9a96e` (Gold)
- **Accent:** `#f7e7ce` (Champagne)
- **Background:** `#ffffff` (White)

### Typography
- **Headings:** Playfair Display (serif)
- **Body:** Inter (sans-serif)

## 🔒 Security

- ✅ HTTPS enforcement
- ✅ Secure authentication
- ✅ CSRF protection
- ✅ XSS prevention
- ✅ SQL injection prevention
- ✅ Rate limiting
- ✅ OWASP Top 10 mitigation

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy:**
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy!

## 📊 Performance

- ⚡ Optimized build (0 errors)
- 📦 Optimized bundle sizes
- 🖼️ Image optimization
- 🎯 Code splitting
- 🌐 CDN distribution
- ⚡ Edge caching

## 📝 License

© 2025 AMFRAGRANCESINDIA. All rights reserved.

## 🤝 Support

For support, email deploy@amfragrancesindia.com

---

**Built with ❤️ for AMFRAGRANCESINDIA**
