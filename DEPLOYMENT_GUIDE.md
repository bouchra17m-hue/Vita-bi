# 🚀 Guide de Déploiement Vercel + API

## Configuration Vercel

### 1. Créer un fichier `.env.production` (ou configurer via Vercel Dashboard)

Pour que le frontend communique avec l'API en ligne:

```
VITE_API_URL=https://api.votre-domaine.com
```

### 2. Ajouter les variables d'environnement dans Vercel Dashboard

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet
3. Settings → Environment Variables
4. Ajoutez: `VITE_API_URL=https://api.votre-domaine.com`
5. Redéployez

### 3. Format final de l'URL API

- **Développement local:** `http://127.0.0.1:8000`
- **Production:** `https://api.votre-domaine.com`

---

## Configuration du Backend (Laravel)

### Option 1: Déployer sur Alwaysdata (Recommandé - BD existe déjà)

```bash
# 1. Setup SSH avec Alwaysdata
# (voir les docs Alwaysdata)

# 2. Clone et configure le backend
cd /var/www/backend
git clone <votre-repo> .
composer install --no-dev

# 3. Créer .env production
cp .env.example .env
nano .env
# Modifiez:
# APP_ENV=production
# APP_DEBUG=false
# APP_URL=https://api.votre-domaine.alwaysdata.net

# 4. Setup permissions et cache
php artisan key:generate
php artisan migrate --force
php artisan config:cache
php artisan route:cache

# 5. Teste
curl https://api.votre-domaine.alwaysdata.net/api/test
```

### Option 2: Autres plateformes

- **Render.com** (gratuit, HTTPS)
- **Railway.app** (payant mais simple)
- **DigitalOcean App Platform**
- **Heroku** (payant depuis 2022)

---

## Test de Connexion

### Frontend en ligne vers Backend en ligne

```bash
# Tester l'inscription
curl -X POST https://api.votre-domaine.com/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Test",
    "email":"test@example.com",
    "password":"password123",
    "password_confirmation":"password123"
  }'

# Tester la connexion
curl -X POST https://api.votre-domaine.com/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"password123"
  }'
```

---

## Variables d'Environnement Vercel à Configurer

| Variable | Valeur | Notes |
|----------|--------|-------|
| `VITE_API_URL` | `https://api.votre-domaine.com` | URL backend en ligne |
| `VITE_APP_ENV` | `production` | Optionnel |

---

## Checklist de Déploiement

- [ ] Backend déployé et accessible sur HTTPS
- [ ] CORS configuré dans `config/cors.php`
- [ ] `SANCTUM_STATEFUL_DOMAINS` inclut votre domaine Vercel
- [ ] Variables d'environnement Vercel configurées
- [ ] Frontend redéployé après changements
- [ ] Test de connexion réussi en ligne

---

## Troubleshooting

### Erreur: "Impossible de joindre le backend"

1. Vérifiez que l'API est accessible: `curl https://api.votre-domaine.com/api/test`
2. Vérifiez la variable `VITE_API_URL` dans Vercel
3. Redéployez le frontend après changement

### Erreur CORS

Vérifiez `backend/config/cors.php`:
```php
'allowed_origins' => ['*'],  // ou ['https://vita-bi.vercel.app']
'supports_credentials' => false,
```

### Sessions ne persistent pas

Assurez-vous que `SANCTUM_STATEFUL_DOMAINS` inclut votre domaine:
```env
SANCTUM_STATEFUL_DOMAINS=localhost,127.0.0.1,vita-bi.vercel.app
```

---

## À Faire Immédiatement

1. **Déployer le backend** (choisir une plateforme)
2. **Obtenir l'URL API** (ex: https://api.vita-bi.alwaysdata.net)
3. **Configurer Vercel** avec VITE_API_URL
4. **Redéployer le frontend** sur Vercel
5. **Tester la connexion** en ligne
