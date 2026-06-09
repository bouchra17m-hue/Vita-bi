# Script PowerShell pour déployer VitaBi sur Alwaysdata

Write-Host "🚀 VitaBi Alwaysdata Deployment Script" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Couleurs
$success = 'Green'
$warning = 'Yellow'
$error = 'Red'

# 1. Commit et push les changements
Write-Host "📝 Étape 1: Commit et push les changements..." -ForegroundColor Cyan

$choices = New-Object Collections.ObjectModel.Collection[Management.Automation.Host.ChoiceDescription]
$choices.Add((New-Object Management.Automation.Host.ChoiceDescription -ArgumentList '&Oui','Procéder'))
$choices.Add((New-Object Management.Automation.Host.ChoiceDescription -ArgumentList '&Non','Annuler'))

$decision = $Host.UI.PromptForChoice('Êtes-vous prêt?', 'Voulez-vous continuer?', $choices, 0)

if ($decision -eq 1) {
    Write-Host "❌ Opération annulée." -ForegroundColor $error
    exit 1
}

# Allez au répertoire racine du projet
cd c:\Users\pro\Desktop\vitabi\Pfe_ihssaan

# Vérifiez l'état Git
Write-Host "`n📊 État Git:" -ForegroundColor Cyan
git status

# Commit
Write-Host "`n✏️  Committing changes..." -ForegroundColor Cyan
git add -A
git commit -m "config: Update Alwaysdata backend URL and prepare for deployment"

# Push
Write-Host "`n🚀 Pushing to GitHub..." -ForegroundColor Cyan
git push origin main

Write-Host "`n✅ Changements pushés!" -ForegroundColor $success

Write-Host "`n" -ForegroundColor Cyan
Write-Host "🔗 Prochaines étapes:" -ForegroundColor Cyan
Write-Host "1. Connectez-vous à Alwaysdata via SSH" -ForegroundColor White
Write-Host "   ssh boushera-bai@ssh-boushera-bai.alwaysdata.net" -ForegroundColor Yellow
Write-Host "" -ForegroundColor White
Write-Host "2. Clonez le repository:" -ForegroundColor White
Write-Host "   cd /var/www/boushera-bai/public_html" -ForegroundColor Yellow
Write-Host "   git clone https://github.com/VOTRE-USERNAME/Pfe_ihssaan.git app" -ForegroundColor Yellow
Write-Host "" -ForegroundColor White
Write-Host "3. Installez les dépendances:" -ForegroundColor White
Write-Host "   cd app/backend" -ForegroundColor Yellow
Write-Host "   composer install --no-dev --optimize-autoloader" -ForegroundColor Yellow
Write-Host "" -ForegroundColor White
Write-Host "4. Configurez l'application:" -ForegroundColor White
Write-Host "   cp .env.production .env" -ForegroundColor Yellow
Write-Host "   php artisan key:generate" -ForegroundColor Yellow
Write-Host "   php artisan migrate --force" -ForegroundColor Yellow
Write-Host "" -ForegroundColor White
Write-Host "5. Nettoyez le cache:" -ForegroundColor White
Write-Host "   php artisan config:cache" -ForegroundColor Yellow
Write-Host "   php artisan route:cache" -ForegroundColor Yellow
Write-Host "" -ForegroundColor White
Write-Host "6. Testez l'API:" -ForegroundColor White
Write-Host "   curl https://boushera-bai.alwaysdata.net/api/test" -ForegroundColor Yellow
Write-Host "" -ForegroundColor White
Write-Host "Pour plus de détails, consultez: ALWAYSDATA_DEPLOYMENT.md" -ForegroundColor Cyan
