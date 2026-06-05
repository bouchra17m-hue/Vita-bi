#!/bin/bash
# Configuration helper script for VitaBi deployment

echo "🚀 VitaBi Deployment Configuration"
echo "===================================="
echo ""

# Detect environment
if [ "$VERCEL" = "1" ]; then
    echo "✅ Running on Vercel"
    ENVIRONMENT="production"
else
    echo "🏠 Running locally"
    ENVIRONMENT="development"
fi

echo ""
echo "Current Environment: $ENVIRONMENT"
echo ""

# Check if .env exists
if [ -f ".env.production" ]; then
    echo "✅ .env.production exists"
else
    echo "⚠️  .env.production does NOT exist"
    echo "   Creating from example..."
    if [ -f ".env.production.example" ]; then
        cp .env.production.example .env.production
        echo "✅ Created .env.production"
    fi
fi

echo ""
echo "📝 Environment Variables:"
echo "========================="

# Show current API URL
if [ -f ".env.production" ]; then
    API_URL=$(grep VITE_API_URL .env.production | cut -d '=' -f 2)
    echo "VITE_API_URL=$API_URL"
else
    echo "⚠️  No .env file found"
fi

echo ""
echo "🔧 To configure on Vercel Dashboard:"
echo "====================================="
echo "1. Go to: https://vercel.com/dashboard"
echo "2. Select your project"
echo "3. Settings → Environment Variables"
echo "4. Add/Update:"
echo "   - Variable: VITE_API_URL"
echo "   - Value: https://api.YOUR-BACKEND-DOMAIN.com"
echo "   - Environments: Production, Preview, Development"
echo "5. Click 'Save'"
echo "6. Redeploy the project"
echo ""

echo "✅ Configuration helper completed!"
