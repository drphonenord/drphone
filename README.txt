Dr Phone — Addon Admin + Functions

Contenu à déposer à la racine de ton repo :
- netlify.toml (si tu en as déjà un, garde le tien et copie les sections headers/redirects)
- netlify/functions/{clients.js, repairs.js, prices_states.js, tickets.js, backup.js, restore.js}
- public/admin/{dashboard.html, clients.html, repairs.html, prices.html}
- public/{ticket-admin.html, suivi.html}

Étapes Netlify :
1) Site settings → Storage → Blobs → Enable
2) Site settings → Environment variables :
   - ADMIN_TOKEN = ta_clé
   - (optionnel) NETLIFY_BLOBS_SITE_ID, NETLIFY_BLOBS_TOKEN
3) Deploys → Trigger deploy → Clear cache and deploy site

Smoke tests :
- /.netlify/functions/clients
- /.netlify/functions/repairs
- /.netlify/functions/prices_states
- /.netlify/functions/tickets
- /admin/dashboard.html, /ticket-admin.html, /suivi.html
