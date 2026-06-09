# 🚀 Guide Complet: Déployer Laravel sur Alwaysdata

## 📋 État Actuel
- ✅ Domaine Alwaysdata configuré: `https://boushera-bai.alwaysdata.net`
- ✅ Base de données MySQL: `boushera-bai_vitabi` (prête)
- ❌ Code Laravel: **À DÉPLOYER**
- ❌ API test: Répond en 404 (page par défaut Alwaysdata)

---

## 🔧 Déploiement avec Git (Recommandé - Plus rapide)

### 1. Accédez au SSH Alwaysdata

```bash
# Dans Alwaysdata Panel:
# 1. Allez sur "Comptes" → Cliquez sur votre compte
# 2. Notez votre "Utilisateur SSH" (ex: boushera-bai)
# 3. Allez sur "Accès distant" → SSH
# 4. Générez/copiez votre clé SSH

# Connectez-vous en SSH:
ssh boushera-bai@ssh-boushera-bai.alwaysdata.net
```

### 2. Clonez votre repository GitHub

```bash
# Allez dans le répertoire web
cd /var/www/boushera-bai/public_html

# Clonez le backend
git clone https://github.com/VOTRE-USERNAME/Pfe_ihssaan.git backend
cd backend/backend
```

### 3. Installez les dépendances PHP

```bash
# Installez les packages Composer
composer install --no-dev --optimize-autoloader

# Copiez le .env production
cp .env.production .env

# Générez la clé application
php artisan key:generate

# Créez les répertoires storage
mkdir -p storage/logs storage/framework/cache storage/framework/sessions storage/framework/views
chmod -R 775 storage bootstrap/cache

# Exécutez les migrations
php artisan migrate --force
php artisan db:seed --force (optionnel, si vous avez des seeders)

# Nettoyez le cache
php artisan config:cache
php artisan route:cache
```

### 4. Configurez le serveur web

**Dans Alwaysdata Panel:**
1. Allez sur "Sites & Domains"
2. Cliquez sur `boushera-bai.alwaysdata.net`
3. Configurez le "Répertoire racine" vers: `/var/www/boushera-bai/public_html/backend/backend/public`
4. Enregistrez

### 5. Testez l'API

```bash
# Depuis votre PC, testez:
curl https://boushera-bai.alwaysdata.net/api/test
# Doit afficher: {"message":"Le backend Laravel fonctionne !","status":"success"}
```

---

## 📱 Déploiement Complet (Étapes détaillées)

### Étape 1: Préparation locale
```bash
cd c:\Users\pro\Desktop\vitabi\Pfe_ihssaan\backend

# Vérifiez que tout fonctionne en local
php artisan serve --port=8000

# Dans un autre terminal, testez
curl http://127.0.0.1:8000/api/test
```

### Étape 2: Vérifiez les fichiers .env

**backend/.env.production** (déjà correct):
```
APP_ENV=production
APP_DEBUG=false
APP_URL=https://boushera-bai.alwaysdata.net
DB_HOST=mysql-boushera-bai.alwaysdata.net
DB_DATABASE=boushera-bai_vitabi
DB_USERNAME=boushera-bai
DB_PASSWORD=bouchra1975@@
```

### Étape 3: Commitez et poussez

```bash
cd c:\Users\pro\Desktop\vitabi\Pfe_ihssaan

# Commitez les changements de config
git add backend/.env.production pfevitabi/.env.production backend/config/cors.php api/recipes.js
git commit -m "config: Update Alwaysdata backend URL to boushera-bai.alwaysdata.net"
git push origin main
```

### Étape 4: Déploiement sur Alwaysdata (SSH)

```bash
# Connectez-vous à Alwaysdata
ssh boushera-bai@ssh-boushera-bai.alwaysdata.net

# Allez au répertoire web
cd /var/www/boushera-bai/public_html

# Si c'est le premier déploiement
git clone https://github.com/VOTRE-USERNAME/Pfe_ihssaan.git app
cd app/backend

# Si le repo existe déjà
cd app/backend
git pull origin main

# Installez les dépendances
composer install --no-dev --optimize-autoloader
cp .env.production .env
php artisan key:generate
php artisan migrate --force
php artisan config:cache
php artisan route:cache

# Vérifiez que ça marche
php artisan tinker
# > Artisan::call('list'); (devrait afficher les commandes)
# > exit
```

### Étape 5: Configuration du domaine (Alwaysdata Panel)

1. Allez dans "Sites & Domains"
2. Sélectionnez `boushera-bai.alwaysdata.net`
3. Répertoire racine: `/var/www/boushera-bai/public_html/app/backend/public`
4. PHP: Version 7.4+ (vérifiez votre `php.ini` pour les extensions)
5. Enregistrez et attendez quelques minutes

### Étape 6: Vérification

```bash
# Testez depuis votre PC:
curl https://boushera-bai.alwaysdata.net/api/test
curl https://boushera-bai.alwaysdata.net/api/recipes
```

---

## ⚠️ Troubleshooting

### Erreur 500 ou 404
```bash
# SSH into Alwaysdata
ssh boushera-bai@ssh-boushera-bai.alwaysdata.net

# Vérifiez les logs
tail -f /var/www/boushera-bai/app/backend/storage/logs/laravel.log

# Vérifiez les permissions
chmod -R 755 /var/www/boushera-bai/public_html/app/backend
chmod -R 777 /var/www/boushera-bai/public_html/app/backend/storage
chmod -R 777 /var/www/boushera-bai/public_html/app/backend/bootstrap/cache
```

### Base de données non accessible
```bash
# Testez la connexion MySQL
mysql -h mysql-boushera-bai.alwaysdata.net \
      -u boushera-bai \
      -p boushera-bai_vitabi

# Si ça ne marche pas, vérifiez dans Alwaysdata Panel:
# - Les credentials MySQL
# - Que boushera-bai_vitabi existe
```

### Problèmes CORS
- ✅ Déjà configuré dans `backend/config/cors.php`
- Vérifiez que `https://vita-bi.vercel.app` y est

---

## 📋 Checklist

- [ ] Repository GitHub cloné sur Alwaysdata
- [ ] Composer packages installés
- [ ] `.env.production` copié en `.env`
- [ ] Migrations exécutées
- [ ] Répertoire racine configuré dans Alwaysdata
- [ ] `https://boushera-bai.alwaysdata.net/api/test` répond avec 200 OK
- [ ] Frontend Vercel peut se connecter au backend
- [ ] Tests de login/register fonctionnent

---

## 🔗 Ressources

- [Alwaysdata Documentation](https://help.alwaysdata.com)
- [Laravel Deployment](https://laravel.com/docs/deployment)
- [SSH Access](https://help.alwaysdata.com/en/remote-access/ssh/)
