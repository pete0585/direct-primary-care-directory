import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'

const HANDLED_EVENTS = new Set(['checkout.session.completed'])

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook signature verification failed'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  if (!HANDLED_EVENTS.has(event.type)) {
    return NextResponse.json({ received: true })
  }

  const supabase = await createServiceClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const listingId = session.metadata?.listing_id
        const tier = session.metadata?.tier

        if (!listingId || !tier) break

        await supabase
          .from('dpc_listings')
          .update({
            listing_tier: tier,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            subscription_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', listingId)

        await supabase.from('dpc_payments').insert({
          listing_id: listingId,
          stripe_session_id: session.id,
          stripe_payment_intent_id: session.payment_intent as string,
          amount: session.amount_total,
          tier,
          status: 'paid',
        })

        break
      }
    }
  } catch (err) {
    console.error('Stripe webhook handler error:', err)
    return NextResponse.json({ error: 'Handler error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
