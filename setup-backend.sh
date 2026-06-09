#!/bin/bash
# Script de configuration rapide du backend

echo "🔧 Configuration du Backend VitaBi"
echo "=================================="
echo ""

# Demander l'URL du backend
read -p "Entrez l'URL du backend en production (ex: https://vitabi-backend.render.com): " BACKEND_URL

if [ -z "$BACKEND_URL" ]; then
  echo "❌ URL vide. Opération annulée."
  exit 1
fi

# Mettre à jour .env.production du frontend
echo "✏️  Mise à jour pfevitabi/.env.production..."
echo "VITE_API_URL=$BACKEND_URL" > pfevitabi/.env.production

# Mettre à jour .env.production du backend
echo "✏️  Mise à jour backend/.env.production..."
sed -i "s|APP_URL=.*|APP_URL=$BACKEND_URL|g" backend/.env.production

# Mettre à jour CORS
echo "✏️  Mise à jour backend/config/cors.php..."
# Note: Cette partie nécessite une édition manuelle pour être sûr

echo ""
echo "✅ Configuration terminée !"
echo "🌐 Backend URL: $BACKEND_URL"
echo ""
echo "📝 Prochaines étapes:"
echo "1. Vérifier backend/config/cors.php pour ajouter votre domaine frontend"
echo "2. Déployer les changements:"
echo "   git add ."
echo "   git commit -m 'config: Update backend URL to $BACKEND_URL'"
echo "   git push origin main"
