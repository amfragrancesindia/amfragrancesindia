# AMFRAGRANCESINDIA — Enterprise Luxury Perfume E-Commerce Platform
## Complete Implementation Plan

---

# PHASE 1: Foundation & Setup (Week 1)

## 1.1 Initialize Next.js 14+ Project

npx create-next-app@latest amfragrancesindia --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd amfragrancesindia

### Key packages to install:
- @prisma/client + prisma (ORM)
- next-auth (authentication)
- @tanstack/react-query (server state)
- zod + zod-resolver (validation)
- framer-motion (animations)
- lucide-react (icons)
- react-hook-form + @hookform/resolvers (forms)
- @headlessui/react (headless UI components)
- react-zoom-pan-pinch (product image zoom)
- swiper (carousels/sliders)
- sharp (image optimization)
- razorpay (payments)
- nodemailer (email)
- @radix-ui/* (accessible primitives)

## 1.2 Project File Structure

```
amfragrancesindia/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── catalog/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── men/page.tsx
│   │   │   │   ├── women/page.tsx
│   │   │   │   ├── unisex/page.tsx
│   │   │   │   ├── luxury/page.tsx
│   │   │   │   ├── gifts/page.tsx
│   │   │   │   ├── attars/page.tsx
│   │   │   │   ├── oils/page.tsx
│   │   │   │   └── discovery-sets/page.tsx
│   │   │   ├── products/
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── quiz/
│   │   │   │   └── page.tsx
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── about/page.tsx
│   │   │   └── age-gate/page.tsx
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── forgot-password/page.tsx
│   │   ├── (account)/
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── orders/page.tsx
│   │   │   ├── wishlist/page.tsx
│   │   │   ├── addresses/page.tsx
│   │   │   └── settings/page.tsx
│   │   ├── (checkout)/
│   │   │   ├── layout.tsx
│   │   │   ├── cart/page.tsx
│   │   │   ├── checkout/page.tsx
│   │   │   └── order-confirmation/[id]/page.tsx
│   │   ├── (admin)/
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── products/page.tsx
│   │   │   ├── products/new/page.tsx
│   │   │   ├── products/[id]/page.tsx
│   │   │   ├── orders/page.tsx
│   │   │   ├── customers/page.tsx
│   │   │   ├── inventory/page.tsx
│   │   │   ├── coupons/page.tsx
│   │   │   ├── blog/page.tsx
│   │   │   ├── reviews/page.tsx
│   │   │   └── settings/page.tsx
│   │   ├── payment/
│   │   │   ├── razorpay/page.tsx
│   │   │   └── webhook/route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts
│   │       ├── products/route.ts
│   │       ├── products/[slug]/route.ts
│   │       ├── cart/route.ts
│   │       ├── checkout/route.ts
│   │       ├── orders/route.ts
│   │       ├── reviews/route.ts
│   │       ├── search/route.ts
│   │       ├── upload/route.ts
│   │       └── webhook/route.ts
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Dropdown.tsx
│   │   │   ├── Tabs.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   └── Separator.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── MobileMenu.tsx
│   │   │   ├── AgeGate.tsx
│   │   │   └── AnnouncementBar.tsx
│   │   ├── product/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductImageGallery.tsx
│   │   │   ├── ProductZoom.tsx
│   │   │   ├── ProductFilters.tsx
│   │   │   ├── ProductSort.tsx
│   │   │   ├── ProductComparison.tsx
│   │   │   ├── NotesPyramid.tsx
│   │   │   └── ReviewCard.tsx
│   │   ├── cart/
│   │   │   ├── CartDrawer.tsx
│   │   │   ├── CartItem.tsx
│   │   │   ├── CartSummary.tsx
│   │   │   └── WishlistButton.tsx
│   │   ├── checkout/
│   │   │   ├── CheckoutForm.tsx
│   │   │   ├── AddressForm.tsx
│   │   │   ├── PaymentMethods.tsx
│   │   │   ├── OrderSummary.tsx
│   │   │   └── PaymentGateway.tsx
│   │   ├── admin/
│   │   │   ├── AdminSidebar.tsx
│   │   │   ├── DataTable.tsx
│   │   │   ├── StatCard.tsx
│   │   │   ├── ChartCard.tsx
│   │   │   └── ProductForm.tsx
│   │   ├── sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── FeaturedCollection.tsx
│   │   │   ├── BestSellers.tsx
│   │   │   ├── NewArrivals.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── BrandStory.tsx
│   │   │   └── Newsletter.tsx
│   │   ├── search/
│   │   │   ├── SearchBar.tsx
│   │   │   ├── SearchResults.tsx
│   │   │   └── ScentFinder.tsx
│   │   └── shared/
│   │       ├── LoadingSpinner.tsx
│   │       ├── Image.tsx
│   │       ├── NotFound.tsx
│   │       └── ProtectedRoute.tsx
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   ├── razorpay.ts
│   │   ├── validations.ts
│   │   ├── utils.ts
│   │   ├── constants.ts
│   │   └── errors.ts
│   ├── hooks/
│   │   ├── useCart.ts
│   │   ├── useWishlist.ts
│   │   ├── useProducts.ts
│   │   ├── useAuth.ts
│   │   ├── useDebounce.ts
│   │   └── useLocalStorage.ts
│   ├── types/
│   │   ├── product.ts
│   │   ├── order.ts
│   │   ├── user.ts
│   │   ├── cart.ts
│   │   └── api.ts
│   ├── styles/
│   │   ├── fonts.ts
│   │   └── theme.ts
│   ├── middleware.ts
│   └── .env.local
├── public/
│   ├── images/
│   │   ├── products/
│   │   ├── brand/
│   │   └── blog/
│   ├── fonts/
│   └── icons/
├── tailwind.config.ts
├── next.config.mjs
├── tsconfig.json
├── .eslintrc.json
├── .prettierrc
├── docker-compose.yml
├── vercel.json
├── CLAUDE.md
└── README.md
```

---

# PHASE 2: Database Schema (Week 1-2)

## 2.1 Core Prisma Schema

File: \`prisma/schema.prisma\`

The full Prisma schema defines 11 models: User, Address, Product, FragranceNote, ProductImage, ProductVariant, CartItem, WishlistItem, Order, OrderItem, Review, Coupon, GiftCard, BlogPost, SiteSetting — plus 9 enums (Role, Category, Gender, ProductType, Season, Occasion, NoteType, OrderStatus, PaymentStatus, CouponType).

Key relationships:
- User has many: addresses, orders, reviews, wishlistItems, cartItems
- Product has many: notes, images, variants, reviews, cartItems, orderItems, wishlistItems, coupons
- Order has many: items (OrderItem), belongs to User and Address, optionally to Coupon
- Review links Product and User (unique composite)

## 2.2 Database Index Strategy

PostgreSQL indexes for performance:
- idx_products_category, idx_products_gender, idx_products_is_published, idx_products_is_featured, idx_products_rating
- idx_orders_user, idx_orders_status
- idx_cart_user (with partial index for non-null user_id)
- idx_reviews_product (partial for approved only)

---

# PHASE 3: Core Infrastructure (Week 2)

## 3.1 Design System & Theme

File: \`src/styles/theme.ts\` — Complete design tokens
File: \`src/styles/fonts.ts\` — Cormorant Garamond (serif headings), Inter (sans body), Montserrat (display)

## 3.2 Core Libraries

File: \`src/lib/prisma.ts\` — Prisma singleton with dev logging
File: \`src/lib/razorpay.ts\` — Razorpay SDK with gold theme (#D4AF37)
File: \`src/lib/auth.ts\` — NextAuth with Google OAuth + Credentials provider

## 3.3 Middleware

File: \`src/middleware.ts\` — Admin route protection, auth-only route protection

---

# PHASE 4: Shared UI Components (Week 2-3)

## 4.1 UI Primitives (12 components)

Button, Input, Modal, Card, Badge, Tabs, Toast, Skeleton, Dropdown, Rating, QuantitySelector, Price

## 4.2 Layout Components

Header: Logo (Cormorant Garamond), desktop nav dropdowns, icons (search, wishlist, cart, user), mobile hamburger
Footer: Brand, quick links, customer care, newsletter, payment icons
AgeGate: Full-screen overlay, localStorage persistence, redirect on decline
AnnouncementBar: Promotional banner with dismiss

---

# PHASE 5: Public-Facing Pages (Week 3-5)

## 5.1 Landing Page (8 sections)

Hero, FeaturedCollection, BrandStory, NewArrivals, BestSellers, FragranceFinder, Testimonials, Newsletter

## 5.2 Product Catalog

URL-synced filters, sidebar with checkboxes + price slider, sort dropdown, grid/list toggle, pagination

## 5.3 Product Detail Page

Image gallery (zoom, 360 view, swipe), NotesPyramid component, Tabs (Details, Reviews, Shipping, Q&A), related products, SEO metadata

---

# PHASE 6: Cart, Checkout & Payment (Week 5-6)

## 6.1 Cart
CartProvider (Context), CartDrawer (slide-in), CartSummary

## 6.2 Checkout Flow
4-step: Contact -> Shipping -> Payment -> Review. Stepper component. Address form with saved addresses. Free shipping above Rs 2,999.

## 6.3 Modular Payment Gateway

File: \`src/components/checkout/PaymentGateway.tsx\`

Architecture: \`src/lib/payments/\` with modules for razorpay, cod, giftcard

Flow: Select method -> Create order -> Razorpay modal -> Webhook verify -> Success

Modular HTML: \`src/app/payment/razorpay/page.tsx\` — Self-contained Razorpay checkout module

---

# PHASE 7: User Account & Authentication (Week 6)

Pages: dashboard, orders, wishlist, addresses, settings
Auth: login, register, forgot-password
ProtectedRoute wrapper for all account pages

---

# PHASE 8: Admin Dashboard (Week 6-7)

Layout: collapsible sidebar + header
Pages: Dashboard, Products, Orders, Customers, Inventory, Coupons, Blog, Reviews, Settings
Key components: DataTable, StatCard, ProductForm, OrderDetail Modal

---

# PHASE 9: Search, Filters & Discovery (Week 7)

Smart Search: Full-text with pg_trgm, autocomplete, faceted results, URL-synced params
ProductComparison: Up to 4 products, sessionStorage
ScentFinder: 4-question quiz

---

# PHASE 10: Blog & SEO (Week 8)

Blog pages, Metadata API, JSON-LD, sitemap.ts, robots.ts, Open Graph

---

# PHASE 11: Age Verification & Security

AgeGate component, CSRF tokens, rate limiting, CSP headers, DOMPurify, Zod validation

---

# PHASE 12: Performance Optimization

Cloudinary/S3 + CloudFront, AVIF/WebP, LQIP, ISR (60s revalidation), React Query caching, bundle optimization

---

# PHASE 13: Coupons, Reviews & Notifications

Coupon types: Percentage, Fixed, Free Shipping
Reviews: Submit, approve, feature
Email: Nodemailer templates

---

# PHASE 14: Testing & Quality

Unit, integration, E2E testing. Lighthouse >90, no TS errors, accessibility audit, Core Web Vitals

---

# PHASE 15: Deployment & DevOps

Vercel + PostgreSQL + Cloudinary + Razorpay
Monitoring: Vercel Analytics, GA4, Sentry

---

## Timeline: 10 weeks (2.5 months) | LOC: 15,000-20,000 | Team: 1 senior + 1 designer

## Design: Dark luxury (#0A0A0A bg, #D4AF37 gold, #F5F0EB text), Cormorant Garamond + Inter, glassmorphism, generous whitespace, smooth animations
