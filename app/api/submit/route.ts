import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/utils'

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>

  try {
    body = await req.json() as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { full_name, city, state, email } = body

  if (!full_name || !city || !state || !email) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const baseSlug = slugify(
    `${body.full_name as string}-dpc-${body.city as string}-${body.state as string}`
  )
  const uniqueSlug = `${baseSlug}-${Date.now().toString(36)}`

  const supabase = await createServiceClient()

  const { error } = await supabase.from('dpc_listings').insert({
    slug: uniqueSlug,
    full_name: body.full_name,
    practice_name: body.practice_name ?? null,
    email: body.email,
    phone: body.phone ?? null,
    website: body.website ?? null,
    address_line1: body.address_line1 ?? null,
    city: body.city,
    state: (body.state as string).toUpperCase(),
    zip: body.zip ?? null,
    monthly_fee_min: body.monthly_fee_min ? Number(body.monthly_fee_min) : null,
    monthly_fee_max: body.monthly_fee_max ? Number(body.monthly_fee_max) : null,
    telehealth_available: body.telehealth_available ?? false,
    accepts_children: body.accepts_children ?? false,
    accepting_new_patients: body.accepting_new_patients ?? true,
    specialties: body.specialties ?? [],
    bio: body.bio ?? null,
    source: 'self_submit',
    listing_tier: 'free',
    is_active: true,
    is_approved: false,
    outreach_step: 0,
  })

  if (error) {
    console.error('Submit error:', error)
    return NextResponse.json({ error: 'Failed to save listing' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
