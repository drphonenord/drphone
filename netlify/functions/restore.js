import { getStore } from '@netlify/blobs';
const s = getStore({ name:'drphone', siteID: process.env.NETLIFY_BLOBS_SITE_ID, token: process.env.NETLIFY_BLOBS_TOKEN });
const H={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type, x-admin-token'};
const ok=(b,s=200)=>({statusCode:s,headers:{'Content-Type':'application/json',...H},body:JSON.stringify(b)});
export async function handler(e){
  if(e.httpMethod==='OPTIONS') return {statusCode:204,headers:H};
  if((e.headers['x-admin-token']||'') !== (process.env.ADMIN_TOKEN||'')) return ok({error:'unauthorized'},401);
  const body = JSON.parse(e.body||'{}');
  if(!body?.data) return ok({error:'missing data'},400);
  for(const [k,v] of Object.entries(body.data)) await s.setJSON(k, v);
  return ok({ok:true});
}
