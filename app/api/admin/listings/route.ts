import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function PATCH(req: NextRequest) {
  const supabase = await createServiceClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!adminUser) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  let body: Record<string, unknown>
  try {
    body = await req.json() as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { id, ...patch } = body

  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const allowedFields = ['is_approved', 'is_active', 'listing_tier']
  const safePatch: Record<string, unknown> = {}
  for (const key of allowedFields) {
    if (key in patch) safePatch[key] = patch[key]
  }
  safePatch.updated_at = new Date().toISOString()

  const { error } = await supabase
    .from('dpc_listings')
    .update(safePatch)
    .eq('id', id as string)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
