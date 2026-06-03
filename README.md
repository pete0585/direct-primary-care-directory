# Direct Primary Care Finder

**DirectPrimaryCareFinder.com** — The national directory for Direct Primary Care practices. Patients find DPC doctors. DPC doctors get found.

- **Domain:** directprimarycarefinder.com
- **Supabase:** fbuqrnzofktepkzyfmhy (shared Directories project, `dpc_` prefixed tables)
- **Vercel Project:** prj_xtGpwqmm39yUaoVUxUrz1dpnB1rD
- **GitHub:** pete0585/direct-primary-care-directory
- **Stripe:** Verified $99/yr (`price_1Te9tAGzK9SibluevkPMOOrh`), Featured $199/yr (`price_1Te9tBGzK9Siblue8ldqeFl8`)
- **Resend domain:** mail.directprimarycarefinder.com (ID: `5841139b-6c96-4ade-9161-82726adf191e`)
- **IndexNow key:** `86aa4c1fcbc64bb9fa7ce7e36c695be5`

## Stack

- Next.js 15.3.9 (App Router, TypeScript)
- Tailwind CSS with custom DPC color palette
- Supabase (Postgres + RLS + full-text search)
- Stripe (annual subscriptions)
- Resend (transactional email + inbound webhook)
- Vercel (auto-deploy from GitHub)

## Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Set environment variables
cp .env.example .env.local
# Fill in the values from Vercel project settings or bootstrap .env.vercel

# 3. Run development server
npm run dev
```

## Environment Variables

All env vars are pre-configured in the Vercel project by the bootstrap agent. See `.env.example` for the full list.

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_VERIFIED_PRICE_ID` | Stripe price ID for $99/yr Verified tier |
| `STRIPE_FEATURED_PRICE_ID` | Stripe price ID for $199/yr Featured tier |
| `RESEND_API_KEY` | Resend API key |
| `INBOUND_WEBHOOK_SECRET` | Resend inbound email webhook secret |
| `NEXT_PUBLIC_SITE_URL` | Full site URL (https://www.directprimarycarefinder.com) |

## Database Schema

Tables in Supabase project `fbuqrnzofktepkzyfmhy`:

- `dpc_listings` — All DPC practice profiles
- `dpc_claims` — Claim verification tokens
- `dpc_payments` — Stripe payment records
- `dpc_leads` — Patient lead inquiries (future)

Migration file: `supabase/migrations/001_initial_schema.sql`

**Note:** Bootstrap creates generic `direct_primary_care_*` tables. The migration drops these and creates the correct `dpc_*` tables. This is safe since bootstrap tables are always empty at build time.

## Seed Data

```bash
npx tsx scripts/seed.ts
```

Inserts 6 sample listings for local development. Production seeding is handled by the `data-seeder` agent using DataForSEO + the DPC Frontier Apify scraper:
- Apify scraper: https://apify.com/parseforge/dpc-mapper-scraper
- Contains 2,000+ DPC practices across 48 states

## Revenue Model

| Tier | Price | Features |
|---|---|---|
| Free | $0 | Name, location, phone, website, "Claim" CTA |
| Verified | $99/year | Photo, bio, services, pricing, contact form, priority placement |
| Featured | $199/year | Everything + top position, SEO landing page, monthly report |

**B2B advertising target:** Hint Health, Elation Health, Zion HealthShare — $500–1,500/mo per category sponsor.

## Vercel Deployment

The project is already configured in Vercel (`prj_xtGpwqmm39yUaoVUxUrz1dpnB1rD`). Push to the `main` branch triggers automatic deployment.

## Stripe Webhooks

Webhook endpoint: `https://www.directprimarycarefinder.com/api/webhooks/stripe`
Webhook ID: `we_1Te9tBGzK9SiblueLx5iDRJP`

Events handled:
- `checkout.session.completed` — Activates listing tier
- `customer.subscription.updated` — Updates tier on renewal/downgrade
- `customer.subscription.deleted` — Reverts to free on cancellation
- `invoice.payment_failed` — Reverts to free on failed renewal

## Inbound Email Webhook

Resend inbound webhook: `https://www.directprimarycarefinder.com/api/inbound-email` (must use www — Vercel 307 redirects non-www, Resend doesn't follow)

Stores replies to `inbound_emails` table. Processed by the `inbox-watcher` agent.

## Adding to Directories

Once deployed and live (HTTP 200), run `post-deploy-activation` to:
1. Add to `directories.json` with `status: live`
2. Submit sitemap to IndexNow
3. Arm all autonomous agents (data-seeder, seo-content, outreach, error-watcher)
