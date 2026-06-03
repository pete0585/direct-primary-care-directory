export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function formatFeeRange(min: number | null, max: number | null): string {
  if (!min && !max) return 'Contact for pricing'
  if (min && max) return `$${min}–$${max}/mo`
  if (min) return `From $${min}/mo`
  if (max) return `Up to $${max}/mo`
  return 'Contact for pricing'
}

export function formatSpecialty(s: string): string {
  const map: Record<string, string> = {
    family_medicine:      'Family Medicine',
    internal_medicine:    'Internal Medicine',
    pediatrics:           'Pediatrics',
    womens_health:        "Women's Health",
    mens_health:          "Men's Health",
    geriatrics:           'Geriatrics',
    sports_medicine:      'Sports Medicine',
    obesity_medicine:     'Obesity Medicine',
    addiction_medicine:   'Addiction Medicine',
    chronic_disease:      'Chronic Disease Management',
    mental_health:        'Mental Health',
  }
  return map[s] ?? s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export function formatService(s: string): string {
  const map: Record<string, string> = {
    annual_exams:          'Annual Exams',
    acute_care:            'Acute Care',
    chronic_care:          'Chronic Care Management',
    labs:                  'Lab Work Included',
    imaging_interpretation:'Imaging Interpretation',
    minor_procedures:      'Minor Procedures',
    telehealth:            'Telehealth',
    medication_management: 'Medication Management',
    preventive_care:       'Preventive Care',
    nutrition_counseling:  'Nutrition Counseling',
  }
  return map[s] ?? s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export const US_STATES: { abbr: string; name: string }[] = [
  { abbr: 'AL', name: 'Alabama' }, { abbr: 'AK', name: 'Alaska' },
  { abbr: 'AZ', name: 'Arizona' }, { abbr: 'AR', name: 'Arkansas' },
  { abbr: 'CA', name: 'California' }, { abbr: 'CO', name: 'Colorado' },
  { abbr: 'CT', name: 'Connecticut' }, { abbr: 'DE', name: 'Delaware' },
  { abbr: 'FL', name: 'Florida' }, { abbr: 'GA', name: 'Georgia' },
  { abbr: 'HI', name: 'Hawaii' }, { abbr: 'ID', name: 'Idaho' },
  { abbr: 'IL', name: 'Illinois' }, { abbr: 'IN', name: 'Indiana' },
  { abbr: 'IA', name: 'Iowa' }, { abbr: 'KS', name: 'Kansas' },
  { abbr: 'KY', name: 'Kentucky' }, { abbr: 'LA', name: 'Louisiana' },
  { abbr: 'ME', name: 'Maine' }, { abbr: 'MD', name: 'Maryland' },
  { abbr: 'MA', name: 'Massachusetts' }, { abbr: 'MI', name: 'Michigan' },
  { abbr: 'MN', name: 'Minnesota' }, { abbr: 'MS', name: 'Mississippi' },
  { abbr: 'MO', name: 'Missouri' }, { abbr: 'MT', name: 'Montana' },
  { abbr: 'NE', name: 'Nebraska' }, { abbr: 'NV', name: 'Nevada' },
  { abbr: 'NH', name: 'New Hampshire' }, { abbr: 'NJ', name: 'New Jersey' },
  { abbr: 'NM', name: 'New Mexico' }, { abbr: 'NY', name: 'New York' },
  { abbr: 'NC', name: 'North Carolina' }, { abbr: 'ND', name: 'North Dakota' },
  { abbr: 'OH', name: 'Ohio' }, { abbr: 'OK', name: 'Oklahoma' },
  { abbr: 'OR', name: 'Oregon' }, { abbr: 'PA', name: 'Pennsylvania' },
  { abbr: 'RI', name: 'Rhode Island' }, { abbr: 'SC', name: 'South Carolina' },
  { abbr: 'SD', name: 'South Dakota' }, { abbr: 'TN', name: 'Tennessee' },
  { abbr: 'TX', name: 'Texas' }, { abbr: 'UT', name: 'Utah' },
  { abbr: 'VT', name: 'Vermont' }, { abbr: 'VA', name: 'Virginia' },
  { abbr: 'WA', name: 'Washington' }, { abbr: 'WV', name: 'West Virginia' },
  { abbr: 'WI', name: 'Wisconsin' }, { abbr: 'WY', name: 'Wyoming' },
  { abbr: 'DC', name: 'Washington D.C.' },
]

export const SPECIALTIES = [
  'family_medicine', 'internal_medicine', 'pediatrics', 'womens_health',
  'mens_health', 'geriatrics', 'sports_medicine', 'obesity_medicine',
  'addiction_medicine', 'chronic_disease', 'mental_health',
]

export function stateNameFromAbbr(abbr: string): string {
  return US_STATES.find(s => s.abbr === abbr.toUpperCase())?.name ?? abbr
}

export function tierBadge(tier: string): { label: string; classes: string } {
  switch (tier) {
    case 'featured':
      return { label: 'Featured Practice', classes: 'bg-brand-teal text-white' }
    case 'verified':
      return { label: 'Verified DPC', classes: 'bg-brand-navy text-white' }
    default:
      return { label: 'DPC Practice', classes: 'bg-gray-100 text-gray-600' }
  }
}
