# VitaBi - Solution Déploiement Complet

> Application complète: Frontend React + Backend Laravel + Base de données MySQL

## 🎯 État Actuel

### ✅ Fonctionnalités Implémentées

- **Authentification complète**
  - Inscription des utilisateurs
  - Connexion/Déconnexion
  - Tokens Sanctum API
  - Gestion des rôles (Admin/User)

- **Backend API**
  - Endpoints RESTful
  - CORS configuré
  - MySQL intégré

- **Frontend React**
  - Interface moderne
  - Responsive design
  - Gestion d'état (AuthContext)
  - Pages principales (Home, Shop, Admin, Profil)

- **Admin Panel**
  - Gestion des produits
  - Formulaires d'ajout/modification
  - Catalogue en temps réel

---

## 🚀 Déploiement en Ligne

### Architecture Production

```
┌─────────────────────────────────────┐
│      Frontend (Vercel)              │
│  https://vita-bi.vercel.app         │
└──────────┬──────────────────────────┘
           │ HTTP/API Calls
           ↓
┌─────────────────────────────────────┐
│      Backend API (Alwaysdata)       │
│  https://api.vita-bi.alwaysdata.net │
└──────────┬──────────────────────────┘
           │ SQL Queries
           ↓
┌─────────────────────────────────────┐
│   MySQL Database (Alwaysdata)       │
│   boushera-bai_vitabi               │
└─────────────────────────────────────┘
```

### 3 Étapes pour Déployer

#### 1️⃣ Déployer le Backend

**Sur Alwaysdata (recommandé):**

```bash
# SSH vers Alwaysdata
# Uploader backend/ 
# Configurer .env avec:
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.vita-bi.alwaysdata.net
DB_* = [vos identifiants]

# Exécuter:
composer install
php artisan migrate
php artisan config:cache
```

**Résultat:** API accessible sur `https://api.vita-bi.alwaysdata.net/api/test`

#### 2️⃣ Configurer Vercel

**Dans Vercel Dashboard:**

1. Settings → Environment Variables
2. Variable: `VITE_API_URL`
3. Value: `https://api.vita-bi.alwaysdata.net`
4. Sauvegarder → Redéployer

#### 3️⃣ Tester

```bash
# Frontend
curl https://vita-bi.vercel.app

# API
curl https://api.vita-bi.alwaysdata.net/api/test

# S'inscrire
curl -X POST https://api.vita-bi.alwaysdata.net/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"password123","password_confirmation":"password123"}'
```

---

## 📚 Documentation Complète

Voir les fichiers:

- **[DEPLOYER_EN_LIGNE.md](./DEPLOYER_EN_LIGNE.md)** - Guide détaillé complet
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Configuration Vercel
- **[backend/](./backend/)** - Code backend Laravel
- **[pfevitabi/](./pfevitabi/)** - Code frontend React

---

## 🛠️ Développement Local

### Démarrer

```bash
# Terminal 1: Backend
cd backend
php artisan serve
# Accessible: http://127.0.0.1:8000

# Terminal 2: Frontend  
cd pfevitabi
npm run dev
# Accessible: http://localhost:5173
```

### Se Connecter (Développement)

**Admin:**
- Email: `superadmin@vitabi.com`
- Mot de passe: `admin123`

**Ou créer un compte via l'interface d'inscription**

---

## 📋 Checklist Déploiement

### Backend (Alwaysdata)
- [ ] Code uploadé sur serveur
- [ ] Dépendances installées (`composer install`)
- [ ] Migrations exécutées (`php artisan migrate`)
- [ ] Fichier `.env` configuré
- [ ] API accessible en HTTPS

### Frontend (Vercel)
- [ ] Variable `VITE_API_URL` configurée
- [ ] Frontend redéployé après changements
- [ ] Accessible en HTTPS

### Tests
- [ ] API répond: `curl https://api.*/api/test`
- [ ] S'inscrire fonctionne
- [ ] Se connecter fonctionne
- [ ] Admin panel accessible
- [ ] Pas d'erreurs CORS

---

## 🐛 Troubleshooting

### "Impossible de joindre le backend"

**Développement:**
- Vérifier que `php artisan serve` est lancé sur `http://127.0.0.1:8000`

**Production:**
- Vérifier `VITE_API_URL` dans Vercel Settings
- Vérifier que l'API est accessible: `curl https://api.*/api/test`
- Redéployer le frontend sur Vercel

### Erreur CORS

Vérifier `backend/config/cors.php`:
```php
'allowed_origins' => ['*'],
'supports_credentials' => false,
```

### Sessions ne persistent pas

- Vérifier localStorage: `F12 → Console → localStorage.getItem('token')`
- Vérifier `SANCTUM_STATEFUL_DOMAINS` dans `.env` du backend

---

## 📞 Support

- **Développement:** Voir logs en terminal (backend) et Console F12 (frontend)
- **Production:** Logs sur serveur Alwaysdata + Vercel Dashboard
- **Questions:** Consulter les fichiers `DEPLOYER_EN_LIGNE.md` et `DEPLOYMENT_GUIDE.md`

---

## 📝 Notes

- Base de données MySQL: `boushera-bai_vitabi` sur `mysql-boushera-bai.alwaysdata.net`
- Frontend Vercel: `vita-bi.vercel.app` (à remplacer par votre URL réelle)
- Backend Alwaysdata: `api.vita-bi.alwaysdata.net` (à remplacer par votre domaine)
- Tokens API: Bearer tokens Sanctum (stockés en localStorage)

---

**Status:** ✅ Prêt pour déploiement  
**Dernière mise à jour:** Juin 2026  
**Auteur:** VitaBi Development Team
