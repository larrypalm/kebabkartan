#!/bin/bash

# Ensure we're in the correct directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "🚀 Starting local Amplify build test..."
echo "Working directory: $(pwd)"

# Switch to the required Node.js version
echo "🔄 Switching Node.js version..."
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
nvm use

# Check for required files
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found!"
    exit 1
fi

if [ ! -f "package-lock.json" ]; then
    echo "⚠️  Warning: package-lock.json not found. Running npm install first..."
    npm install
fi

echo "📦 Running preBuild phase..."
echo "Running: npm ci"
npm ci

echo "🏗️ Running build phase..."
echo "Running: npm run build"
npm run build

echo "✅ Build completed!"
echo "Build artifacts should be in the .next directory"

# Optional: Check if build artifacts exist
if [ -d ".next" ]; then
    echo "✨ .next directory exists with the following files:"
    ls -la .next
else
    echo "❌ Error: .next directory not found!"
    exit 1
fi 