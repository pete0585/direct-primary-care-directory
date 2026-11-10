import { z } from 'zod'
import { createHash } from 'node:crypto'
import { SPECIALTIES } from './utils'

const text = (n: number) => z.string().trim().max(n).refine(v => !/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(v))
const optional = (n: number) => text(n).nullish().transform(v => v || null)
const url = optional(500).refine(v => { if (!v) return true; try { const u = new URL(v); return ['http:', 'https:'].includes(u.protocol) && !u.username && !u.password } catch { return false } }, 'Use an http(s) website URL')
const states = 'AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY DC'.split(' ')
const money = z.union([z.number().min(0).max(100000), z.literal('')]).nullish().transform(v => v === '' || v == null ? null : v)
export const submissionSchema = z.object({
 full_name:text(160).pipe(z.string().min(2)),practice_name:optional(160),email:text(254).pipe(z.string().email()).transform(v=>v.toLowerCase()),
 city:text(100).pipe(z.string().min(2)),state:z.string().refine(v=>states.includes(v)),
 phone:optional(40).refine(v=>!v||(/^[+\d().\s\-xX#]{7,40}$/.test(v)&&v.replace(/\D/g,'').length>=7)),website:url,address_line1:optional(200),zip:optional(10).refine(v=>!v||/^\d{5}(-\d{4})?$/.test(v)),
 monthly_fee_min:money,monthly_fee_max:money,telehealth_available:z.boolean().default(false),accepts_children:z.boolean().default(false),accepting_new_patients:z.boolean().default(true),
 specialties:z.array(z.string().refine(v=>(SPECIALTIES as readonly string[]).includes(v))).max(SPECIALTIES.length).default([]),bio:optional(1000),contact_fax:z.string().max(200).optional(),
}).strict().refine(v=>v.monthly_fee_min===null||v.monthly_fee_max===null||v.monthly_fee_max>=v.monthly_fee_min)
export function buildListingRow(input:z.infer<typeof submissionSchema>){
 const {contact_fax:_fax,...fields}=input
 const identity=[input.email,input.full_name.toLowerCase().replace(/\s+/g,' '),input.city.toLowerCase().replace(/\s+/g,' '),input.state]
 const suffix=createHash('sha256').update(JSON.stringify(identity)).digest('hex').slice(0,32)
 const base=`${input.full_name}-dpc-${input.city}-${input.state}`.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,90)
 return {...fields,specialties:[...new Set(fields.specialties)].sort(),slug:`${base}-${suffix}`,listing_tier:'free',is_active:true,is_approved:false,source:'self_submit',do_not_email:true,outreach_step:0}
}

export type ListingRow = ReturnType<typeof buildListingRow>
export type SavedRow = Record<string, unknown>
export interface SubmissionStore {
  insert(row: ListingRow): Promise<{ error: null | { code?: string } }>
  read(slug: string): Promise<{ error: unknown; data: SavedRow | null }>
}
const message = 'We could not confirm your submission. Your entries are unchanged. Retry the same submission; it will not create a second listing.'
export async function persistSubmission(store: SubmissionStore, row: ListingRow) {
  const result = await store.insert(row)
  if (result.error && result.error.code !== '23505') return { status: 503, body: { error: message } }
  const saved = await store.read(row.slug)
  if (saved.error || !saved.data) return { status: 503, body: { error: message } }
  // Verify saved values, not only the existence of an id. A changed retry must never overwrite a human edit.
  const matches = Object.entries(row).every(([key, value]) => JSON.stringify(saved.data![key]) === JSON.stringify(value))
  if (!matches) return { status: result.error ? 409 : 503, body: { error: result.error ? 'A submission for this practice already exists with different details. Please use the contact link to request a correction; no changes were made.' : message } }
  return { status: 200, body: { success: true, status: 'pending_review', duplicate: Boolean(result.error) } }
}
