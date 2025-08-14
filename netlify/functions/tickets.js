
import { readJSON, writeJSON } from './_store.js';
import { ok, error, withCors, corsHeaders } from './_cors.js';
import { id, parseBody } from './_util.js';

const FILE = 'tickets.json';

async function loadAll() {
  return (await readJSON(FILE, [])) || [];
}

async function saveAll(items) {
  await writeJSON(FILE, items);
}

export async function handler(event, context) {
  if (event.httpMethod === 'OPTIONS') {
    return withCors({ statusCode: 204, body: '' });
  }

  try {
    const items = await loadAll();

    if (event.httpMethod === 'GET') {
      const params = event.queryStringParameters || {}
      const itemId = params.id;
      if (itemId) {
        const item = items.find(x => x.id === itemId);
        return item ? ok(item) : error('tickets: not found', 404);
      }
      return ok({ items });
    }

    if (event.httpMethod === 'POST') {
      const body = parseBody(event);
      const newItem = { id: id(), createdAt: new Date().toISOString(), ...body };
      items.push(newItem);
      await saveAll(items);
      return ok(newItem, 201);
    }

    if (event.httpMethod === 'PUT') {
      const body = parseBody(event);
      const itemId = body.id || (event.queryStringParameters || {}).id;
      if (!itemId) return error('Missing id for update', 422);
      const idx = items.findIndex(x => x.id === itemId);
      if (idx === -1) return error('tickets: not found', 404);
      items[idx] = { ...items[idx], ...body, id: itemId, updatedAt: new Date().toISOString() };
      await saveAll(items);
      return ok(items[idx]);
    }

    if (event.httpMethod === 'DELETE') {
      const params = event.queryStringParameters || {}
      const itemId = params.id || parseBody(event).id;
      if (!itemId) return error('Missing id for delete', 422);
      const filtered = items.filter(x => x.id !== itemId);
      if (filtered.length === items.length) return error('tickets: not found', 404);
      await saveAll(filtered);
      return ok({ ok: true });
    }

    return error('Method not allowed', 405);
  } catch (e) {
    console.error('Function tickets error:', e);
    return error('Internal error', 500);
  }
}
