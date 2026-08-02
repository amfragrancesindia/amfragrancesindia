# 🚀 AMFRAGRANCESINDIA - Deployment Guide

## Prerequisites
- GitHub account: `amfrangrances`
- Vercel account (free tier works)
- Supabase account (already configured)

---

## Step 1: Push Code to GitHub

Open a terminal in your project folder and run:

```bash
cd "C:\Users\ROG PC\Desktop\AM Frangrances"
git push origin main
```

When prompted:
- **Username:** `amfrangrances`
- **Password:** Enter your GitHub Personal Access Token (PAT)

> Don't have a PAT? Generate one at: https://github.com/settings/tokens
> - Click "Generate new token" → "Generate new token (classic)"
> - Select `repo` scope
> - Copy the token (starts with `ghp_`)

---

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to:** https://vercel.com/new
2. **Import** your GitHub repository:
   - Repository: `amfrangrances/amfragrancesindia`
   - Click "Import"

3. **Configure Project:**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build` (auto-filled)
   - Output Directory: `.next` (auto-filled)

4. **Add Environment Variables:**
   Click "Environment Variables" and add ALL variables from your `.env` file:

   | Variable | Value |
   |----------|-------|
   | `DATABASE_URL` | Your Supabase PostgreSQL URL |
   | `NEXTAUTH_SECRET` | Your auth secret (run `openssl rand -base64 32` to generate) |
   | `NEXTAUTH_URL` | `https://your-domain.vercel.app` (update after first deploy) |
   | `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Your Razorpay key |
   | `RAZORPAY_KEY_SECRET` | Your Razorpay secret |
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
   | `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |
   | `RESEND_API_KEY` | Your Resend email API key |
   | `NEXT_PUBLIC_SITE_URL` | `https://your-domain.com` |
   | `ADMIN_EMAIL` | Your admin email |
   | `NODE_ENV` | `production` |

5. **Click "Deploy"**
   - Vercel will build and deploy your site
   - This takes ~2-3 minutes
   - You'll get a URL like: `https://amfragrancesindia.vercel.app`

---

## Step 3: Configure Custom Domain

1. In Vercel Dashboard → Your Project → **Settings** → **Domains**
2. Add your domain: `amfragrancesindia.com`
3. Add `www` subdomain: `www.amfragrancesindia.com`
4. Update your domain's DNS settings:

   **For apex domain (amfragrancesindia.com):**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   ```

   **For www subdomain:**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

5. Wait for DNS propagation (5-30 minutes)

---

## Step 4: Update Environment Variables

After deployment, update these in Vercel:

1. `NEXTAUTH_URL` → `https://amfragrancesindia.com`
2. `NEXT_PUBLIC_SITE_URL` → `https://amfragrancesindia.com`

---

## Step 5: Database Setup (Supabase)

1. Go to: https://supabase.com/dashboard/project/ldxerqawubzhpkasaggy/sql
2. Click "SQL Editor"
3. Paste the content of `prisma/seed.ts`
4. Click "Run" to create tables and seed data
5. Go to Storage → Create buckets:
   - `products` (public)
   - `categories` (public)
   - `banners` (public)
   - `blogs` (public)
   - `avatars` (public)

---

## Step 6: Razorpay Setup

1. Go to https://dashboard.razorpay.com/
2. Switch to **Live Mode** (after testing in Test Mode)
3. Update Webhook URL: `https://amfragrancesindia.com/api/razorpay/webhook`
4. Configure webhook events:
   - `payment.captured`
   - `payment.failed`
   - `refund.processed`

---

## Step 7: Email Setup (Resend)

1. Go to https://resend.com/domains
2. Add and verify your domain: `amfragrancesindia.com`
3. Update DNS records as instructed by Resend
4. Update `RESEND_API_KEY` in Vercel with your production API key

---

## Step 8: Deploy Admin Panel

Admin panel is included in the same deployment. Access it at:
- `https://amfragrancesindia.com/admin/login`

**Default admin credentials:**
- Email: Check your seed data
- Password: Check your seed data

