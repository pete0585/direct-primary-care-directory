import { timingSafeEqual } from 'node:crypto'
import type { NextRequest } from 'next/server'
export function sameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin'); const host = req.headers.get('host')
  if (!origin || !host) return false
  try { const u = new URL(origin); return u.origin === origin && u.host === host && (u.protocol === 'https:' || (u.protocol === 'http:' && /^(127\.0\.0\.1|localhost)(:\d+)?$/.test(host))) } catch { return false }
}
/** Reuse the existing owner login. Page-layout checks do not protect API routes. */
export function adminAuthorized(req: NextRequest): boolean {
  const expected = process.env.ADMIN_PASSWORD
  const supplied = req.cookies.get('admin_auth')?.value
  if (!expected || !supplied || !sameOrigin(req)) return false
  const a = Buffer.from(expected); const b = Buffer.from(supplied)
  return a.length === b.length && timingSafeEqual(a, b)
}
