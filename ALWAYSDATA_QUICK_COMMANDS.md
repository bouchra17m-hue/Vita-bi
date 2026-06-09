# 🚀 Commandes Rapides - Copie/Colle Alwaysdata

## 📌 Connexion SSH

```bash
ssh boushera-bai@ssh-boushera-bai.alwaysdata.net
# Entrez votre mot de passe
```

---

## 🔄 Commandes Complètes (Copie/Colle)

Exécutez ces commandes **dans l'ordre**:

### 1️⃣ Clonez le repository
```bash
cd /var/www/boushera-bai/public_html && rm -rf app 2>/dev/null; git clone https://github.com/bouchra17m-hue/Vita-bi.git app && cd app/backend
```

### 2️⃣ Installez les dépendances
```bash
composer install --no-dev --optimize-autoloader
```

### 3️⃣ Configurez Laravel
```bash
cp .env.production .env && php artisan key:generate
```

### 4️⃣ Créez les répertoires storage
```bash
mkdir -p storage/logs storage/framework/{cache,sessions,views} && chmod -R 755 storage bootstrap/cache && chmod -R 777 storage bootstrap/cache
```

### 5️⃣ Exécutez les migrations
```bash
php artisan migrate --force
```

### 6️⃣ Nettoyez le cache
```bash
php artisan config:cache && php artisan route:cache
```

### 7️⃣ Vérifiez l'installation
```bash
php artisan tinker --execute="echo 'Laravel OK!';" && php artisan migrate:status
```

---

## ✅ Testez l'API

Depuis votre **PC** (pas sur SSH), exécutez:

```powershell
# PowerShell
curl https://boushera-bai.alwaysdata.net/api/test
curl https://boushera-bai.alwaysdata.net/api/recipes
```

```bash
# Git Bash / Linux / Mac
curl https://boushera-bai.alwaysdata.net/api/test
curl https://boushera-bai.alwaysdata.net/api/recipes
```

---

## 🔧 Maintenance

### Voir les logs Laravel
```bash
tail -f /var/www/boushera-bai/public_html/app/backend/storage/logs/laravel.log
# Appuyez sur Ctrl+C pour arrêter
```

### Nettoyer le cache (si erreurs)
```bash
cd /var/www/boushera-bai/public_html/app/backend && php artisan cache:clear && php artisan config:clear && php artisan route:clear
```

### Mettre à jour le code
```bash
cd /var/www/boushera-bai/public_html/app/backend && git pull origin main && php artisan migrate --force
```

### Redémarrer PHP (au besoin)
```bash
# Alwaysdata gère cela automatiquement, mais si nécessaire:
php-cgi -v  # pour vérifier la version
```

---

## 📋 Checklist

Après chaque étape, vérifiez:

```bash
# Test simple
php artisan tinker --execute="echo 'OK';"

# Vérifiez les erreurs
cat /var/www/boushera-bai/public_html/app/backend/storage/logs/laravel.log | tail -20
```

---

## 💡 Raccourcis Utiles

### Tout en une ligne (si les étapes 1-6 sont rapides)
```bash
cd /var/www/boushera-bai/public_html && rm -rf app && git clone https://github.com/bouchra17m-hue/Vita-bi.git app && cd app/backend && composer install --no-dev --optimize-autoloader && cp .env.production .env && php artisan key:generate && mkdir -p storage/logs storage/framework/{cache,sessions,views} && chmod -R 755 storage bootstrap/cache && chmod -R 777 storage bootstrap/cache && php artisan migrate --force && php artisan config:cache && php artisan route:cache && echo "✅ Installation terminée!"
```

---

## 🆘 Aide Rapide

| Problème | Solution |
|----------|----------|
| `composer not found` | Utilisez le chemin complet: `/usr/bin/composer` |
| `permission denied` | `chmod -R 777 storage bootstrap/cache` |
| Erreur 500 | Vérifiez: `tail -f storage/logs/laravel.log` |
| Base de données | Vérifiez `.env`: `cat .env \| grep DB_` |
| Les routes ne fonctionnent pas | `php artisan route:cache` |
| Les vues ne chargent pas | `php artisan view:cache` |

---

## 🎯 Après Deployment

Une fois que `https://boushera-bai.alwaysdata.net/api/test` fonctionne:

1. Allez dans **Alwaysdata Panel**
2. Configurez le **Document root** vers `/var/www/boushera-bai/public_html/app/backend/public`
3. Attendez 1-2 minutes
4. Testez: `curl https://boushera-bai.alwaysdata.net/api/test`
5. Frontend Vercel se connectera automatiquement! ✨
