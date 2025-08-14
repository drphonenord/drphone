// netlify/functions/tickets.js
import { getStore } from '@netlify/blobs';

const STORE = getStore({
  name: 'drphone',
  siteID: process.env.NETLIFY_BLOBS_SITE_ID,
  token:  process.env.NETLIFY_BLOBS_TOKEN
});
const KEY = 'tickets';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-admin-token'
};
const ok = (b, s=200) => ({ statusCode:s, headers:{'Content-Type':'application/json', ...CORS}, body:JSON.stringify(b) });
const no = (b, s=400) => ok(b, s);
const needAuth = (m) => m === 'POST';

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') return { statusCode:204, headers: CORS };

  if (needAuth(event.httpMethod)) {
    if ((event.headers['x-admin-token']||'') !== (process.env.ADMIN_TOKEN||'')) {
      return no({ error:'unauthorized' }, 401);
    }
  }

  const load = async () => await STORE.getJSON(KEY) ?? [];
  const save = async (arr) => { await STORE.setJSON(KEY, arr); return arr; };

  if (event.httpMethod === 'GET') {
    const q = event.queryStringParameters?.q?.toLowerCase()?.trim();
    const openOnly = !!event.queryStringParameters?.open;
    const code = event.queryStringParameters?.code?.trim();

    const all = await load();

    if (code) {
      const item = all.find(t => (t.code||'').toLowerCase() === code.toLowerCase());
      return item ? ok({ item }) : no({ error:'not_found' }, 404);
    }

    let items = [...all].sort((a,b)=> (b.updated||'').localeCompare(a.updated||''));
    if (q) {
      items = items.filter(t => {
        const hay = `${t.code||''} ${t.client||''} ${t.model||''} ${t.status||''}`.toLowerCase();
        return hay.includes(q);
      });
    }
    if (openOnly) items = items.filter(t => (t.status||'') !== 'Restitué');
    return ok({ items: items.slice(0, 100) });
  }

  if (event.httpMethod === 'POST') {
    const body = JSON.parse(event.body || '{}');
    const now = new Date().toISOString();

    let arr = await load();
    let item = null;
    let code = (body.code||'').trim();

    if (!code) {
      const r = Math.floor(1000 + Math.random()*9000);
      const y = new Date().getFullYear();
      code = `DRP-${y}-${r}`;
    }

    const idx = arr.findIndex(t => (t.code||'').toLowerCase() === code.toLowerCase());
    if (idx >= 0) {
      item = { ...arr[idx],
        code,
        status: body.status || arr[idx].status || 'Réceptionné',
        model:  body.model  ?? arr[idx].model  ?? '',
        client: body.client ?? arr[idx].client ?? '',
        note:   body.note   ?? arr[idx].note   ?? '',
        updated: now
      };
      arr[idx] = item;
    } else {
      item = { code, status: body.status || 'Réceptionné', model: body.model||'', client: body.client||'', note: body.note||'', created: now, updated: now };
      arr.unshift(item);
    }

    await save(arr);
    return ok({ ok:true, item });
  }

  return no({ error:'method_not_allowed' }, 405);
}
