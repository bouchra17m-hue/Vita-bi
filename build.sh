#!/bin/bash
# Build script for Vercel
set -e

echo "🔨 Building VitaBi Frontend..."

cd pfevitabi

echo "📦 Installing dependencies..."
npm install

echo "🏗️ Building with Vite..."
npm run build

echo "✅ Build completed successfully!"
