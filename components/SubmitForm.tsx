'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { US_STATES, SPECIALTIES, formatSpecialty } from '@/lib/utils'
import { CheckCircle, Loader2 } from 'lucide-react'

const schema = z.object({
  full_name: z.string().min(2, 'Name required'),
  practice_name: z.string().optional(),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  website: z.string().url('Enter full URL (https://...)').optional().or(z.literal('')),
  address_line1: z.string().optional(),
  city: z.string().min(2, 'City required'),
  state: z.string().length(2, 'Select a state'),
  zip: z.string().optional(),
  monthly_fee_min: z.coerce.number().min(0).optional().or(z.literal('')),
  monthly_fee_max: z.coerce.number().min(0).optional().or(z.literal('')),
  telehealth_available: z.boolean().default(false),
  accepts_children: z.boolean().default(false),
  accepting_new_patients: z.boolean().default(true),
  specialties: z.array(z.string()).default([]),
  bio: z.string().max(1000, 'Bio must be 1,000 characters or less').optional(),
})

type FormData = z.infer<typeof schema>

export default function SubmitForm() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      accepting_new_patients: true,
      specialties: [],
    },
  })

  const selectedSpecialties = watch('specialties') ?? []

  function toggleSpecialty(s: string) {
    const current = selectedSpecialties
    setValue(
      'specialties',
      current.includes(s) ? current.filter(x => x !== s) : [...current, s]
    )
  }

  async function onSubmit(data: FormData) {
    setError('')
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const body = await res.json() as { error?: string }
        throw new Error(body.error ?? 'Submission failed')
      }
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-14 h-14 text-brand-teal mx-auto mb-4" aria-label="success" />
        <h2 className="font-display text-brand-navy text-xl font-bold mb-2">Practice Submitted!</h2>
        <p className="font-body text-gray-600 max-w-md mx-auto">
          Your listing has been submitted and will be reviewed within 24 hours. You&apos;ll receive a
          confirmation email with a link to claim and upgrade your profile.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Physician info */}
      <div className="bg-white rounded-xl border border-surface-border p-6">
        <h2 className="font-display text-brand-navy font-bold text-sm uppercase tracking-wide mb-4">Physician Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-body text-gray-700 mb-1">Full Name *</label>
            <input
              {...register('full_name')}
              className="w-full border border-surface-border rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
              placeholder="Dr. Jane Smith"
            />
            {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-body text-gray-700 mb-1">Practice Name</label>
            <input
              {...register('practice_name')}
              className="w-full border border-surface-border rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
              placeholder="Smith Direct Primary Care"
            />
          </div>
          <div>
            <label className="block text-sm font-body text-gray-700 mb-1">Email Address *</label>
            <input
              {...register('email')}
              type="email"
              className="w-full border border-surface-border rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
              placeholder="dr.smith@practice.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-body text-gray-700 mb-1">Phone</label>
            <input
              {...register('phone')}
              type="tel"
              className="w-full border border-surface-border rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
              placeholder="(555) 555-5555"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-body text-gray-700 mb-1">Practice Website</label>
            <input
              {...register('website')}
              type="url"
              className="w-full border border-surface-border rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
              placeholder="https://yourpractice.com"
            />
            {errors.website && <p className="text-red-500 text-xs mt-1">{errors.website.message}</p>}
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-white rounded-xl border border-surface-border p-6">
        <h2 className="font-display text-brand-navy font-bold text-sm uppercase tracking-wide mb-4">Location</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-3">
            <label className="block text-sm font-body text-gray-700 mb-1">Street Address</label>
            <input
              {...register('address_line1')}
              className="w-full border border-surface-border rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
              placeholder="123 Main St, Suite 100"
            />
          </div>
          <div>
            <label className="block text-sm font-body text-gray-700 mb-1">City *</label>
            <input
              {...register('city')}
              className="w-full border border-surface-border rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
              placeholder="Austin"
            />
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-body text-gray-700 mb-1">State *</label>
            <select
              {...register('state')}
              className="w-full border border-surface-border rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
            >
              <option value="">Select state</option>
              {US_STATES.map(s => <option key={s.abbr} value={s.abbr}>{s.name}</option>)}
            </select>
            {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-body text-gray-700 mb-1">ZIP</label>
            <input
              {...register('zip')}
              className="w-full border border-surface-border rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
              placeholder="78701"
            />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-xl border border-surface-border p-6">
        <h2 className="font-display text-brand-navy font-bold text-sm uppercase tracking-wide mb-4">Membership Pricing</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-body text-gray-700 mb-1">Adult Membership — Min ($/mo)</label>
            <input
              {...register('monthly_fee_min')}
              type="number"
              min="0"
              className="w-full border border-surface-border rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
              placeholder="50"
            />
          </div>
          <div>
            <label className="block text-sm font-body text-gray-700 mb-1">Adult Membership — Max ($/mo)</label>
            <input
              {...register('monthly_fee_max')}
              type="number"
              min="0"
              className="w-full border border-surface-border rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
              placeholder="100"
            />
          </div>
        </div>
      </div>

      {/* Practice details */}
      <div className="bg-white rounded-xl border border-surface-border p-6">
        <h2 className="font-display text-brand-navy font-bold text-sm uppercase tracking-wide mb-4">Practice Details</h2>
        <div className="space-y-3 mb-5">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" {...register('accepting_new_patients')} className="w-4 h-4 accent-brand-teal" />
            <span className="font-body text-sm text-gray-700">Currently accepting new patients</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" {...register('telehealth_available')} className="w-4 h-4 accent-brand-teal" />
            <span className="font-body text-sm text-gray-700">Telehealth available</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" {...register('accepts_children')} className="w-4 h-4 accent-brand-teal" />
            <span className="font-body text-sm text-gray-700">Accepts pediatric patients</span>
          </label>
        </div>

        <label className="block text-sm font-body text-gray-700 mb-2">Specialties & Focus Areas</label>
        <div className="flex flex-wrap gap-2">
          {SPECIALTIES.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => toggleSpecialty(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-body transition-colors ${
                selectedSpecialties.includes(s)
                  ? 'bg-brand-teal text-white'
                  : 'bg-surface border border-surface-border text-gray-700 hover:border-brand-teal'
              }`}
            >
              {formatSpecialty(s)}
            </button>
          ))}
        </div>
      </div>

      {/* Bio */}
      <div className="bg-white rounded-xl border border-surface-border p-6">
        <h2 className="font-display text-brand-navy font-bold text-sm uppercase tracking-wide mb-4">About Your Practice (Optional)</h2>
        <textarea
          {...register('bio')}
          rows={5}
          className="w-full border border-surface-border rounded-lg px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
          placeholder="Tell patients about your practice philosophy, what makes your DPC model unique, and what they can expect from membership..."
        />
        {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio.message}</p>}
        <p className="text-xs text-gray-400 font-body mt-1">Max 1,000 characters. Visible to Verified and Featured practices only.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 font-body text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-brand-teal hover:bg-brand-teal-dark text-white font-body font-semibold px-6 py-3.5 rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" aria-label="loading" />}
        Submit My Practice — Free Listing
      </button>
      <p className="text-center text-xs font-body text-gray-400">
        Free listings go live within 24 hours. Upgrade to Verified ($99/yr) after claiming.
      </p>
    </form>
  )
}
