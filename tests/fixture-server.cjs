// Isolated PostgREST protocol double. No external services, email or production credentials.
const http=require('node:http');const rows=new Map();const requests=[];
const seed={id:'00000000-0000-4000-8000-000000000001',slug:'fixture-approved',full_name:'Synthetic approved fixture',specialties:[],telehealth_available:false,accepts_children:false,accepting_new_patients:true,city:'Raleigh',state:'NC',is_active:true,is_approved:true,listing_tier:'free',listing_tier_rank:0,is_mobile:false,is_clinic:true,services_offered:['Hydration / Saline'],photos:[],claimed:false,verified:false,created_at:'2026-01-01T00:00:00Z',updated_at:'2026-01-01T00:00:00Z'};rows.set(seed.slug,seed);
http.createServer(async(req,res)=>{const u=new URL(req.url,'http://localhost');res.setHeader('content-type','application/json');
 if(u.pathname==='/test/reset'){rows.clear();rows.set(seed.slug,seed);requests.length=0;res.end('{}');return}
 if(u.pathname==='/test/state'){res.end(JSON.stringify({rows:[...rows.values()],requests}));return}
 requests.push({method:req.method,path:u.pathname,query:u.search});
 if(!u.pathname.startsWith('/rest/v1/')){res.statusCode=404;res.end('{}');return}
 const table=u.pathname.split('/').pop();if(table!=='dpc_listings'){res.end('[]');return}
 if(req.method==='POST'){let raw='';for await(const c of req)raw+=c;const r=JSON.parse(raw);if(r.email==='fail@example.invalid'){res.statusCode=503;res.end(JSON.stringify({code:'XX000',message:'synthetic failure'}));return}if(rows.has(r.slug)){res.statusCode=409;res.end(JSON.stringify({code:'23505'}));return}rows.set(r.slug,{...r,id:'00000000-0000-4000-8000-000000000002',created_at:new Date().toISOString()});res.statusCode=201;res.end('');return}
 let selected=[...rows.values()];for(const[k,v]of u.searchParams){if(v.startsWith('eq.'))selected=selected.filter(r=>String(r[k])===v.slice(3));if(v.startsWith('ilike.'))selected=selected.filter(r=>String(r[k]).toLowerCase()===v.slice(6).toLowerCase())}
 if(req.method==='HEAD'){res.setHeader('content-range',`0-${Math.max(0,selected.length-1)}/${selected.length}`);res.end();return}
 if((req.headers.accept||'').includes('vnd.pgrst.object')){if(selected.length!==1){res.statusCode=406;res.end(JSON.stringify({code:'PGRST116',details:`The result contains ${selected.length} rows`}));return}res.end(JSON.stringify(selected[0]));return}
 res.setHeader('content-range',`0-${Math.max(0,selected.length-1)}/${selected.length}`);res.end(JSON.stringify(selected));
}).listen(47901,'127.0.0.1',()=>console.log('isolated fixture on 47901'));
