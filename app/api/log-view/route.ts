import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
export async function POST(request: NextRequest) {
  try {
    const { listingId, directorySlug } = await request.json()
    if (!listingId || !directorySlug) {
      return NextResponse.json({ error: 'Missing params' }, { status: 400 })
    }
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    await supabase.from('listing_views').insert({
      directory_slug: String(directorySlug),
      listing_id: String(listingId),
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
