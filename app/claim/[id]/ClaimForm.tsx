'use client'

import { useState } from 'react'
import { Loader2, CheckCircle } from 'lucide-react'

interface ClaimFormProps {
  listingId: string
  listingName: string
}

export default function ClaimForm({ listingId, listingName }: ClaimFormProps) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_id: listingId, email }),
      })
      if (!res.ok) {
        const body = await res.json() as { error?: string }
        throw new Error(body.error ?? 'Failed to send verification email')
      }
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-12 h-12 text-brand-teal mx-auto mb-4" aria-label="email sent" />
        <h2 className="font-display text-brand-navy text-xl font-bold mb-2">Check Your Email</h2>
        <p className="font-body text-gray-600">
          We sent a verification link to <strong>{email}</strong>. Click the link to verify ownership
          of <strong>{listingName}</strong>.
        </p>
        <p className="font-body text-gray-400 text-sm mt-3">Link expires in 72 hours.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-surface-border p-6">
      <p className="font-body text-gray-600 text-sm mb-6">
        Enter the email address associated with your practice. We&apos;ll send a one-click verification link.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-body text-gray-700 mb-1">Practice Email Address</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="dr.smith@practice.com"
            className="w-full border border-surface-border rounded-lg px-3 py-2.5 font-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
          />
        </div>
        {error && (
          <p className="text-red-500 text-sm font-body">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading || !email}
          className="w-full bg-brand-teal hover:bg-brand-teal-dark text-white font-body font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" aria-label="loading" />}
          Send Verification Email
        </button>
      </form>
    </div>
  )
}
