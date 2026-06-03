'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { US_STATES, SPECIALTIES, formatSpecialty } from '@/lib/utils'

export default function FilterSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page')
    router.push(`/listings?${params.toString()}`)
  }

  function toggle(key: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (params.get(key)) {
      params.delete(key)
    } else {
      params.set(key, 'true')
    }
    params.delete('page')
    router.push(`/listings?${params.toString()}`)
  }

  const state = searchParams.get('state') ?? ''
  const specialty = searchParams.get('specialty') ?? ''
  const telehealth = searchParams.get('telehealth') === 'true'
  const accepting = searchParams.get('accepting_new_patients') === 'true'
  const kids = searchParams.get('accepts_children') === 'true'
  const feeMax = searchParams.get('fee_max') ?? ''

  return (
    <aside className="space-y-6">
      <div>
        <h3 className="font-display text-brand-navy text-xs uppercase tracking-widest mb-3">State</h3>
        <select
          value={state}
          onChange={e => update('state', e.target.value)}
          className="w-full border border-surface-border rounded-lg px-3 py-2 font-body text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-teal"
        >
          <option value="">All States</option>
          {US_STATES.map(s => (
            <option key={s.abbr} value={s.abbr}>{s.name}</option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="font-display text-brand-navy text-xs uppercase tracking-widest mb-3">Specialty</h3>
        <select
          value={specialty}
          onChange={e => update('specialty', e.target.value)}
          className="w-full border border-surface-border rounded-lg px-3 py-2 font-body text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-teal"
        >
          <option value="">All Specialties</option>
          {SPECIALTIES.map(s => (
            <option key={s} value={s}>{formatSpecialty(s)}</option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="font-display text-brand-navy text-xs uppercase tracking-widest mb-3">Max Monthly Fee</h3>
        <select
          value={feeMax}
          onChange={e => update('fee_max', e.target.value)}
          className="w-full border border-surface-border rounded-lg px-3 py-2 font-body text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-teal"
        >
          <option value="">Any Price</option>
          <option value="50">Under $50/mo</option>
          <option value="75">Under $75/mo</option>
          <option value="100">Under $100/mo</option>
          <option value="150">Under $150/mo</option>
        </select>
      </div>

      <div>
        <h3 className="font-display text-brand-navy text-xs uppercase tracking-widest mb-3">Features</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={accepting}
              onChange={() => toggle('accepting_new_patients')}
              className="w-4 h-4 accent-brand-teal"
            />
            <span className="font-body text-sm text-gray-700">Accepting New Patients</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={telehealth}
              onChange={() => toggle('telehealth')}
              className="w-4 h-4 accent-brand-teal"
            />
            <span className="font-body text-sm text-gray-700">Telehealth Available</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={kids}
              onChange={() => toggle('accepts_children')}
              className="w-4 h-4 accent-brand-teal"
            />
            <span className="font-body text-sm text-gray-700">Accepts Children</span>
          </label>
        </div>
      </div>

      <button
        onClick={() => router.push('/listings')}
        className="w-full text-sm font-body text-gray-500 hover:text-brand-navy underline underline-offset-2 text-left"
      >
        Clear all filters
      </button>
    </aside>
  )
}
