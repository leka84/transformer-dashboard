#!/bin/bash

# Production build script for Transformer Asset Dashboard
# This script creates an optimized production build with additional checks

set -e

echo "🚀 Starting production build process..."

# Environment setup
export NODE_ENV=production
export VUE_APP_ENV=production

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/
rm -rf node_modules/

# Install production dependencies only
echo "📦 Installing production dependencies..."
npm ci --only=production

# Install dev dependencies for build
echo "📦 Installing build dependencies..."
npm ci --only=dev

# Run all checks
echo "🔍 Running code quality checks..."
npm run lint
npm run type-check

# Build with production optimizations
echo "🏗️ Building production application..."
npm run build

# Verify build output
echo "✅ Verifying build output..."
if [ ! -d "dist" ]; then
    echo "❌ Build directory not found!"
    exit 1
fi

# Check build size
echo "📊 Build size analysis:"
du -sh dist/
find dist/ -name "*.js" -exec wc -c {} + | tail -1
find dist/ -name "*.css" -exec wc -c {} + | tail -1

# Test build integrity
echo "🧪 Testing build integrity..."
cd dist/
python3 -m http.server 8000 &
SERVER_PID=$!
sleep 3

if curl -f http://localhost:8000 > /dev/null 2>&1; then
    echo "✅ Build integrity test passed!"
else
    echo "❌ Build integrity test failed!"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

kill $SERVER_PID 2>/dev/null
cd ..

# Create production archive
echo "📦 Creating production archive..."
tar -czf transformer-dashboard-production.tar.gz dist/

echo "🎉 Production build completed successfully!"
echo "📁 Build output: dist/"
echo "📦 Production archive: transformer-dashboard-production.tar.gz"
