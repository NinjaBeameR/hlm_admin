#!/bin/bash
# Netlify build script to ensure clean deployments

echo "🚀 Starting Netlify build process..."
echo "🕐 Build timestamp: $(date)"

# Clean any existing dist folder
echo "🧹 Cleaning dist folder..."
rm -rf dist

# Install dependencies (already done by Netlify)
echo "📦 Dependencies should already be installed..."

# Build the project
echo "🔨 Building project..."
npm run build

# Verify build output
echo "✅ Build complete! Contents of dist:"
ls -la dist/

echo "🎉 Build process finished successfully!"