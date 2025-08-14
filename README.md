
# DrPhoneNord - Netlify Functions (patched)

Pack complet pour corriger l'erreur `STORE.getJSON is not a function` et fournir des endpoints CRUD prêts à l'emploi.

## Contenu
- `netlify/functions/_store.js` : helpers pour lire/écrire du JSON dans Netlify Blobs (compatible v7).
- `netlify/functions/_cors.js` : CORS + helpers de réponses.
- `netlify/functions/_util.js` : utilitaires (génération d'id, parse du body).
- `netlify/functions/clients.js` : CRUD (GET/POST/PUT/DELETE) pour *clients*.
- `netlify/functions/repairs.js` : CRUD pour *repairs*.
- `netlify/functions/tickets.js` : CRUD pour *tickets*.
- `netlify/functions/prices.js` : CRUD pour *prices* (prix par état).
- `package.json` : dépendances (ESM + @netlify/blobs v7).
- `netlify.toml` : configuration Functions (esbuild).

## Appel des endpoints
- `GET /.netlify/functions/clients` → liste
- `GET /.netlify/functions/clients?id=ABC123` → un élément
- `POST /.netlify/functions/clients` → crée (body JSON libre)
- `PUT /.netlify/functions/clients` → met à jour (body contient `id`)
- `DELETE /.netlify/functions/clients?id=ABC123` → supprime

Même schéma pour `repairs`, `tickets`, `prices`.

## CORS
Par défaut `Access-Control-Allow-Origin: *`.  
En prod, définis `CORS_ORIGIN` dans les variables d'environnement Netlify.

## Déploiement
1) Remplacer votre dossier `netlify/functions` par celui de ce pack
2) `npm install` (dans le dossier racine du repo)
3) Déployer sur Netlify

