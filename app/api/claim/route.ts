import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { Resend } from 'resend'
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  let body: { listing_id?: string; email?: string }

  try {
    body = await req.json() as { listing_id?: string; email?: string }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { listing_id, email } = body

  if (!listing_id || !email) {
    return NextResponse.json({ error: 'Missing listing_id or email' }, { status: 400 })
  }

  const supabase = await createServiceClient()

  // Verify listing exists and is not already claimed
  const { data: listing } = await supabase
    .from('dpc_listings')
    .select('id, full_name, practice_name, city, state, claimed_at, slug')
    .eq('id', listing_id)
    .single()

  if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
  if (listing.claimed_at) return NextResponse.json({ error: 'Already claimed' }, { status: 409 })

  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString()

  await supabase.from('dpc_claims').insert({
    listing_id,
    email,
    token,
    verified: false,
    expires_at: expiresAt,
    status: 'pending',
  })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.directprimarycarefinder.com'
  const verifyUrl = `${siteUrl}/claim/${listing_id}?token=${token}`
  const practiceName = listing.practice_name ?? listing.full_name

  await resend.emails.send({
    from: 'DirectPrimaryCareFinder <hello@directprimarycarefinder.com>',
    to: email,
    subject: `Verify your DPC practice listing — ${practiceName}`,
    html: `
      <div style="font-family: Verdana, sans-serif; max-width: 560px; margin: 0 auto; color: #1E3A5F;">
        <h2 style="color: #0EA5E9;">Claim Your DPC Practice Listing</h2>
        <p>You requested to claim the listing for <strong>${practiceName}</strong> in ${listing.city}, ${listing.state} on DirectPrimaryCareFinder.com.</p>
        <p>Click the button below to verify ownership. This link expires in 72 hours.</p>
        <a href="${verifyUrl}" style="display: inline-block; background: #0EA5E9; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 16px 0;">
          Verify My Practice →
        </a>
        <p style="font-size: 12px; color: #999;">Or copy this URL: ${verifyUrl}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="font-size: 12px; color: #999;">
          Once verified, you can upgrade to a Verified listing ($99/yr) to add your photo, bio, services list,
          and get priority placement above free listings.
        </p>
      </div>
    `,
  })

  return NextResponse.json({ success: true })
}
