# Deploying AM Fragrances (Cloudflare Workers + D1)

The site runs on **Cloudflare Workers** (built with `@opennextjs/cloudflare`). Products, accounts,
orders and messages live in a **Cloudflare D1** database, and product photos uploaded in the admin
panel live in **Cloudflare R2**. Once the Worker is connected to the GitHub repository, every push
to `main` builds and deploys automatically.

**Plan:** use the **Workers Paid** plan ($5/month). Signing in and registering hash passwords, which
takes a few hundred milliseconds of CPU; the free plan allows 10 ms per request. The Worker itself
is about 2.6 MB compressed (free limit 3 MB, paid 10 MB).

## 1. Database (once)

1. Cloudflare dashboard → **Storage & databases → D1 SQL Database → Create**, name it `amfragrances`.
2. Copy its **Database ID** into `wrangler.jsonc` (`d1_databases → database_id`) and commit.
3. Open the database → **Console** and run each file in `migrations/` in order (`0001_init.sql`,
   then `0002_products.sql`). The console runs everything as one line, so leave out the `--`
   comment lines when pasting. (From a computer with Wrangler logged in, `npm run db:migrate:remote`
   applies them all.)

## 1b. Photo storage (once, before the first deploy that includes it)

Cloudflare dashboard → **Storage & databases → R2 Object Storage → Create bucket**, name it
`amfragrances-media` (location: Automatic). R2 is free up to 10 GB; Cloudflare may ask you to
activate R2 first. The Worker reaches it through the `MEDIA` binding in `wrangler.jsonc`. A deploy
fails while the bucket doesn't exist.

## 2. Worker (once)

If an old Cloudflare **Pages** project is connected to this repository, delete it first
(Workers & Pages → the project → Settings → Delete). Then:

**Workers & Pages → Create → Import a repository → GitHub → `amfragrancesindia`**

| Setting | Value |
| --- | --- |
| Project name | `amfragrancesindia` (must match `name` in `wrangler.jsonc`) |
| Build command | `npx opennextjs-cloudflare build` |
| Deploy command | `npx opennextjs-cloudflare deploy` |

The site is then live at `https://amfragrancesindia.<your-subdomain>.workers.dev`.

## 3. Variables and secrets

Worker → **Settings → Variables and Secrets → Add**, then **Deploy**:

| Name | Type | Needed for |
| --- | --- | --- |
| `AUTH_SECRET` | Secret | **Required** — sign-in. Any long random string (`npx auth secret`). |
| `RAZORPAY_KEY_ID` | Text | Online payments |
| `RAZORPAY_KEY_SECRET` | Secret | Online payments |
| `RAZORPAY_WEBHOOK_SECRET` | Secret | Online payments (secret you choose for the webhook, step 6) |
| `RESEND_API_KEY` | Secret | Order confirmations, password resets, contact notifications |
| `EMAIL_FROM` | Text | Optional sender, e.g. `AM Fragrances <orders@amfragrancesindia.com>` |
| `STORE_NOTIFY_EMAIL` | Text | Optional inbox for new-order and contact notifications |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Text, Secret | Optional “Continue with Google” (redirect URI `https://<domain>/api/auth/callback/google`) |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Secret | Optional shared rate limiting |

Online payment is offered only when all three Razorpay values are set. `wrangler.jsonc` has
`keep_vars: true`, so deploys never remove these.

The public address (sitemap, search results, social previews, email links) is
`https://amfragrancesindia.com`, set in `src/lib/site.ts` (a build variable `NEXT_PUBLIC_APP_URL`
overrides it, e.g. for a test copy). `cloudflare-worker.js` redirects `www.` and the workers.dev
address to it; if the domain ever changes, update both files.

## 4. Admin account

Register on the site with your email, then in D1 → **Console** run:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'you@example.com';
```

Open `/admin`.

## 4b. Products

Products are managed in **Admin → Products**: add and edit products, sizes and prices (with MRP),
stock, photos, notes, labels, the home-page featured product, drafts and SEO text. Changes are live
immediately.

The first time, the product list is empty: click **Import the 14 starter products** to load the
original range (safe to click again — it skips products that already exist). Deleting a product
never changes past orders; they keep their own copy of the name, size and price.

## 5. Custom domain

The store uses `amfragrancesindia.com` (registered with Cloudflare Registrar on 2026-09-30, renews
automatically). Worker → **Settings → Domains & Routes → Add → Custom domain**: add
`amfragrancesindia.com` and `www.amfragrancesindia.com`. The domain has to be on Cloudflare DNS; if a
DNS record for that name already exists, delete it first.

Mail to the domain (for example `luxury@amfragrancesindia.com`, shown on the site) is forwarded to the
store's own inbox with **Email Routing** (domain → Email → Email Routing).

## 6. Razorpay webhook

Razorpay Dashboard → Settings → Webhooks → Add:

- URL: `https://<your-domain>/api/payment/webhook`
- Secret: the value of `RAZORPAY_WEBHOOK_SECRET`
- Events: `payment.captured`, `payment.failed`, `order.paid`

Test with Razorpay **test keys** first, then switch to live keys.

## 7. Email (Resend)

Create a Resend account, add and verify your domain (Resend shows the DNS records to add in
Cloudflare), create an API key and save it as `RESEND_API_KEY`.

## Changing the database later

1. Edit `prisma/schema.prisma`.
2. Create the next migration from the local copy of the database:
   `npm run db:migrate:local` (once), then
   `npx prisma migrate diff --from-local-d1 --to-schema-datamodel prisma/schema.prisma --script --output migrations/0002_<name>.sql`
3. Run the new file on D1 (Console, or `npm run db:migrate:remote`) before pushing code that needs it.

## Local development

- `npm run db:migrate:local` once — creates the tables in a local D1 database (`.wrangler/`).
- `npm run dev` — Next.js dev server at http://localhost:3000, using the local D1 database.
- `npm run preview` — the real Cloudflare build on the local Workers runtime at
  http://localhost:8787 (reads secrets such as `AUTH_SECRET` from `.dev.vars`).

## Go-live checklist

- [ ] Workers Paid plan active; `AUTH_SECRET` set.
- [ ] Contact details in `src/lib/site.ts` are real (phone, email, address).
- [ ] Policy pages reviewed (shipping, refund, privacy, terms) — add a named grievance officer.
- [ ] Place a test order with Cash on Delivery (and Razorpay test mode, once set up).
- [ ] Check the order arrives in `/admin/orders`.
- [ ] Submit `https://<domain>/sitemap.xml` in Google Search Console.

## Secrets

Real keys and passwords live only in the Cloudflare dashboard (and in your own untracked
`.env.local` / `.dev.vars`). `.gitignore` blocks every `.env*` and `.dev.vars` file except
`.env.example`. If a secret is ever pushed or shared by mistake, rotate it at its provider and update
it in Cloudflare.
