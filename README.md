# Dr Phone — Admin complet (Hotfix Blobs)

## Installation rapide (UI)
1) GitHub → **Upload** ce dossier (racine).  
2) Netlify → **Import from GitHub**  
   - Build: *(vide)*  
   - Publish dir: `public`  
   - Functions dir: `netlify/functions`  
3) Netlify → **Site settings → Environment variables**  
   - `ADMIN_TOKEN = <ta_clé>` → Save  
   - (Optionnel si Blobs pas activé) `NETLIFY_BLOBS_SITE_ID`, `NETLIFY_BLOBS_TOKEN`  
4) **Deploys → Trigger deploy → Deploy site** (ou *Clear cache and deploy site*).

## Admin
`/admin/dashboard.html` → colle le `ADMIN_TOKEN` → Enregistrer.

## API
- `/.netlify/functions/clients` (GET, POST)
- `/.netlify/functions/repairs` (GET, POST)
- `/.netlify/functions/prices_states` (GET, PUT)

## Hotfix Blobs
**Option A (recommandé)** : activer **Storage → Blobs** sur le site Netlify puis *Clear cache and deploy site*.
**Option B** : variables d'env manuelles :
- `NETLIFY_BLOBS_SITE_ID` = *Site ID* (Site settings → General → Site details)
- `NETLIFY_BLOBS_TOKEN` = *Personal access token* (User settings → Applications → Personal access tokens)

Le code des fonctions utilise automatiquement `getStore({ name, siteID, token })` si ces variables sont présentes.
