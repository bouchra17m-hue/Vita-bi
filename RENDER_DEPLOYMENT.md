# Déploiement Backend sur Render.com

## Étapes rapides:

### 1. Créer un compte Render
- Allez à https://render.com
- Connectez-vous avec GitHub (autorise Render à accéder à vos repos)

### 2. Créer un Web Service
- Cliquez sur **"New +"** → **"Web Service"**
- Sélectionnez le repo `Vita-bi`
- Configurez:
  - **Name**: `vitabi-backend`
  - **Environment**: PHP (sélectionnez PHP 8.1+)
  - **Build Command**: `cd backend && composer install --no-dev --optimize-autoloader`
  - **Start Command**: `cd backend && php artisan migrate --force && php -S 0.0.0.0:$PORT -t public`

### 3. Ajouter les variables d'environnement

Dans la section **"Environment"**, ajoutez:

```
APP_NAME=VitaBi
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:k4498nJ9KRlC8pLo6Wrl0SVKHBYz8WRVB6VSjbgROmQ=
APP_URL=https://vitabi-backend-xxxx.onrender.com

LOG_CHANNEL=stack

DB_CONNECTION=mysql
DB_HOST=mysql-boushera-bai.alwaysdata.net
DB_PORT=3306
DB_DATABASE=boushera-bai_vitabi
DB_USERNAME=boushera-bai
DB_PASSWORD=bouchra1975@@

BROADCAST_DRIVER=log
CACHE_DRIVER=file
QUEUE_CONNECTION=sync
SESSION_DRIVER=file

SANCTUM_STATEFUL_DOMAINS=localhost,127.0.0.1,vita-bi.vercel.app,localhost:5173

CORS_ALLOWED_ORIGINS=*
```

### 4. Déployer
- Cliquez **"Create Web Service"**
- Attendez ~3 minutes pour le déploiement

### 5. Récupérer l'URL
Une fois déployé, vous aurez une URL comme:
```
https://vitabi-backend-xxxx.onrender.com
```

### 6. Mettre à jour Vercel
1. Allez à https://vercel.com/dashboard
2. Sélectionnez votre projet `vita-bi`
3. Settings → Environment Variables
4. Modifiez `VITE_API_URL` avec:
```
https://vitabi-backend-xxxx.onrender.com
```
(remplacez `xxxx` par votre ID Render)
5. Redéployez: Git → Push sur GitHub

## Test
Une fois déployé, testez:
```bash
curl https://vitabi-backend-xxxx.onrender.com/api/test
```

Vous devriez voir:
```json
{"message":"Le backend Laravel fonctionne !","status":"success"}
```

---

**Note**: Render met en veille les services gratuits après 15 min d'inactivité.
Pour éviter, passez à un plan payant ou utilisez un service de "ping" pour garder le service actif.
