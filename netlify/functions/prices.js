// Netlify Function: prices (GET public, POST admin)
// Storage: Netlify Blobs "@netlify/blobs"
// Schema: { brand: { model: { "128": 500, "256": 560 } } }
export default async (req, context) => {
  const { getStore } = await import('@netlify/blobs');
  const store = getStore('drp-prices');

  const origin = req.headers.get('origin') || '*';
  const cors = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-admin-token',
  };
  if (req.method === 'OPTIONS') return new Response('', { status: 204, headers: cors });

  function flatten(map) {
    const items = [];
    for (const b of Object.keys(map||{})) {
      for (const m of Object.keys(map[b]||{})) {
        for (const s of Object.keys(map[b][m]||{})) {
          items.push({ brand:b, model:m, storage: Number(s), price: Number(map[b][m][s]) });
        }
      }
    }
    return items;
  }
  function toMap(items) {
    const map = {};
    (items||[]).forEach(it => {
      const b = (it.brand||'').trim(); const m = (it.model||'').trim();
      const s = Number(it.storage||0); const p = Number(it.price||0);
      if (!b || !m || !s || !p) return;
      map[b] = map[b] || {}; map[b][m] = map[b][m] || {}; map[b][m][String(s)] = p;
    });
    return map;
  }

  try {
    if (req.method === 'GET') {
      const raw = await store.get('catalog');
      const map = raw ? JSON.parse(raw) : {};
      const url = new URL(req.url);
      const q = (url.searchParams.get('q') || '').toUpperCase().trim();
      const as = url.searchParams.get('as') || 'map'; // 'map' | 'list'
      if (as === 'list') {
        let items = flatten(map);
        if (q) {
          items = items.filter(it => (`${it.brand} ${it.model} ${it.storage} ${it.price}`).toUpperCase().includes(q));
        }
        items.sort((a,b)=> a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model) || a.storage - b.storage);
        return new Response(JSON.stringify({ ok:true, items, count: items.length }), { status:200, headers: { ...cors, 'Content-Type':'application/json' } });
      }
      return new Response(JSON.stringify({ ok:true, map, count: flatten(map).length }), { status:200, headers: { ...cors, 'Content-Type':'application/json' } });
    }

    if (req.method === 'POST') {
      const admin  = req.headers.get('x-admin-token') || '';
      const secret = process.env.ADMIN_TOKEN || '';
      if (!secret || admin !== secret) {
        return new Response(JSON.stringify({ ok:false, error:'unauthorized' }), {
          status: 401, headers: { ...cors, 'Content-Type':'application/json' }
        });
      }
      const body = await req.json().catch(()=>null);
      if (!body) {
        return new Response(JSON.stringify({ ok:false, error:'invalid_json' }), { status:400, headers: { ...cors, 'Content-Type':'application/json' } });
      }

      // Replace full map
      if (body.map) {
        await store.set('catalog', JSON.stringify(body.map));
        return new Response(JSON.stringify({ ok:true, mode:'map' }), { status:200, headers: { ...cors, 'Content-Type':'application/json' } });
      }
      // Upsert batch
      if (Array.isArray(body.items)) {
        const raw = await store.get('catalog');
        const map = raw ? JSON.parse(raw) : {};
        const patch = toMap(body.items);
        for (const b of Object.keys(patch)) {
          map[b] = map[b] || {};
          for (const m of Object.keys(patch[b])) {
            map[b][m] = map[b][m] || {};
            for (const s of Object.keys(patch[b][m])) {
              map[b][m][s] = patch[b][m][s];
            }
          }
        }
        await store.set('catalog', JSON.stringify(map));
        return new Response(JSON.stringify({ ok:true, mode:'items' }), { status:200, headers: { ...cors, 'Content-Type':'application/json' } });
      }
      // Upsert single
      if (body.brand && body.model && body.storage && body.price) {
        const raw = await store.get('catalog');
        const map = raw ? JSON.parse(raw) : {};
        const b = (body.brand||'').trim(), m = (body.model||'').trim();
        const s = String(Number(body.storage||0)), p = Number(body.price||0);
        map[b] = map[b] || {}; map[b][m] = map[b][m] || {}; map[b][m][s] = p;
        await store.set('catalog', JSON.stringify(map));
        return new Response(JSON.stringify({ ok:true, mode:'single' }), { status:200, headers: { ...cors, 'Content-Type':'application/json' } });
      }

      return new Response(JSON.stringify({ ok:false, error:'bad_payload' }), { status:400, headers: { ...cors, 'Content-Type':'application/json' } });
    }

    return new Response(JSON.stringify({ ok:false, error:'method_not_allowed' }), { status:405, headers: { ...cors, 'Content-Type':'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ ok:false, error:String(e) }), { status: 500, headers: { ...cors, 'Content-Type':'application/json' } });
  }
};
