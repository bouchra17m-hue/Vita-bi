# 🚀 Déploiement VitaBi - Complet

> Déployer le site en ligne sur **Vercel** + API Laravel

---

## 📋 Table des matières

1. [Configuration Locale](#configuration-locale)
2. [Déployer le Backend](#déployer-le-backend)
3. [Déployer le Frontend sur Vercel](#déployer-le-frontend-sur-vercel)
4. [Tester en Ligne](#tester-en-ligne)
5. [Troubleshooting](#troubleshooting)

---

## Configuration Locale

### Prérequis

- PHP 8.0+ avec extensions: `pdo_mysql`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `json`, `fileinfo`
- Node.js 16+
- Composer
- MySQL (ou accessible à distance)

### Installation locale

```bash
# 1. Backend
cd backend
composer install
cp .env.example .env
php artisan key:generate

# 2. Frontend
cd ../pfevitabi
npm install
```

### Lancer localement

**Terminal 1 - Backend:**
```bash
cd backend
php artisan serve
# Accessible sur http://127.0.0.1:8000
```

**Terminal 2 - Frontend:**
```bash
cd pfevitabi
npm run dev
# Accessible sur http://localhost:5173
```

---

## Déployer le Backend

### Option 1️⃣: Alwaysdata (Recommandé - DB existe déjà)

#### Prérequis
- Compte Alwaysdata créé
- Domaine acheté ou utiliser un sous-domaine Alwaysdata

#### Étapes

1. **Créer une app web sur Alwaysdata**
   - Admin dashboard → Web applications
   - PHP version 8.0+
   - Document root: `/public/backend`

2. **Uploader le code**
   
   Option A: Via Git (recommandé)
   ```bash
   cd backend
   git remote add alwaysdata ssh://user@git.alwaysdata.com/~/repository.git
   git push alwaysdata main
   ```

   Option B: Via SFTP
   - Compressez `/backend`
   - Uploadez via SFTP
   - Décompressez sur le serveur

3. **Configurer le serveur**
   
   Via Alwaysdata SSH/Terminal:
   ```bash
   cd /path/to/backend
   
   # Installer dépendances
   composer install --no-dev --optimize-autoloader
   
   # Générer clé
   php artisan key:generate --force
   
   # Migrer BD
   php artisan migrate --force
   
   # Seeder (optionnel)
   php artisan db:seed --force
   
   # Optim cache
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   
   # Permissions
   chmod -R 775 storage bootstrap/cache
   ```

4. **Configurer `.env` production**
   
   Via Alwaysdata Admin:
   ```env
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://api.monsite.alwaysdata.net
   
   DB_CONNECTION=mysql
   DB_HOST=mysql-boushera-bai.alwaysdata.net
   DB_PORT=3306
   DB_DATABASE=boushera-bai_vitabi
   DB_USERNAME=boushera-bai
   DB_PASSWORD=bouchra1975@@
   
   SANCTUM_STATEFUL_DOMAINS=localhost,127.0.0.1,vita-bi.vercel.app
   ```

5. **Tester l'API**
   ```bash
   curl https://api.monsite.alwaysdata.net/api/test
   ```

### Option 2️⃣: Render.com (Gratuit + HTTPS)

1. Push le code vers GitHub
2. Connecter GitHub à Render
3. Créer nouveau Web Service
4. Build command: `composer install && php artisan migrate --force`
5. Start command: `php artisan serve --host 0.0.0.0`
6. Configurer variables env

### Option 3️⃣: Railway.app (Simple + Payant)

1. Connecter GitHub
2. "New Project" → Deploy
3. Configurer PostgreSQL ou MySQL
4. Déployer automatiquement

---

## Déployer le Frontend sur Vercel

### Prérequis
- Compte Vercel créé
- Repo GitHub pushé

### Étapes

1. **Se connecter à Vercel**
   ```
   https://vercel.com/dashboard
   ```

2. **Importer le projet**
   - "New Project" → Import Git Repository
   - Sélectionner votre repo
   - Configuration auto-détectée

3. **Configurer les variables d'environnement**
   - Project Settings → Environment Variables
   - Ajouter: `VITE_API_URL` = `https://api.votre-domaine.com`
   - Production et Preview: `https://api.votre-domaine.com`

4. **Redéployer après changement**
   - Vércel redéploie auto à chaque push GitHub
   - Ou manuellement via Dashboard → Deployments → Redeploy

5. **Domaine personnalisé (optionnel)**
   - Settings → Domains
   - Ajouter votre domaine personnalisé

---

## Tester en Ligne

### Test de l'API

```bash
# Vérifier santé
curl https://api.votre-domaine.com/api/test

# S'inscrire
curl -X POST https://api.votre-domaine.com/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Testeur",
    "email":"test@example.com",
    "password":"password123",
    "password_confirmation":"password123"
  }'

# Se connecter
curl -X POST https://api.votre-domaine.com/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"password123"
  }'
```

### Test du Frontend

1. Aller sur `https://vita-bi.vercel.app`
2. Cliquer "Sign Up" ou "Se Connecter"
3. Tester inscription/connexion
4. Vérifier dans la console du navigateur (F12) pour les erreurs

---

## Troubleshooting

### ❌ "Impossible de joindre le backend"

**Cause:** L'API URL est incorrecte ou le serveur est down

**Solution:**
```bash
# Vérifier URL
curl https://api.votre-domaine.com/api/test

# Si 404: Vérifier que le backend est deployed et live
# Si timeout: Serveur down, contacter l'hébergeur

# Vérifier la variable Vercel
# Settings → Environment Variables → VITE_API_URL
```

### ❌ Erreur CORS

**Cause:** Frontend et Backend sur domaines différents

**Solution:** Vérifier `backend/config/cors.php`
```php
'allowed_origins' => ['*'],
'supports_credentials' => false,
```

Et `SANCTUM_STATEFUL_DOMAINS` dans `.env`:
```env
SANCTUM_STATEFUL_DOMAINS=localhost,127.0.0.1,vita-bi.vercel.app
```

### ❌ Sessions ne persist pas

**Cause:** Tokens pas persistés correctement

**Solution:**
```bash
# Vérifier localStorage dans F12 Console
localStorage.getItem('token')
localStorage.getItem('user')

# Redéployer le frontend
# Settings → Deployments → Redeploy
```

### ❌ Base de données vide

**Cause:** Migrations pas exécutées

**Solution:**
```bash
# Sur le serveur
cd /path/to/backend
php artisan migrate --force
php artisan db:seed --force
```

---

## Checklist Déploiement Final

- [ ] Backend déployé sur serveur (Alwaysdata/Render/Railway)
- [ ] API accessible sur HTTPS
- [ ] `SANCTUM_STATEFUL_DOMAINS` configuré
- [ ] Variables env Vercel configurées (`VITE_API_URL`)
- [ ] Frontend redéployé sur Vercel
- [ ] Test inscription fonctionnel en ligne
- [ ] Test connexion fonctionnel en ligne
- [ ] Admin panel accessible (`/admin`)
- [ ] Base de données migée et seedée
- [ ] HTTPS actif sur API et Frontend
- [ ] Monitoring/logs setup (optionnel)

---

## URLs de Production (Exemples)

```
Frontend:  https://vita-bi.vercel.app
API:       https://api.vita-bi.alwaysdata.net
Admin:     https://vita-bi.vercel.app/admin
Profil:    https://vita-bi.vercel.app/profile
```

---

## Support & Questions

- 📖 [Documentation Laravel](https://laravel.com/docs)
- 📖 [Documentation Vercel](https://vercel.com/docs)
- 📖 [Documentation Alwaysdata](https://www.alwaysdata.com/)
- 💬 Contactez votre hébergeur en cas de problème

---

**Dernière mise à jour:** Juin 2026
**Statut:** ✅ Prêt pour production
