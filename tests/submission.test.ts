import test from 'node:test'
import assert from 'node:assert/strict'
import { buildListingRow, persistSubmission, submissionSchema, type ListingRow } from '../lib/submission'
import { adminAuthorized } from '../lib/admin-authorization'
import type { NextRequest } from 'next/server'
const input = { full_name: 'Synthetic fixture only', email: 'fixture@example.invalid', city: 'Raleigh', state: 'NC' }
const row = () => buildListingRow(submissionSchema.parse(input))
for (const key of ['id','is_approved','is_active','listing_tier','listing_tier_rank','claimed','verified','stripe_customer_id','slug','email_source']) {
 test(`reject privileged input: ${key}`, () => assert.equal(submissionSchema.safeParse({ ...input, [key]: true }).success, false))
}
for (const patch of [{ email: 'bad' },{state:'ZZ'},{full_name:5},{accepts_children:'false'},{website:'javascript:alert(1)'},{website:'https://user:pass@example.com'},{monthly_fee_min:10,monthly_fee_max:1},{monthly_fee_min:'10'},{specialties:['invented']},{bio:'x'.repeat(1001)},{phone:'not a number'},{zip:'123'}]) {
 test(`reject malformed ${JSON.stringify(patch).slice(0,60)}`, () => assert.equal(submissionSchema.safeParse({ ...input, ...patch }).success, false))
}
test('strict free/pending/unclaimed row, no token or email action', () => { const r=row(); assert.equal(r.is_approved,false);assert.equal(r.do_not_email,true);assert.equal(r.listing_tier,'free');assert.equal(r.source,'self_submit');assert.equal('token'in r,false) })
test('normalized email/name retry has stable identity', () => assert.equal(row().slug, buildListingRow(submissionSchema.parse({...input,email:input.email.toUpperCase(),full_name:'Synthetic  fixture only'})).slug))
test('persist then fieldwise readback; identical retry is one row', async () => {
 const rows = new Map<string,ListingRow>(); let inserts=0
 const store={ insert:async(r:ListingRow)=>{if(rows.has(r.slug))return{error:{code:'23505'}};rows.set(r.slug,r);inserts++;return{error:null}},read:async(slug:string)=>({error:null,data:rows.get(slug)||null}) }
 assert.equal((await persistSubmission(store,row())).status,200);assert.equal((await persistSubmission(store,row())).body.duplicate,true);assert.equal(inserts,1)
})
test('ambiguous transport followed by retry reconciles one saved row', async()=>{
 let stored:ListingRow|null=null
 const store={insert:async(r:ListingRow)=>{if(stored)return{error:{code:'23505'}};stored=r;return{error:{code:'transport'}}},read:async()=>({error:null,data:stored})}
 assert.equal((await persistSubmission(store,row())).status,503);assert.equal((await persistSubmission(store,row())).status,200)
})
test('changed duplicate does not overwrite', async()=>{let writes=0;const r=row();const result=await persistSubmission({insert:async()=>{writes++;return{error:{code:'23505'}}},read:async()=>({error:null,data:{...r,bio:'Human edit'}})},r);assert.equal(result.status,409);assert.equal(writes,1)})
test('unconfirmed read never returns success',async()=>{assert.equal((await persistSubmission({insert:async()=>({error:null}),read:async()=>({error:null,data:null})},row())).status,503)})
test('fresh row with changed approval cannot pass readback',async()=>{const r=row();assert.equal((await persistSubmission({insert:async()=>({error:null}),read:async()=>({error:null,data:{...r,is_approved:true}})},r)).status,503)})
test('database failure returns sanitized uncertainty',async()=>{assert.equal((await persistSubmission({insert:async()=>({error:{code:'42501'}}),read:async()=>{throw Error('must not read')}},row())).status,503)})
test('admin API fails closed, requires same-origin existing owner cookie',()=>{
 process.env.ADMIN_PASSWORD='isolated-test-only'
 const req=(cookie?:string,origin='https://example.invalid')=>({cookies:{get:()=>cookie?{value:cookie}:undefined},headers:{get:(k:string)=>k==='host'?'example.invalid':origin},nextUrl:{origin:'https://example.invalid'}} as unknown as NextRequest)
 assert.equal(adminAuthorized(req()),false);assert.equal(adminAuthorized(req('wrong')),false);assert.equal(adminAuthorized(req('isolated-test-only','https://evil.invalid')),false);assert.equal(adminAuthorized(req('isolated-test-only')),true);delete process.env.ADMIN_PASSWORD;assert.equal(adminAuthorized(req('isolated-test-only')),false)
})
