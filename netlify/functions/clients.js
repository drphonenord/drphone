import { getStore } from '@netlify/blobs';
import { res, isWrite, ok204 } from './_common.js';

const STORE = getStore({ name: 'drphone', siteID: process.env.NETLIFY_BLOBS_SITE_ID, token: process.env.NETLIFY_BLOBS_TOKEN });
const KEY = 'clients';

export async function handler(event){
  if (event.httpMethod === 'OPTIONS') return ok204();
  if (isWrite(event.httpMethod)) {
    if ((event.headers['x-admin-token']||'') !== (process.env.ADMIN_TOKEN||'')) return res({ error:'unauthorized' }, 401);
  }
  if (event.httpMethod === 'GET'){
    const data = await STORE.getJSON(KEY) ?? await seed();
    return res(data);
  }
  if (event.httpMethod === 'POST'){
    const body = JSON.parse(event.body||'{}');
    const data = (await STORE.getJSON(KEY)) ?? [];
    data.push({ id: crypto.randomUUID(), ...body, createdAt: new Date().toISOString() });
    await STORE.setJSON(KEY, data);
    return res({ ok:true });
  }
  return res({ error:'method not allowed' }, 405);
}

async function seed(){
  const rows = [
    { id: crypto.randomUUID(), name: 'Alice Martin', phone: '06 12 34 56 78', email: 'alice@example.com', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Karim Ben', phone: '07 98 76 54 32', email: 'karim@example.com', createdAt: new Date().toISOString() }
  ];
  await STORE.setJSON(KEY, rows);
  return rows;
}
