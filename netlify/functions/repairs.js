import { getStore } from '@netlify/blobs';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-admin-token'
};
const ok = (b, s=200) => ({ statusCode:s, headers:{'Content-Type':'application/json', ...CORS}, body:JSON.stringify(b) });
const no = (b, s=400) => ok(b, s);
const isWrite = (m) => ['POST','PUT','PATCH','DELETE'].includes(m);

const STORE = getStore({ name: 'drphone', siteID: process.env.NETLIFY_BLOBS_SITE_ID, token: process.env.NETLIFY_BLOBS_TOKEN });
const KEY = 'repairs';
export async function handler(e){
  if(e.httpMethod==='OPTIONS') return ok(null,204);
  if(isWrite(e.httpMethod)){ if((e.headers['x-admin-token']||'') !== (process.env.ADMIN_TOKEN||'')) return no({error:'unauthorized'},401); }
  if(e.httpMethod==='GET'){ const d = await STORE.getJSON(KEY) ?? await seed(); return ok(d); }
  if(e.httpMethod==='POST'){ const body=JSON.parse(e.body||'{}'); const d=(await STORE.getJSON(KEY)) ?? []; d.push({ id: crypto.randomUUID(), ...body, createdAt: new Date().toISOString() }); await STORE.setJSON(KEY,d); return ok({ok:true}); }
  return no({error:'method_not_allowed'},405);
}
async function seed(){ const rows=[
  { id: crypto.randomUUID(), client:'Alice Martin', device:'iPhone 13', issue:'Écran', createdAt:new Date().toISOString() },
  { id: crypto.randomUUID(), client:'Karim Ben', device:'Samsung S21', issue:'Batterie', createdAt:new Date().toISOString() }
]; await STORE.setJSON(KEY, rows); return rows; }
