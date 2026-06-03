'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, MapPin } from 'lucide-react'
import { US_STATES } from '@/lib/utils'

interface SearchBarProps {
  large?: boolean
}

export default function SearchBar({ large = false }: SearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [q, setQ] = useState(searchParams.get('q') ?? '')
  const [state, setState] = useState(searchParams.get('state') ?? '')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (q.trim()) params.set('q', q.trim())
    if (state) params.set('state', state)
    router.push(`/listings?${params.toString()}`)
  }

  if (large) {
    return (
      <form onSubmit={handleSearch} className="w-full">
        <div className="flex flex-col sm:flex-row gap-3 bg-white rounded-2xl p-3 shadow-2xl">
          <div className="flex-1 flex items-center gap-2 px-3">
            <Search className="w-5 h-5 text-gray-400 shrink-0" aria-label="search" />
            <input
              type="text"
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Doctor name, practice, city..."
              className="w-full font-body text-gray-800 placeholder-gray-400 focus:outline-none text-base"
            />
          </div>
          <div className="flex items-center gap-2 px-3 border-t sm:border-t-0 sm:border-l border-gray-200 pt-3 sm:pt-0">
            <MapPin className="w-5 h-5 text-gray-400 shrink-0" aria-label="state" />
            <select
              value={state}
              onChange={e => setState(e.target.value)}
              className="font-body text-gray-800 focus:outline-none text-base bg-transparent"
            >
              <option value="">All States</option>
              {US_STATES.map(s => (
                <option key={s.abbr} value={s.abbr}>{s.name}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-brand-teal hover:bg-brand-teal-dark text-white font-body font-semibold px-8 py-3 rounded-xl transition-colors whitespace-nowrap"
          >
            Find DPC Doctors
          </button>
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
      <div className="flex items-center gap-2 bg-white border border-surface-border rounded-lg px-3 py-2 flex-1">
        <Search className="w-4 h-4 text-gray-400" aria-label="search" />
        <input
          type="text"
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search doctors or cities..."
          className="w-full font-body text-gray-800 placeholder-gray-400 focus:outline-none text-sm"
        />
      </div>
      <select
        value={state}
        onChange={e => setState(e.target.value)}
        className="border border-surface-border rounded-lg px-3 py-2 font-body text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
      >
        <option value="">All States</option>
        {US_STATES.map(s => (
          <option key={s.abbr} value={s.abbr}>{s.name}</option>
        ))}
      </select>
      <button
        type="submit"
        className="bg-brand-teal hover:bg-brand-teal-dark text-white font-body font-semibold px-5 py-2 rounded-lg transition-colors"
      >
        Search
      </button>
    </form>
  )
}
