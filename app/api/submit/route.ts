import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sameOrigin } from '@/lib/admin-authorization'
import { buildListingRow, persistSubmission, submissionSchema } from '@/lib/submission'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
const MAX_BYTES = 20000
const hits = new Map<string, { count: number; expires: number }>()
const reply = (body: object, status: number) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } })
export async function POST(req: NextRequest) {
  try {
    if (!sameOrigin(req)) return reply({ error: 'Submit this form from our website.' }, 403)
    const ip = req.headers.get('x-vercel-forwarded-for') || req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
    const now = Date.now()
    for (const [key, value] of hits) if (value.expires <= now) hits.delete(key)
    if (!hits.has(ip) && hits.size >= 5000) return reply({ error: 'Submissions are busy. Please try again later.' }, 429)
    const count = hits.get(ip) || { count: 0, expires: now + 3600000 }
    count.count++; hits.set(ip, count)
    if (count.count > 5) return reply({ error: 'Too many attempts. Keep your entries and try again later.' }, 429)
    const reader = req.body?.getReader()
    if (!reader) return reply({ error: 'Missing submission.' }, 400)
    const chunks: Uint8Array[] = []; let size = 0
    for (;;) {
      const { done, value } = await reader.read(); if (done) break
      size += value.byteLength
      if (size > MAX_BYTES) { await reader.cancel(); return reply({ error: 'Submission is too large.' }, 413) }
      chunks.push(value)
    }
    let body: unknown
    try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')) } catch { return reply({ error: 'Invalid submission format.' }, 400) }
    const parsed = submissionSchema.safeParse(body)
    if (!parsed.success) return reply({ error: 'Please check your contact details, location, prices and selected treatments.' }, 400)
    if (parsed.data.contact_fax) return reply({ error: 'Submission could not be accepted.' }, 400)
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return reply({ error: 'Submissions are temporarily unavailable. Keep your entries and try again later.' }, 503)
    const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } })
    const recent = await db.from('dpc_listings').select('id', { head: true, count: 'exact' }).eq('source', 'self_submit').gte('created_at', new Date(now - 3600000).toISOString())
    if (recent.error) return reply({ error: 'Submissions are temporarily unavailable. Keep your entries and try again later.' }, 503)
    if ((recent.count ?? 0) >= 60) return reply({ error: 'Submissions are busy. Keep your entries and try again later.' }, 429)
    const row = buildListingRow(parsed.data)
    const result = await persistSubmission({
      insert: async value => { const { error } = await db.from('dpc_listings').insert(value); return { error } },
      read: async slug => { const { data, error } = await db.from('dpc_listings').select(Object.keys(row).join(',')).eq('slug', slug).maybeSingle(); return { data: data as unknown as Record<string, unknown> | null, error } },
    }, row)
    return reply(result.body, result.status)
  } catch { return reply({ error: 'We could not confirm your submission. Keep your entries and retry the same submission.' }, 503) }
}
