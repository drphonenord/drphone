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
const KEY = 'prices_states';
export async function handler(event){
  if (event.httpMethod === 'OPTIONS') return { statusCode:204, headers: CORS };
  if (isWrite(event.httpMethod)) {
    if ((event.headers['x-admin-token']||'') !== (process.env.ADMIN_TOKEN||'')) return no({ error:'unauthorized' }, 401);
  }
  if (event.httpMethod === 'GET') {
    const data = await STORE.getJSON(KEY) ?? await seed();
    return ok(data);
  }
  if (event.httpMethod === 'PUT') {
    const body = JSON.parse(event.body||'{}');
    if (!Array.isArray(body.states)) return no({ error:'states must be an array' }, 400);
    const clean = body.states.map(s => ({ state:String(s.state||'').trim(), priceMin:Number(s.priceMin||0), priceMax:Number(s.priceMax||0) }));
    const payload = { updatedAt: new Date().toISOString(), states: clean };
    await STORE.setJSON(KEY, payload);
    return ok({ ok:true });
  }
  return no({ error:'method_not_allowed' }, 405);
}
async function seed(){
  const payload = {
    updatedAt: null,
    states: [
      { state:'Neuf', priceMin:200, priceMax:350 },
      { state:'Très bon', priceMin:170, priceMax:300 },
      { state:'Bon', priceMin:140, priceMax:260 },
      { state:'Écran fissuré', priceMin:80, priceMax:150 }
    ]
  };
  await STORE.setJSON(KEY, payload);
  return payload;
}
