/**
 * Seed script for Direct Primary Care directory.
 *
 * Usage: npx tsx scripts/seed.ts
 *
 * Data sources (in order of priority):
 * 1. DPC Frontier mapper via Apify scraper (apify.com/parseforge/dpc-mapper-scraper)
 * 2. DataForSEO Google Maps ("direct primary care" + "DPC" in top cities)
 * 3. NPI registry enrichment (taxonomy 207Q00000X family medicine)
 *
 * This script seeds sample data for local development.
 * Production seeding is handled by the data-seeder agent using DataForSEO.
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, serviceKey)

interface SeedListing {
  slug: string
  full_name: string
  practice_name?: string
  city: string
  state: string
  zip?: string
  phone?: string
  website?: string
  monthly_fee_min?: number
  monthly_fee_max?: number
  telehealth_available?: boolean
  accepts_children?: boolean
  accepting_new_patients?: boolean
  specialties?: string[]
  services_included?: string[]
  source?: string
}

const SEED_LISTINGS: SeedListing[] = [
  {
    slug: 'dr-sarah-johnson-dpc-austin-tx',
    full_name: 'Dr. Sarah Johnson',
    practice_name: 'Austin Direct Health',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
    phone: '(512) 555-0101',
    website: 'https://austindirecthealth.com',
    monthly_fee_min: 75,
    monthly_fee_max: 95,
    telehealth_available: true,
    accepts_children: false,
    accepting_new_patients: true,
    specialties: ['family_medicine', 'womens_health'],
    services_included: ['annual_exams', 'acute_care', 'chronic_care', 'labs', 'telehealth', 'preventive_care'],
    source: 'seed',
  },
  {
    slug: 'dr-michael-chen-dpc-denver-co',
    full_name: 'Dr. Michael Chen',
    practice_name: 'Mile High Direct Care',
    city: 'Denver',
    state: 'CO',
    zip: '80202',
    phone: '(720) 555-0202',
    website: 'https://milehighdirectcare.com',
    monthly_fee_min: 65,
    monthly_fee_max: 85,
    telehealth_available: true,
    accepts_children: true,
    accepting_new_patients: true,
    specialties: ['family_medicine', 'pediatrics'],
    services_included: ['annual_exams', 'acute_care', 'chronic_care', 'labs', 'telehealth', 'minor_procedures'],
    source: 'seed',
  },
  {
    slug: 'dr-emily-rodriguez-dpc-nashville-tn',
    full_name: 'Dr. Emily Rodriguez',
    practice_name: 'Nashville Direct Primary Care',
    city: 'Nashville',
    state: 'TN',
    zip: '37201',
    phone: '(615) 555-0303',
    monthly_fee_min: 60,
    monthly_fee_max: 80,
    telehealth_available: false,
    accepts_children: false,
    accepting_new_patients: true,
    specialties: ['family_medicine', 'obesity_medicine', 'chronic_disease'],
    services_included: ['annual_exams', 'acute_care', 'chronic_care', 'labs', 'medication_management'],
    source: 'seed',
  },
  {
    slug: 'dr-james-wilson-dpc-kansas-city-mo',
    full_name: 'Dr. James Wilson',
    practice_name: 'KC Direct Medicine',
    city: 'Kansas City',
    state: 'MO',
    zip: '64102',
    phone: '(816) 555-0404',
    website: 'https://kcdirectmedicine.com',
    monthly_fee_min: 55,
    monthly_fee_max: 75,
    telehealth_available: true,
    accepts_children: true,
    accepting_new_patients: true,
    specialties: ['family_medicine', 'mens_health'],
    services_included: ['annual_exams', 'acute_care', 'chronic_care', 'labs', 'telehealth', 'preventive_care'],
    source: 'seed',
  },
  {
    slug: 'dr-amanda-lee-dpc-seattle-wa',
    full_name: 'Dr. Amanda Lee',
    practice_name: 'Seattle Direct Care Collective',
    city: 'Seattle',
    state: 'WA',
    zip: '98101',
    phone: '(206) 555-0505',
    website: 'https://seattledirectcare.com',
    monthly_fee_min: 85,
    monthly_fee_max: 115,
    telehealth_available: true,
    accepts_children: false,
    accepting_new_patients: false,
    specialties: ['family_medicine', 'womens_health', 'mental_health'],
    services_included: ['annual_exams', 'acute_care', 'chronic_care', 'labs', 'telehealth', 'nutrition_counseling'],
    source: 'seed',
  },
  {
    slug: 'dr-robert-patel-dpc-tampa-fl',
    full_name: 'Dr. Robert Patel',
    practice_name: 'Tampa Bay Direct Health',
    city: 'Tampa',
    state: 'FL',
    zip: '33602',
    phone: '(813) 555-0606',
    monthly_fee_min: 70,
    monthly_fee_max: 90,
    telehealth_available: true,
    accepts_children: true,
    accepting_new_patients: true,
    specialties: ['family_medicine', 'geriatrics', 'chronic_disease'],
    services_included: ['annual_exams', 'acute_care', 'chronic_care', 'labs', 'telehealth', 'medication_management'],
    source: 'seed',
  },
]

async function seed() {
  console.log('Seeding DPC directory with', SEED_LISTINGS.length, 'listings...')

  let inserted = 0
  let skipped = 0

  for (const listing of SEED_LISTINGS) {
    const { error } = await supabase
      .from('dpc_listings')
      .upsert(
        {
          ...listing,
          listing_tier: 'free',
          is_active: true,
          is_approved: true,
          outreach_step: 0,
          hsa_eligible: true,
          accepts_insurance_patients: false,
          board_certifications: [],
        },
        { onConflict: 'slug', ignoreDuplicates: true }
      )

    if (error) {
      console.error('Error inserting', listing.slug, error.message)
      skipped++
    } else {
      console.log('Inserted:', listing.full_name, '-', listing.city, listing.state)
      inserted++
    }
  }

  console.log(`\nDone. ${inserted} inserted, ${skipped} skipped.`)
  console.log('\nNext steps:')
  console.log('1. Run the data-seeder agent for production seeding via DataForSEO')
  console.log('2. Use the Apify DPC Frontier scraper for the full 2,000+ listing dataset')
  console.log('   URL: https://apify.com/parseforge/dpc-mapper-scraper')
}

seed().catch(console.error)
