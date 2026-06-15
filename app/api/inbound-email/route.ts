import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import crypto from 'crypto'

function verifyResendWebhook(body: string, req: NextRequest, secret: string): boolean {
  const msgId = req.headers.get('svix-id')
  const msgTimestamp = req.headers.get('svix-timestamp')
  const msgSignature = req.headers.get('svix-signature')

  if (!msgId || !msgTimestamp || !msgSignature) return false

  const now = Math.floor(Date.now() / 1000)
  const timestamp = parseInt(msgTimestamp, 10)
  if (isNaN(timestamp) || Math.abs(now - timestamp) > 300) return false

  const signedContent = `${msgId}.${msgTimestamp}.${body}`
  const secretBytes = Buffer.from(secret.replace('whsec_', ''), 'base64')
  const sig = crypto.createHmac('sha256', secretBytes).update(signedContent).digest('base64')
  const expected = `v1,${sig}`
  return msgSignature.split(' ').some(s => s === expected)
}

export async function POST(req: NextRequest) {
  const body = await req.text()

  const webhookSecret = process.env.INBOUND_WEBHOOK_SECRET
  if (webhookSecret) {
    if (!verifyResendWebhook(body, req, webhookSecret)) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 })
    }
  }

  let payload: Record<string, unknown>
  try {
    payload = JSON.parse(body) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Resend delivers via Svix envelope: { type: "email.received", data: { from, to, subject, text, html } }
  const emailData =
    payload.type === 'email.received' && payload.data && typeof payload.data === 'object'
      ? (payload.data as Record<string, unknown>)
      : payload

  const fromRaw = emailData.from as string | undefined
  const subject = (emailData.subject as string | undefined) ?? ''
  const bodyText = (emailData.text as string | undefined) ?? ''
  const bodyHtml = (emailData.html as string | undefined) ?? ''

  if (!fromRaw) {
    return NextResponse.json({ error: 'Missing from address' }, { status: 400 })
  }

  const fromMatch = fromRaw.match(/^(?:"?([^"<]+)"?\s)?<?([^\s>]+@[^\s>]+)>?$/)
  const fromName = fromMatch?.[1]?.trim() ?? ''
  const fromEmail = fromMatch?.[2]?.trim() ?? fromRaw

  let listingId: string | null = null
  let listingSlug: string | null = null

  const xListingHeader = (emailData.headers as Record<string, string> | undefined)?.['x-listing-id']
  if (xListingHeader) listingId = xListingHeader

  if (!listingId && bodyText) {
    const slugMatch = bodyText.match(/directprimarycarefinder\.com\/listings\/([\w-]+)/)
    if (slugMatch) listingSlug = slugMatch[1]
  }

  const supabase = await createServiceClient()

  await supabase.from('inbound_emails').insert({
    directory: 'direct-primary-care',
    from_email: fromEmail,
    from_name: fromName,
    subject,
    body_text: bodyText,
    body_html: bodyHtml,
    listing_id: listingId,
    listing_slug: listingSlug,
    processed: false,
  })

  return NextResponse.json({ received: true })
}
