import { NextRequest, NextResponse } from 'next/server'
import { stripe, TIER_PRICES } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  let body: { listing_id?: string; tier?: string }

  try {
    body = await req.json() as { listing_id?: string; tier?: string }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { listing_id, tier } = body

  if (!listing_id || !tier) {
    return NextResponse.json({ error: 'Missing listing_id or tier' }, { status: 400 })
  }

  const priceId = TIER_PRICES[tier]
  if (!priceId) {
    return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
  }

  const supabase = await createServiceClient()
  const { data: listing } = await supabase
    .from('dpc_listings')
    .select('id, full_name, email, slug')
    .eq('id', listing_id)
    .single()

  if (!listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.directprimarycarefinder.com'

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: { listing_id, tier },
    customer_email: listing.email ?? undefined,
    success_url: `${siteUrl}/listings/${listing.slug}?upgraded=true`,
    cancel_url: `${siteUrl}/listings/${listing.slug}`,
  })

  return NextResponse.json({ url: session.url })
}

// GET version for direct link usage (e.g. from email links)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const listing_id = searchParams.get('listing_id')
  const tier = searchParams.get('tier') ?? 'verified'

  if (!listing_id) {
    return NextResponse.redirect(new URL('/submit', req.url))
  }

  const priceId = TIER_PRICES[tier]
  if (!priceId) return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })

  const supabase = await createServiceClient()
  const { data: listing } = await supabase
    .from('dpc_listings')
    .select('id, full_name, email, slug')
    .eq('id', listing_id)
    .single()

  if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.directprimarycarefinder.com'

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: { listing_id, tier },
    customer_email: listing.email ?? undefined,
    success_url: `${siteUrl}/listings/${listing.slug}?upgraded=true`,
    cancel_url: `${siteUrl}/listings/${listing.slug}`,
  })

  return NextResponse.redirect(session.url!)
}
