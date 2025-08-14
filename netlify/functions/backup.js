import { getStore } from '@netlify/blobs';
const s = getStore({ name:'drphone', siteID: process.env.NETLIFY_BLOBS_SITE_ID, token: process.env.NETLIFY_BLOBS_TOKEN });
const H={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET, OPTIONS','Access-Control-Allow-Headers':'Content-Type, x-admin-token'};
const ok=(b,s=200)=>({statusCode:s,headers:{'Content-Type':'application/json',...H},body:JSON.stringify(b)});
export async function handler(e){
  if(e.httpMethod==='OPTIONS') return {statusCode:204,headers:H};
  if((e.headers['x-admin-token']||'') !== (process.env.ADMIN_TOKEN||'')) return ok({error:'unauthorized'},401);
  const keys=['clients','repairs','prices_states','tickets']; const out={};
  for(const k of keys) out[k] = await s.getJSON(k) ?? null;
  return ok({ exportedAt:new Date().toISOString(), data: out });
}