> ⚠️ **IMPORTANT:** Change default admin password after first login!

---

## Step 9: Production Checklist

- [ ] Custom domain configured and working
- [ ] SSL certificate active (automatic with Vercel)
- [ ] All environment variables set in Vercel
- [ ] Database seeded with initial data
- [ ] Razorpay in Live Mode
- [ ] Email domain verified
- [ ] Admin password changed
- [ ] Test full checkout flow
- [ ] Test OTP verification
- [ ] Test wishlist functionality
- [ ] Test search functionality
- [ ] Verify mobile responsiveness

---

## Performance Optimization

The site is already optimized with:
- ✅ Next.js Image Optimization
- ✅ Font Optimization (Next.js Font)
- ✅ Code Splitting
- ✅ Static Generation where possible
- ✅ Lazy Loading
- ✅ CDN (Vercel Edge Network)

For additional optimization:
1. Enable Vercel Analytics
2. Configure Vercel Speed Insights
3. Set up Vercel Edge Functions for caching

---

## Monitoring & Maintenance

### Vercel Analytics
Enable in Vercel Dashboard → Analytics → Enable

### Error Monitoring
Consider adding Sentry for production error tracking:
```bash
npm install @sentry/nextjs
```

### Uptime Monitoring
Use UptimeRobot or similar to monitor:
- https://amfragrancesindia.com
- https://amfragrancesindia.com/api/health

---

## Scaling Considerations

### When to Scale:
- **Traffic > 10,000/month:** Consider upgrading to Vercel Pro
- **Traffic > 100,000/month:** Consider dedicated database (Supabase Pro)
- **High traffic spikes:** Enable Vercel Edge Caching

### Database Optimization:
- Add indexes for frequently queried fields
- Implement connection pooling (already configured)
- Consider read replicas for high traffic

### CDN & Caching:
- Vercel Edge Network (automatic)
- Static assets cached globally
- API routes can be cached with appropriate headers

---

## Security Checklist

- ✅ HTTPS enforced (automatic with Vercel)
- ✅ Secure authentication (NextAuth.js)
- ✅ CSRF protection
- ✅ XSS prevention (React built-in)
- ✅ SQL Injection prevention (Prisma ORM)
- ✅ Rate limiting on API routes
- ✅ Secure file uploads
- ✅ Environment variables secured
- ✅ OWASP Top 10 mitigated

---

## Support & Troubleshooting

### Build Errors:
Check Vercel Deployment Logs for detailed error messages.

### Database Connection Issues:
- Verify DATABASE_URL in Vercel environment variables
- Check Supabase project status
- Ensure IP whitelist allows Vercel IPs

### Payment Issues:
- Verify Razorpay keys are correct
- Check webhook configuration
- Test in Test Mode first

### Email Not Sending:
- Verify Resend API key
- Check domain verification status
- Review Resend logs

---

## Quick Commands

```bash
# Local development
npm run dev

# Build for production
npm run build

# Run production build locally
npm run start

# Run database migrations
npx prisma migrate deploy

# Seed database
npx prisma db seed

# Generate Prisma client
npx prisma generate
```

---

## Next Steps After Deployment

1. **SEO Setup:**
   - Submit sitemap to Google Search Console
   - Submit sitemap to Bing Webmaster Tools
   - Configure Google Analytics

2. **Marketing:**
   - Set up Google Ads account
   - Create social media accounts
   - Configure email marketing campaigns

3. **Legal:**
   - Add Privacy Policy page
   - Add Terms of Service page
   - Add Shipping Policy page
   - Add Return & Refund Policy page
   - Add Contact page

4. **Analytics:**
   - Install Google Analytics 4
   - Set up conversion tracking
   - Configure goals and events

---

## 🎉 Congratulations!

Your enterprise-grade luxury perfume e-commerce platform is now live!

**Live URL:** `https://amfragrancesindia.com`

---

Built with ❤️ for AMFRAGRANCESINDIA
© 2025 AMFRAGRANCESINDIA. All rights reserved.
