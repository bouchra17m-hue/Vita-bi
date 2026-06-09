#!/bin/bash
# VitaBi Alwaysdata Installation Script
# Execute sur: ssh-boushera-bai.alwaysdata.net
# User: boushera-bai
# Home: /home/boushera-bai/

set -e  # Exit on error

echo "🚀 VitaBi Alwaysdata Installation"
echo "===================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="boushera-bai.alwaysdata.net"
REPO_URL="https://github.com/bouchra17m-hue/Vita-bi.git"
WEB_ROOT="/var/www/boushera-bai/public_html"
APP_DIR="$WEB_ROOT/app"
BACKEND_DIR="$APP_DIR/backend"

echo -e "${BLUE}📋 Configuration:${NC}"
echo "Domain: $DOMAIN"
echo "Web Root: $WEB_ROOT"
echo "Repository: $REPO_URL"
echo ""

# Step 1: Verify directory exists
echo -e "${YELLOW}Step 1: Checking web directory...${NC}"
if [ ! -d "$WEB_ROOT" ]; then
    echo -e "${RED}❌ Directory $WEB_ROOT not found!${NC}"
    echo "Create it first via Alwaysdata Panel"
    exit 1
fi
echo -e "${GREEN}✅ Directory exists${NC}"

# Step 2: Clone or pull repository
echo -e "${YELLOW}Step 2: Cloning/Updating repository...${NC}"
if [ -d "$APP_DIR/.git" ]; then
    echo "Repository exists, pulling latest changes..."
    cd "$APP_DIR"
    git pull origin main
else
    echo "Cloning repository..."
    rm -rf "$APP_DIR" 2>/dev/null || true
    git clone "$REPO_URL" "$APP_DIR"
fi
cd "$BACKEND_DIR"
echo -e "${GREEN}✅ Repository ready${NC}"

# Step 3: Install PHP dependencies
echo -e "${YELLOW}Step 3: Installing PHP dependencies...${NC}"
if command -v composer &> /dev/null; then
    composer install --no-dev --optimize-autoloader
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${RED}❌ Composer not found!${NC}"
    echo "Install Composer or use Alwaysdata PHP console"
    exit 1
fi

# Step 4: Setup environment
echo -e "${YELLOW}Step 4: Setting up Laravel environment...${NC}"
cp .env.production .env
php artisan key:generate
echo -e "${GREEN}✅ Environment configured${NC}"

# Step 5: Create required directories
echo -e "${YELLOW}Step 5: Creating storage directories...${NC}"
mkdir -p storage/logs storage/framework/cache storage/framework/sessions storage/framework/views
chmod -R 755 storage bootstrap/cache
echo -e "${GREEN}✅ Directories ready${NC}"

# Step 6: Run migrations
echo -e "${YELLOW}Step 6: Running database migrations...${NC}"
php artisan migrate --force
echo -e "${GREEN}✅ Migrations completed${NC}"

# Step 7: Clear and cache
echo -e "${YELLOW}Step 7: Caching configuration...${NC}"
php artisan config:cache
php artisan route:cache
php artisan view:cache
echo -e "${GREEN}✅ Cache cleared and rebuilt${NC}"

# Step 8: Set permissions
echo -e "${YELLOW}Step 8: Setting file permissions...${NC}"
chmod -R 755 "$BACKEND_DIR"
chmod -R 777 "$BACKEND_DIR/storage"
chmod -R 777 "$BACKEND_DIR/bootstrap/cache"
echo -e "${GREEN}✅ Permissions set${NC}"

# Step 9: Verify installation
echo -e "${YELLOW}Step 9: Verifying installation...${NC}"
php artisan tinker --execute="echo 'Laravel is working!'"
echo -e "${GREEN}✅ Laravel verified${NC}"

echo ""
echo -e "${GREEN}✅ Installation Complete!${NC}"
echo ""
echo -e "${BLUE}📝 Next steps:${NC}"
echo "1. Go to Alwaysdata Panel → Sites & Domains"
echo "2. Select boushera-bai.alwaysdata.net"
echo "3. Set document root to: $BACKEND_DIR/public"
echo "4. Save and wait 1-2 minutes"
echo "5. Test: https://$DOMAIN/api/test"
echo ""
echo -e "${BLUE}📊 Test your API:${NC}"
echo "curl https://$DOMAIN/api/test"
echo "curl https://$DOMAIN/api/recipes"
echo ""
