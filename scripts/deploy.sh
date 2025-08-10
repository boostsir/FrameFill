#!/bin/bash

# Deploy script for GitHub Pages
# This script builds the project and pushes the dist folder to gh-pages branch

set -e

echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if git working directory is clean
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Error: Working directory is not clean. Please commit or stash your changes."
    exit 1
fi

# Install dependencies and run tests
echo "📦 Installing dependencies..."
npm ci

echo "🧪 Running tests..."
npm test

echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ ! -f "dist/index.html" ]; then
    echo "❌ Error: Build failed. dist/index.html not found."
    exit 1
fi

echo "📁 Build successful! File size: $(du -h dist/index.html | cut -f1)"

# Create a temporary directory for gh-pages
TEMP_DIR=$(mktemp -d)
cp -r dist/* "$TEMP_DIR/"

# Add a custom 404.html (GitHub Pages will serve index.html for 404s automatically)
cp "$TEMP_DIR/index.html" "$TEMP_DIR/404.html"

# Create or update gh-pages branch
if git show-ref --verify --quiet refs/heads/gh-pages; then
    echo "📤 Updating existing gh-pages branch..."
    git checkout gh-pages
    git rm -rf .
else
    echo "🌟 Creating new gh-pages branch..."
    git checkout --orphan gh-pages
    git rm -rf .
fi

# Copy built files
cp -r "$TEMP_DIR"/* .

# Add CNAME file if you have a custom domain (uncomment and modify if needed)
# echo "your-domain.com" > CNAME

# Commit and push
git add .
git commit -m "Deploy to GitHub Pages

Built from commit: $(git rev-parse main)
Generated on: $(date -u)

🤖 Generated with [Claude Code](https://claude.ai/code)"

echo "🚀 Pushing to GitHub Pages..."
git push origin gh-pages

# Return to main branch
git checkout main

# Clean up
rm -rf "$TEMP_DIR"

echo "✅ Deployment complete!"
echo "🌐 Your site should be available at: https://$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^/]*\)\/\([^.]*\).*/\1.github.io\/\2/')/"