
import { getStore } from '@netlify/blobs';
export const STORE = getStore({ name: 'drphonenord', consistency: 'strong' });
export async function readJSON(key, fallback=null){ const res=await STORE.get(key); if(!res) return fallback; const type=res.type||res.headers?.get?.('content-type')||''; if(typeof res.json==='function' && type.includes('application/json')) return await res.json(); const text=await res.text(); try{ return JSON.parse(text); }catch{ return fallback; } }
export async function writeJSON(key, data){ const body=typeof data==='string'?data:JSON.stringify(data); await STORE.set(key, body, { contentType: 'application/json' }); }
