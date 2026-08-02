# AMFRAGRANCESINDIA - Deployment Guide

## Prerequisites

1. **GitHub Account** - Create at https://github.com/signup
2. **Vercel Account** - Create at https://vercel.com/signup (use GitHub to sign up)
3. **Razorpay Account** - Create at https://razorpay.com/signup (for payments)
4. **Database** - We'll use Vercel Postgres or Neon (free tier available)

---

## Step 1: Push Code to GitHub

1. Go to https://github.com/new
2. Repository name: `amfragrancesindia`
3. Set to **Private** (recommended for production)
4. **DO NOT** initialize with README
5. Click "Create repository"

6. Run these commands in your terminal:

```bash
# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/amfragrancesindia.git

# Push code to GitHub
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy to Vercel

### Option A: One-Click Deploy (Easiest)

1. Go to https://vercel.com/new
2. Import your `amfragrancesindia` repository from GitHub
3. Vercel will auto-detect Next.js settings
4. Click **"Deploy"**
5. Wait 2-3 minutes for build to complete
6. Your site will be live at: `https://amfragrancesindia.vercel.app`

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? amfragrancesindia
# - In which directory? ./
# - Override settings? No
```

---

## Step 3: Set Up Database

### Option A: Vercel Postgres (Recommended)

1. Go to your Vercel project dashboard
2. Click "Storage" tab
3. Click "Create Database" → Select "Postgres"
4. Copy the connection string

### Option B: Neon (Free Tier)

1. Go to https://neon.tech
2. Sign up with GitHub
3. Create new project: `amfragrancesindia`
4. Copy the connection string

---

## Step 4: Configure Environment Variables

In Vercel Dashboard:
1. Go to your project → "Settings" → "Environment Variables"
2. Add these variables:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/amfragrancesindia

# NextAuth
NEXTAUTH_SECRET=your-secret-key-here-minimum-32-characters
NEXTAUTH_URL=https://amfragrancesindia.vercel.app

# Razorpay (Get from https://dashboard.razorpay.com)
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your-razorpay-secret

# Email (Get from https://resend.com)
RESEND_API_KEY=re_xxxxx
EMAIL_FROM=noreply@amfragrancesindia.com

# App URL
NEXT_PUBLIC_APP_URL=https://amfragrancesindia.vercel.app

# Admin
ADMIN_EMAIL=admin@amfragrancesindia.com
```

**Important:** Replace placeholder values with your actual credentials!

---

## Step 5: Set Up Razorpay

1. Sign up at https://razorpay.com
2. Complete KYC verification
3. Go to "Settings" → "API Keys"
4. Generate test keys (for testing) and live keys (for production)
5. Add keys to Vercel environment variables
6. Configure webhook URL: `https://amfragrancesindia.vercel.app/api/payment/webhook`

---

## Step 6: Run Database Migrations

```bash
# Install Vercel CLI if not already installed
npm install -g vercel

# Pull environment variables
vercel env pull .env.local

# Run migrations
npx prisma migrate deploy

# Seed database with sample data
npx prisma db seed
```

---

## Step 7: Custom Domain Setup

1. Buy domain from:
   - Namecheap: https://namecheap.com
   - GoDaddy: https://godaddy.com
   - Google Domains: https://domains.google

2. In Vercel Dashboard:
   - Go to "Settings" → "Domains"
   - Add your domain: `amfragrancesindia.com`
   - Follow DNS configuration instructions

3. Update DNS records at your domain provider:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

4. Wait 24-48 hours for DNS propagation

---

## Step 8: Test Your Website

### Checklist:
- [ ] Homepage loads correctly
- [ ] Products display properly
- [ ] Search functionality works
- [ ] Cart and checkout flow works
- [ ] User registration/login works
- [ ] Payment gateway works (test mode)
- [ ] Admin dashboard accessible
- [ ] Mobile responsiveness works
- [ ] All pages load without errors
- [ ] SSL certificate active (HTTPS)

---

## Step 9: Production Launch

1. Switch Razorpay to **Live Mode**
2. Update environment variables with live keys
3. Update `NEXTAUTH_URL` to your custom domain
4. Test complete checkout flow with real payment
5. Enable analytics in Vercel
6. Set up monitoring and alerts

---

## Step 10: Post-Launch

### Essential Tasks:
1. **SEO Setup**
   - Submit sitemap to Google Search Console
   - Add meta tags and Open Graph tags
   - Set up Google Analytics

2. **Performance Monitoring**
   - Enable Vercel Analytics
   - Monitor Core Web Vitals
   - Check Lighthouse scores

3. **Security**
   - Enable rate limiting
   - Set up security headers
   - Regular security audits

4. **Backup**
   - Set up database backups
   - Enable Vercel deployment protection

---

## Troubleshooting

### Build Fails
- Check environment variables are set correctly
- Verify all dependencies are in package.json
- Check build logs in Vercel dashboard

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check database is accessible from Vercel
- Ensure migrations have run

### Payment Issues
- Verify Razorpay keys are correct
- Check webhook URL is configured
- Test in test mode first

---

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://prisma.io/docs
- Razorpay Docs: https://razorpay.com/docs

---

## Next Steps

1. Add products to your catalog
2. Customize branding (logo, colors)
3. Set up email templates
4. Configure shipping rates
5. Add blog content
6. Set up social media integration
7. Launch marketing campaigns

---

**Your website is now live at:** https://amfragrancesindia.vercel.app

🎉 **Congratulations!** Your luxury perfume e-commerce platform is now deployed!
