export interface Listing {
  id: string
  slug: string
  full_name: string
  practice_name: string | null
  bio: string | null
  photo_url: string | null
  phone: string | null
  email: string | null
  website: string | null
  address_line1: string | null
  city: string
  state: string
  zip: string | null
  latitude: number | null
  longitude: number | null
  monthly_fee_min: number | null
  monthly_fee_max: number | null
  family_fee_min: number | null
  family_fee_max: number | null
  accepts_children: boolean
  min_age: number | null
  max_age: number | null
  accepts_insurance_patients: boolean
  telehealth_available: boolean
  accepting_new_patients: boolean
  hsa_eligible: boolean
  specialties: string[]
  services_included: string[]
  board_certifications: string[]
  ehr_system: string | null
  listing_tier: 'free' | 'verified' | 'featured'
  is_active: boolean
  is_approved: boolean
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  subscription_expires_at: string | null
  claimed_at: string | null
  claimed_by: string | null
  source: string | null
  do_not_email: boolean
  email_source: string | null
  outreach_step: number
  outreach_sent_at: string | null
  search_vector: string | null
  created_at: string
  updated_at: string
}

export interface SearchFilters {
  q?: string
  state?: string
  specialty?: string
  telehealth?: boolean
  accepting_new_patients?: boolean
  accepts_children?: boolean
  fee_max?: number
  tier?: string
  page?: number
}

export interface Lead {
  id: string
  patient_name: string | null
  patient_email: string | null
  patient_phone: string | null
  zip: string | null
  insurance_status: string | null
  health_goals: string | null
  preferred_listing_id: string | null
  state: string | null
  status: string
  created_at: string
}
