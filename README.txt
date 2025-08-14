drphonenord — full-pack (functions patch + netlify.toml)

1) Upload tout le contenu à la racine du repo GitHub.
2) Netlify → Site settings → Environment variables :
   - ADMIN_TOKEN = ta clé (ex. dawson-123)
   - NETLIFY_BLOBS_SITE_ID = Site ID (General → Site details)
   - NETLIFY_BLOBS_TOKEN   = Personal access token (User settings → Applications)
3) Netlify → Deploys → Trigger deploy → Clear cache and deploy site.
4) Teste :
   - /.netlify/functions/clients
   - /.netlify/functions/repairs
   - /.netlify/functions/prices_states
   - /.netlify/functions/tickets
