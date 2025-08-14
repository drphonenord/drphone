# Dr Phone — Admin complet (GitHub → Netlify)

## Installation (UI only)
### 1) GitHub
- Dézippe ce projet.
- Dans ton repo GitHub → **Add file → Upload files** → uploade **tout le contenu à la racine** (dossiers `admin`, `netlify`, `public`, plus `netlify.toml`, etc.).
- **Commit**.

### 2) Netlify
- **Add new site → Import an existing project → GitHub** → choisis le repo.
- Build command : *(vide)*
- Publish directory : `public`
- Functions directory : `netlify/functions`
- **Deploy**.

### 3) Variables d’environnement
- Netlify → **Site settings → Environment variables**
  - `ADMIN_TOKEN = <ta_clé>` → **Save**
- **Deploys → Trigger deploy → Deploy site** (pour prendre en compte l’ENV).

## Admin
- Ouvre `/admin/dashboard.html` → colle ton `ADMIN_TOKEN` → Enregistrer.
- Onglets : **Clients**, **Réparations**, **Prix**.
- L’UI envoie automatiquement `x-admin-token` pour les méthodes non-GET.

## API (fonctions)
- `/.netlify/functions/clients` (GET, POST)
- `/.netlify/functions/repairs` (GET, POST)
- `/.netlify/functions/prices_states` (GET, PUT)
Toutes les méthodes **non-GET** exigent `x-admin-token: <ADMIN_TOKEN>`.

## Données
- Stockées dans **Netlify Blobs** (store `drphone`).
- Seeds initiales chargées au premier appel si vide.
