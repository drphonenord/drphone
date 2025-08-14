import { getStore } from '@netlify/blobs';
import { res, isWrite, ok204 } from './_common.js';

const STORE = getStore({ name: 'drphone', siteID: process.env.NETLIFY_BLOBS_SITE_ID, token: process.env.NETLIFY_BLOBS_TOKEN });
const KEY = 'prices_states';

export async function handler(event){
  if (event.httpMethod === 'OPTIONS') return ok204();
  if (isWrite(event.httpMethod)) {
    if ((event.headers['x-admin-token']||'') !== (process.env.ADMIN_TOKEN||'')) return res({ error:'unauthorized' }, 401);
  }
  if (event.httpMethod === 'GET'){
    const data = await STORE.getJSON(KEY) ?? await seed();
    return res(data);
  }
  if (event.httpMethod === 'PUT'){
    const body = JSON.parse(event.body||'{}');
    if (!Array.isArray(body.states)) return res({ error:'states must be an array' }, 400);
    const clean = body.states.map(s=>({ state:String(s.state||'').trim(), priceMin:Number(s.priceMin||0), priceMax:Number(s.priceMax||0) }));
    const payload = { updatedAt: new Date().toISOString(), states: clean };
    await STORE.setJSON(KEY, payload);
    return res({ ok:true });
  }
  return res({ error:'method not allowed' }, 405);
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
