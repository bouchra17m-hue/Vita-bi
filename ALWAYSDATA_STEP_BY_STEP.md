# 🚀 Déploiement VitaBi sur Alwaysdata - Guide Étape par Étape

## 📌 Informations de votre Alwaysdata

```
Hôte SSH: ssh-boushera-bai.alwaysdata.net
Utilisateur: boushera-bai
Répertoire HOME: /home/boushera-bai/
Authentification: Mot de passe (clé SSH disponible)
```

---

## ✅ ÉTAPE 1: Connectez-vous via SSH

### Avec PowerShell (Windows)
```powershell
ssh boushera-bai@ssh-boushera-bai.alwaysdata.net
# Entrez votre mot de passe quand demandé
```

### Avec Git Bash ou WSL
```bash
ssh boushera-bai@ssh-boushera-bai.alwaysdata.net
```

### Avec PuTTY (Interface graphique)
1. Téléchargez PuTTY: https://www.putty.org/
2. Host: `ssh-boushera-bai.alwaysdata.net`
3. Port: `22`
4. User: `boushera-bai`
5. Connectez et entrez le mot de passe

---

## ✅ ÉTAPE 2: Vérifiez la structure

Une fois connecté, exécutez:

```bash
# Vérifiez où vous êtes
pwd
# Doit afficher: /home/boushera-bai

# Listez les répertoires
ls -la
```

---

## ✅ ÉTAPE 3: Clonez le repository GitHub

```bash
# Allez au répertoire web
cd /var/www/boushera-bai/public_html

# Listez ce qui existe déjà
ls -la

# Clonez le repository
git clone https://github.com/bouchra17m-hue/Vita-bi.git app

# Allez dans le dossier backend
cd app/backend
```

---

## ✅ ÉTAPE 4: Installez les dépendances PHP

```bash
# Installez les packages Composer
composer install --no-dev --optimize-autoloader

# Attendez que ça se termine (peut prendre 2-5 minutes)
```

Si vous avez une erreur "composer: command not found", utilisez:
```bash
php composer.phar install --no-dev --optimize-autoloader
```

---

## ✅ ÉTAPE 5: Configurez Laravel

```bash
# Copiez le fichier .env production
cp .env.production .env

# Générez la clé application
php artisan key:generate

# Créez les répertoires storage
mkdir -p storage/logs storage/framework/cache storage/framework/sessions
mkdir -p storage/framework/views

# Définissez les permissions
chmod -R 755 storage bootstrap/cache
chmod -R 777 storage bootstrap/cache
```

---

## ✅ ÉTAPE 6: Exécutez les migrations

```bash
# Migrez la base de données
php artisan migrate --force

# (Optionnel) Seedez les données
# php artisan db:seed --force
```

---

## ✅ ÉTAPE 7: Nettoyez le cache

```bash
# Mettez en cache la configuration
php artisan config:cache

# Mettez en cache les routes
php artisan route:cache

# (Optionnel) Mettez en cache les vues
# php artisan view:cache
```

---

## ✅ ÉTAPE 8: Vérifiez l'installation

```bash
# Testez que Laravel fonctionne
php artisan tinker
# > echo 'Laravel works!';
# > exit

# Testez l'accès à la base de données
php artisan migrate:status
```

---

## ✅ ÉTAPE 9: Configurez le domaine dans Alwaysdata Panel

1. **Déconnectez-vous de SSH** (`exit`)
2. Allez à **https://admin.alwaysdata.com/**
3. Connectez-vous avec vos identifiants Alwaysdata
4. Allez à **Sites & Domains** (ou Web → Sites)
5. Cliquez sur **boushera-bai.alwaysdata.net**
6. Changez le **Document root** (Répertoire racine) vers:
   ```
   /var/www/boushera-bai/public_html/app/backend/public
   ```
7. **Enregistrez** et attendez 1-2 minutes pour que les changements prennent effet

---

## ✅ ÉTAPE 10: Testez l'API

```bash
# Testez depuis votre PC (PowerShell ou terminal)
curl https://boushera-bai.alwaysdata.net/api/test

# Doit afficher:
# {"message":"Le backend Laravel fonctionne !","status":"success"}

# Testez une autre route
curl https://boushera-bai.alwaysdata.net/api/recipes
```

---

## ✅ ÉTAPE 11: Vérifiez les logs en cas d'erreur

Si vous avez une erreur 500:

```bash
# Connectez-vous à nouveau
ssh boushera-bai@ssh-boushera-bai.alwaysdata.net

# Allez au backend
cd /var/www/boushera-bai/public_html/app/backend

# Lisez les logs
tail -f storage/logs/laravel.log

# Appuyez sur Ctrl+C pour arrêter
```

---

## ⚠️ Problèmes Courants

### Erreur: "composer not found"
Alwaysdata fournit Composer. Essayez:
```bash
/usr/bin/composer install --no-dev --optimize-autoloader
```

### Erreur: "permission denied" sur storage/
```bash
chmod -R 777 /var/www/boushera-bai/public_html/app/backend/storage
chmod -R 777 /var/www/boushera-bai/public_html/app/backend/bootstrap/cache
```

### Erreur: "Class not found" ou "500 error"
Nettoyez le cache:
```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

### Base de données ne se connecte pas
Vérifiez `.env`:
```bash
cat .env | grep DB_
# Doit afficher les bonnes credentials
```

---

## 📋 Checklist Finale

- [ ] Connecté via SSH à Alwaysdata
- [ ] Repository cloné en `/var/www/boushera-bai/public_html/app`
- [ ] Composer dependencies installées
- [ ] `.env` configuré
- [ ] Migrations exécutées
- [ ] Cache nettoyé
- [ ] Document root configuré dans Alwaysdata Panel
- [ ] `https://boushera-bai.alwaysdata.net/api/test` répond avec 200 OK
- [ ] Frontend Vercel se connecte au backend

---

## 🎉 Succès!

Une fois les étapes complétées:

1. **Frontend Vercel** communiquera automatiquement avec le backend
2. **Login/Register** fonctionneront correctement
3. **L'erreur "Impossible de joindre le serveur"** disparaîtra

---

## 💡 Script Automatisé (Optionnel)

Si vous avez un accès SSH avancé, vous pouvez exécuter:
```bash
curl https://raw.githubusercontent.com/bouchra17m-hue/Vita-bi/main/install-alwaysdata.sh | bash
```

Sinon, suivez les étapes manuelles ci-dessus.
