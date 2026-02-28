#!/bin/bash
set -e

# Initialize npm project
npm init -y

# Install dev dependencies
npm install --save-dev typescript vite

# Initialize TypeScript config
npx tsc --init

# Initialize git repo
git init
git add -A
git commit -m "chore: init project"

echo "✅ Phase 1 init complete"
