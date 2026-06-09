# 🔧 Configuration Backend - Production & Développement

## 📋 État Actuel

- **Frontend (Vercel)**: https://vita-bi.vercel.app
- **Backend**: ❌ Non accessible (domaine invalide)
- **Base de données**: Alwaysdata MySQL

---

## 🚀 Solution: Détection Automatique du Backend

Le frontend détecte automatiquement l'URL du backend selon l'environnement:

### Développement Local
```
Frontend: http://localhost:5174 (ou 5176)
Backend: http://127.0.0.1:8000
Configuration: Automatique (pas besoin de .env)
```

### Production (Vercel)
Le frontend essaie plusieurs URL backend dans cet ordre:
1. **Premier choix**: `https://boushera-bai.alwaysdata.net`
2. **Fallback**: `https://vitabi-backend-xxxx.onrender.com` (à configurer)

---

## ⚙️ Configuration Production (À FAIRE)

### Option 1: Utiliser Alwaysdata (Actuel)

1. **Vérifier que le serveur Alwaysdata fonctionne**:
   ```bash
   curl https://boushera-bai.alwaysdata.net/api/test
   ```
   
2. **Si l'URL est incorrecte**, mettre à jour:
   - [pfevitabi/.env.production](pfevitabi/.env.production)
   - [backend/.env.production](backend/.env.production)
   - [backend/config/cors.php](backend/config/cors.php)

### Option 2: Utiliser Render (Recommandé)

1. **Déployer sur Render**:
   - Allez sur https://render.com
   - Créez un nouveau Web Service
   - Connectez votre repo GitHub
   - Utilisez `render.yaml` comme config

2. **Récupérer l'URL Render** (format: `https://vitabi-backend-xxxx.onrender.com`)

3. **Mettre à jour** [pfevitabi/.env.production](pfevitabi/.env.production):
   ```env
   VITE_API_URL=https://vitabi-backend-xxxx.onrender.com
   ```

4. **Mettre à jour** [backend/.env.production](backend/.env.production):
   ```
   APP_URL=https://vitabi-backend-xxxx.onrender.com
   ```

5. **Mettre à jour** [backend/config/cors.php](backend/config/cors.php):
   ```php
   'allowed_origins' => [
       'https://vita-bi.vercel.app',
       'https://vitabi-backend-xxxx.onrender.com',
   ],
   ```

---

## 🧪 Tests

### Localement
```bash
# Terminal 1: Backend
cd backend
php artisan serve --port=8000

# Terminal 2: Frontend
cd pfevitabi
npm run dev

# Testez: http://localhost:5174/login
```

### En Production
```bash
# Vérifier que le backend répond
curl https://[VOTRE-BACKEND-URL]/api/test

# Vérifier les logs Render/Alwaysdata
```

---

## 📝 Environnements

| Variable | Développement | Production |
|----------|---|---|
| `VITE_API_URL` | Auto-détecté | `.env.production` |
| `APP_URL` | Auto (localhost) | `.env.production` |
| `APP_DEBUG` | true | false |

---

## ✅ Checklist

- [ ] Backend déployé et accessible
- [ ] URL backend correcte dans `.env.production`
- [ ] CORS configuré pour l'URL du frontend
- [ ] Tests de connexion/inscription fonctionnent
- [ ] Logs de Render/Alwaysdata propres (pas d'erreurs)
