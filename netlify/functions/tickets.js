// Netlify Function: tickets (GET for public read, POST for admin write)
// Storage: Netlify Blobs "@netlify/blobs"
// Auth: header "x-admin-token" must match environment var ADMIN_TOKEN for writes.

export default async (req, context) => {
  const { getStore } = await import('@netlify/blobs');
  const store = getStore('drp-tickets');
  const origin = req.headers.get('origin') || '*';
  const cors = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-admin-token',
  };
  if (req.method === 'OPTIONS') {
    return new Response('', { status: 204, headers: cors });
  }

  try {
    if (req.method === 'GET') {
      const url = new URL(req.url);
      const id = url.searchParams.get('id');
      if (id) {
        const val = await store.get(id);
        if (!val) return new Response(JSON.stringify({ ok:false, error:'not_found' }), { status: 404, headers: { ...cors, 'Content-Type':'application/json' } });
        return new Response(val, { status: 200, headers: { ...cors, 'Content-Type':'application/json' } });
      }
      // list recent
      const { blobs } = await store.list({ prefix: '', cursor: undefined, limit: 100 });
      const items = [];
      for (const b of blobs) {
        const v = await store.get(b.key);
        try { items.push(JSON.parse(v)); } catch { items.push({ code:b.key }); }
      }
      items.sort((a,b)=> (b.updated||'').localeCompare(a.updated||''));
      return new Response(JSON.stringify({ ok:true, items }), { status:200, headers: { ...cors, 'Content-Type':'application/json' } });
    }

    if (req.method === 'POST') {
      const admin = req.headers.get('x-admin-token') || '';
      const secret = Deno.env.get('ADMIN_TOKEN') || '';
      if (!secret || admin !== secret) {
        return new Response(JSON.stringify({ ok:false, error:'unauthorized' }), { status: 401, headers: { ...cors, 'Content-Type':'application/json' } });
      }
      const body = await req.json().catch(()=>null);
      if (!body) return new Response(JSON.stringify({ ok:false, error:'invalid_json' }), { status:400, headers: { ...cors, 'Content-Type':'application/json' } });

      // Generate code if empty
      let code = (body.code || '').trim();
      if (!code) {
        const now = new Date();
        const yy = now.getFullYear();
        const rnd = Math.floor(Math.random()*900)+100; // 3 digits
        code = `DRP-${yy}-${rnd}`;
      }

      const payload = {
        code,
        status: body.status || 'En cours',
        model: body.model || '',
        client: body.client || '',
        note: body.note || '',
        updated: body.updated || new Date().toISOString().slice(0,16).replace('T',' '),
      };

      await store.set(code, JSON.stringify(payload));
      return new Response(JSON.stringify({ ok:true, item:payload }), { status:200, headers: { ...cors, 'Content-Type':'application/json' } });
    }

    return new Response(JSON.stringify({ ok:false, error:'method_not_allowed' }), { status: 405, headers: { ...cors, 'Content-Type':'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ ok:false, error:String(e) }), { status: 500, headers: { ...cors, 'Content-Type':'application/json' } });
  }
};
