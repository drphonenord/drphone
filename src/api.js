
// src/api.js
// Helper léger pour consommer les Netlify Functions.
// Utilisation : import { api } from './api'; await api.clients.list();

const BASE = '/.netlify/functions';

async function jsonOrThrow(res) {
  if (!res.ok) {
    let text;
    try { text = await res.text(); } catch { text = String(res.status); }
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

function build(resource) {
  const url = (path = '', qs = '') => `${BASE}/${resource}${path}${qs ? `?${qs}` : ''}`;
  return {
    list: () => fetch(url()).then(jsonOrThrow),
    get: (id) => fetch(url('', new URLSearchParams({ id }))).then(jsonOrThrow),
    create: (data) => fetch(url(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(jsonOrThrow),
    update: (data) => fetch(url(), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(jsonOrThrow),
    remove: (id) => fetch(url('', new URLSearchParams({ id })), {
      method: 'DELETE'
    }).then(jsonOrThrow),
  };
}

export const api = {
  clients: build('clients'),
  repairs: build('repairs'),
  tickets: build('tickets'),
  prices: build('prices'),
};

// Exemple rapide d'usage (à supprimer si inutile) :
// const { items } = await api.clients.list();
// const created = await api.clients.create({ name: 'Nouveau client', phone: '06...' });
// const updated = await api.clients.update({ id: created.id, phone: '07...' });
// await api.clients.remove(created.id);
