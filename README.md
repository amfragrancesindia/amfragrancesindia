# AM Fragrances — online store

The storefront for **AM Fragrances India**: luxury eaux de parfum, attars and perfume oils.
Built with Next.js 15 (App Router), TypeScript, Tailwind CSS, Prisma and Auth.js, and hosted on
Cloudflare Workers with a Cloudflare D1 database.

## What's included

- **Storefront** — home page, product listing with filters/sort/search, product pages with size
  selection, wishlist, cart drawer and cart page, coupon codes, checkout with Cash on Delivery and
  Razorpay (UPI, cards, net banking, wallets), order confirmation.
- **Customer accounts** — register, sign in (email/password, optional Google), password reset by
  email, profile, saved addresses, order history.
- **Admin panel** (`/admin`) — dashboard, orders (status + tracking), customers, contact messages,
  newsletter subscribers, and a full product manager: add/edit/delete products, sizes, prices and
  MRP, stock, photo upload and ordering (stored in Cloudflare R2), notes, labels, the featured
  product, drafts and SEO text. Only users with the `ADMIN` role can open it.
- **Content** — About, Contact, FAQ, Shipping, Refund, Privacy and Terms pages; sitemap, robots.txt,
  Open Graph image and structured data for search engines.

## Quick start

```bash
npm install
cp .env.example .env.local   # at least AUTH_SECRET
npm run db:migrate:local     # tables in a local D1 database
npm run dev                  # http://localhost:3000
```

`npm run preview` runs the real Cloudflare build locally (http://localhost:8787).

## Everyday changes

| To change… | Where |
| --- | --- |
| Products, prices, sizes, stock, photos, notes, featured product | **Admin → Products** (no code change) |
| Phone, email, address, shipping fee & free-shipping threshold | `src/lib/site.ts` |
| Coupon codes | `COUPONS` in `src/lib/pricing.ts` |
| Banners | `public/images/am/banners/` |
| Policy text | `src/app/(shop)/*-policy/page.tsx`, `src/app/(shop)/terms/page.tsx` |

Prices include GST. The server always re-prices the cart from the database, so what the browser
sends can never change what a customer pays. The original 14 products are kept in
`src/lib/starter-products.ts` for the admin panel's one-click import.

## Database and admin account

The tables are defined in `prisma/schema.prisma` and created by the SQL files in `migrations/`.
To make someone an admin, register with their email and run in the D1 console:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'you@example.com';
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server (local D1 database) |
| `npm run preview` | Cloudflare build on the local Workers runtime |
| `npm run deploy` | Build and deploy from this computer (normally GitHub does this) |
| `npm run typecheck` | TypeScript check |
| `npm run db:migrate:local` / `db:migrate:remote` | Apply `migrations/` to the local / live D1 database |

See [DEPLOYMENT.md](DEPLOYMENT.md) for going live on Cloudflare.
