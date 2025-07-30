#!/bin/bash
set -e

echo "Upgrading npm packages..."

# Update all packages to latest versions
npx npm-check-updates -u

# Install updated packages
npm install

# Run tests
npm test

# Commit changes
git commit package.json package-lock.json -m "Update npm packages"

echo "Package upgrade complete!"
