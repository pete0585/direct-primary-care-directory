'use client'
import { useEffect } from 'react'
export function ViewTracker({ listingId, directorySlug }: { listingId: string; directorySlug: string }) {
  useEffect(() => {
    fetch('/api/log-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listingId, directorySlug }),
    }).catch(() => {})
  }, [listingId, directorySlug])
  return null
}
